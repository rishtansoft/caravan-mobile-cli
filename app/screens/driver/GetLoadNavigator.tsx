import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import MapboxGl from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import { Position } from 'geojson';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ActiveLoadsDetailMapProps } from './RouterType';

MapboxGl.setAccessToken("pk.eyJ1IjoiaWJyb2hpbWpvbjI1IiwiYSI6ImNtMG8zYm83NzA0bDcybHIxOHlreXRyZnYifQ.7QYLNFuaTX9uaDfvV0054Q");

const DESTINATION = {
    latitude: 40.360662616387124,
    longitude: 71.27842449580187
};
interface PositionInterface {
    longitude: number,
    latitude: number,
    address?: string
}
const GetLoadNavigator: React.FC<ActiveLoadsDetailMapProps> = ({ navigation, route }) => {

    const [currentLocation, setCurrentLocation] = useState<PositionInterface | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<Position[]>([]);
    const [navigationStarted, setNavigationStarted] = useState(false);
    const [remainingDistance, setRemainingDistance] = useState<string>('');
    const [estimatedTime, setEstimatedTime] = useState<string>('');
    const [currentSpeed, setCurrentSpeed] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [locationPermissionError, setLocationPermissionError] = useState<string | null>(null);
    const [nextManeuver, setNextManeuver] = useState<string>('');
    const [loadStartAddress, setLoadStartAddress] = useState<PositionInterface | null>(null)
    const watchId = useRef<number | null>(null);
    const mapRef = useRef<MapboxGl.MapView | null>(null);
    const cameraRef = useRef<MapboxGl.Camera | null>(null);

    useEffect(() => {
        if (route.params?.data[0]?.longitude) {
            setLoadStartAddress({ latitude: route.params.data[0].latitude, longitude: route.params.data[0].longitude })
        }
    }, [])

    const requestLocationPermission = async () => {
        try {
            const permission = Platform.OS === 'ios'
                ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

            const granted = await check(permission);

            if (granted === RESULTS.GRANTED) {
                return true;
            }

            const requestResult = await request(permission);
            return requestResult === RESULTS.GRANTED;
        } catch (error) {
            console.error('Location permission error:', error);
            setLocationPermissionError('Joylashuv ruxsati berilmadi');
            return false;
        }
    };

    const calculateRoute = async (start: Position) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${loadStartAddress.longitude},${loadStartAddress.latitude}?geometries=geojson&overview=full&steps=true&access_token=pk.eyJ1IjoiaWJyb2hpbWpvbjI1IiwiYSI6ImNtMG8zYm83NzA0bDcybHIxOHlreXRyZnYifQ.7QYLNFuaTX9uaDfvV0054Q`
            );
            const data = await response.json();

            if (data.routes && data.routes[0]) {
                setRouteCoordinates(data.routes[0].geometry.coordinates);

                const distanceKm = (data.routes[0].distance / 1000).toFixed(1);
                const durationMinutes = Math.round(data.routes[0].duration / 60);
                const hours = Math.floor(durationMinutes / 60);
                const minutes = durationMinutes % 60;

                setRemainingDistance(`${distanceKm} km`);
                setEstimatedTime(
                    hours > 0
                        ? `${hours} soat ${minutes} daqiqa`
                        : `${minutes} daqiqa`
                );

                // Extract next maneuver
                if (data.routes[0].steps && data.routes[0].steps[0]) {
                    setNextManeuver(data.routes[0].steps[0].maneuver.instruction);
                }
            }
        } catch (error) {
            console.error('Route calculation error:', error);
            Alert.alert('Xato', 'Yo\'nalishni hisoblashda xatolik yuz berdi');
        }
    };

    const startNavigation = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            Alert.alert('Xato', 'Navigatsiya uchun joylashuv ruxsati kerak');
            return;
        }

        setNavigationStarted(true);

        // Initial camera position for navigation mode
        if (currentLocation && cameraRef.current) {
            cameraRef.current.setCamera({
                centerCoordinate: [currentLocation.longitude, currentLocation.latitude],
                zoomLevel: 18,
                pitch: 60,
                heading: 0
            });
        }

        watchId.current = Geolocation.watchPosition(
            position => {
                const newLocation: PositionInterface = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                setCurrentLocation(newLocation);
                setCurrentSpeed(position.coords.speed || 0);
                calculateRoute(newLocation);

                // Update camera in navigation mode
                if (cameraRef.current) {
                    cameraRef.current.setCamera({
                        centerCoordinate: [newLocation.longitude, newLocation.latitude],
                        zoomLevel: 18,
                        pitch: 60,
                        heading: position.coords.heading || 0
                    });
                }
            },
            error => {
                console.error('Location tracking error:', error);
                Alert.alert('Xato', 'Joylashuvni kuzatishda xatolik yuz berdi');
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 5,
                interval: 1000,
                fastestInterval: 500
            }
        );
    };

    const stopNavigation = () => {
        if (watchId.current !== null) {
            Geolocation.clearWatch(watchId.current);
        }
        setNavigationStarted(false);
    };

    useEffect(() => {
        const initializeLocation = async () => {
            try {
                const hasPermission = await requestLocationPermission();
                if (!hasPermission) {
                    setIsLoading(false);
                    return;
                }

                Geolocation.getCurrentPosition(
                    position => {
                        const location = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        };
                        setCurrentLocation(location);
                        calculateRoute(location);
                        setIsLoading(false);
                    },
                    error => {
                        console.error('Initial location error:', error);
                        setLocationPermissionError('Joriy joylashuvni olishda xatolik');
                        setIsLoading(false);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000
                    }
                );
            } catch (error) {
                console.error('Initialization error:', error);
                setLocationPermissionError('Joriy joylashuvni olib bo\'lmadi');
                setIsLoading(false);
            }
        };

        initializeLocation();

        return () => {
            if (watchId.current !== null) {
                Geolocation.clearWatch(watchId.current);
            }
        };
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7257FF" />
                <Text style={styles.loadingText}>Joylashuv aniqlanmoqda...</Text>
            </View>
        ); // r56yguk
    }


    const recenterCamera = () => {
        if (currentLocation && cameraRef.current) {
            cameraRef.current.setCamera({
                centerCoordinate: [currentLocation.longitude, currentLocation.latitude],
                zoomLevel: 18,
                pitch: 60,
                heading: 0
            });
        }
    };

    return (
        <View style={styles.container}>
            {navigationStarted ? (
                // Navigation mode UI
                <View style={styles.navigationHeader}>
                    <Text style={styles.nextManeuverText}>{nextManeuver}</Text>
                    <View style={styles.speedLimit}>
                        <Text style={styles.speedText}>{Math.round(currentSpeed * 3.6)} km/h</Text>
                    </View>

                    <View style={styles.navigationInfo}>
                        <Text style={styles.distanceText}>{remainingDistance}</Text>
                        <Text style={styles.timeText}>{estimatedTime}</Text>
                    </View>
                </View>
            ) : (
                // Normal mode header
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="angle-left" size={30} color="#7257FF" />
                    </TouchableOpacity>
                    <View style={styles.navigationInfo}>
                        <Text style={styles.distanceText}>{remainingDistance}</Text>
                        <Text style={styles.timeText}>{estimatedTime}</Text>
                    </View>
                </View>
            )}

            <MapboxGl.MapView
                ref={mapRef}
                style={styles.map}
                styleURL={MapboxGl.StyleURL.Light}
                compassEnabled={true}
                compassViewPosition={3}
                logoEnabled={false}
                pitchEnabled={true}
                rotateEnabled={true}
            >
                <MapboxGl.Camera
                    ref={cameraRef}
                    zoomLevel={15}
                    animationMode="flyTo"
                    animationDuration={2000}
                />

                {navigationStarted ? (
                    // Custom user location marker for navigation mode
                    <MapboxGl.MarkerView
                        coordinate={[
                            currentLocation?.longitude || 0,
                            currentLocation?.latitude || 0
                        ]}
                    >
                        <View style={[
                            styles.navigationArrow,
                            { transform: [{ rotate: `${currentLocation?.bearing || 0}deg` }] }
                        ]}>
                            <Icon name="location-arrow" size={35} color="#7257FF" />

                        </View>
                    </MapboxGl.MarkerView>
                ) : (
                    // Default user location marker
                    <MapboxGl.UserLocation
                        visible={true}
                        animated={true}
                        showsUserHeadingIndicator={true}
                    />
                )}

                {routeCoordinates.length > 0 && (
                    <MapboxGl.ShapeSource
                        id="routeSource"
                        shape={{
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: routeCoordinates,
                            },
                        }}
                    >
                        <MapboxGl.LineLayer
                            id="routeLayer"
                            style={{
                                lineColor: navigationStarted ? '#4CAF50' : '#7257FF',
                                lineWidth: 6,
                                lineCap: 'round',
                                lineJoin: 'round',
                            }}
                        />
                    </MapboxGl.ShapeSource>
                )}

                <MapboxGl.PointAnnotation
                    id="destination"
                    coordinate={[loadStartAddress.longitude, loadStartAddress.latitude]}
                >
                    <View style={styles.destinationMarker}>
                        <MaterialIcons name="location-on" size={30} color="#F44336" />
                    </View>
                </MapboxGl.PointAnnotation>
            </MapboxGl.MapView>

            <TouchableOpacity
                style={[styles.startButton, navigationStarted && styles.stopButton]}
                onPress={navigationStarted ? stopNavigation : startNavigation}
            >
                <Text style={styles.buttonText}>
                    {navigationStarted ? 'To\'xtatish' : 'Ketdik'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.showMeButton} onPress={recenterCamera}>
                <Icon name='car' style={styles.showMeButtonIcon}></Icon>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        marginTop: 10,
        color: '#666666',
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFFFFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    backButton: {
        padding: 5,
    },
    navigationInfo: {
        flex: 1,
        alignItems: 'center',
    },
    distanceText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#291F61',
    },
    timeText: {
        fontSize: 14,
        color: '#666666',
        marginTop: 2,
    },
    map: {
        flex: 1,
    },
    destinationMarker: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    startButton: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: '#7257FF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    stopButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    navigationHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        zIndex: 10,
        color: "white"
    },
    nextManeuverText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    speedLimit: {
        position: 'absolute',
        right: 15,
        top: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    speedText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    navigationArrow: {
        width: 40,
        height: 40,
    },

    showMeButton: {
        position: 'absolute',
        bottom: 160,
        right: 20,
        borderWidth: 1,
        color: "black",
        padding: 10,
        borderRadius: 5,
    },
    showMeButtonIcon: {
        color: 'black',
        fontWeight: 'bold',
    },
});


export default GetLoadNavigator;

