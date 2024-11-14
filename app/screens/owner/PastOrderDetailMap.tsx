import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, Text, Platform, Alert } from 'react-native';
import MapboxGl from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import { Position, Feature, Geometry } from 'geojson';
import { MAPBOX_ACCESS_TOKEN } from '@env';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { HistoryDetailMapProps } from './RouterType';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Octicons'; //arrow-switch

MapboxGl.setAccessToken("pk.eyJ1IjoiaWJyb2hpbWpvbjI1IiwiYSI6ImNtMG8zYm83NzA0bDcybHIxOHlreXRyZnYifQ.7QYLNFuaTX9uaDfvV0054Q");

interface Location {
    id: string;
    status: string;
    load_id: string;
    latitude: string;
    longitude: string;
    order: number;
    start_time: string | null;
    end_time: string | null;
    location_name: string;
    createdAt: string;
    updatedAt: string;
    AssignmentId: string | null;
}
const splitText = (text: string,): { text_1: string } => {
    const text_1 = text.slice(0, 8);
    return { text_1 };
};
const getBgColorKey = (key: string): string => {
    switch (key) {
        case 'posted':
            return '#F0EDFF';
        case 'assigned':
            return '#E5F0FF';
        case 'picked_up':
            return '#FFEFB3';
        case "in_transit":
            return '#FFE9D1';
        case 'delivered':
            return '#D7F5E5';
        case 'Tushirilmoqda':
            return '#FFEFB3';
        case 'Yakunlangan':
            return '#D7F5E5';
        default:
            return '#F0EDFF'; // Default rang
    }
};
const getStatusText = (key: string): string => {
    switch (key) {
        case 'posted':
            return 'Qidirilmoqda';
        case 'assigned':
            return 'Yukni olishga kelmoqda';
        case 'picked_up':
            return 'Yuk ortilmoqda';
        case "in_transit":
            return "Yo'lda";
        case 'delivered':
            return 'Manzilga yetib bordi';
        case 'Tushirilmoqda':
            return '#FFEFB3';
        case 'Yakunlangan':
            return '#D7F5E5';
        default:
            return '#F0EDFF'; // Default rang
    }
};
const getTextColorKey = (key: string): string => {
    switch (key) {
        case 'posted':
            return '#5336E2';
        case 'assigned':
            return '#0050C7';
        case 'picked_up':
            return '#B26205';
        case "in_transit":
            return '#E28F36';
        case 'delivered':
            return '#006341';
        case 'Tushirilmoqda':
            return '#B26205';
        case 'Yakunlangan':
            return '#006341';
        default:
            return '#5336E2'; // Default rang
    }
};
interface LocationData {
    id: string;
    status: string;
    load_id: string;
    latitude: string;
    longitude: string;
    order: number;
    start_time: string | null;
    end_time: string | null;
    location_name: string;
    createdAt: string;
    updatedAt: string;
    AssignmentId: string | null;
}
const filertDriverStopOrder = (arr: LocationData[], order: number) => {
    const orderFilter = arr.find((el) => el.order == order)?.location_name.split(',')
    if (orderFilter && orderFilter.length > 0) {
        const addresa = orderFilter[0]
        return addresa
    } else {
        return orderFilter?.join(' ')
    }
}

const ActiveOrderMap: React.FC<HistoryDetailMapProps> = ({ route, navigation }) => {
    const { itemId, data, status } = route.params;

    const [currentLocation, setCurrentLocation] = useState<Position | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<Position[]>([]);
    const [locationPermissionError, setLocationPermissionError] = useState<string | null>(null);
    const [estimatedTime, setEstimatedTime] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    const [locations, setLocations] = useState<Location[]>([
        {
            id: data[0].id,
            status: data[0].status,
            load_id: data[0].load_id,
            latitude: data[0].latitude,
            longitude: data[0].longitude,
            order: data[0].order,
            start_time: data[0].start_time,
            end_time: data[0].end_time,
            location_name: data[0].location_name,
            createdAt: data[0].createdAt,
            updatedAt: data[0].updatedAt,
            AssignmentId: data[0].AssignmentId
        },
        {
            id: data[1].id,
            status: data[1].status,
            load_id: data[1].load_id,
            latitude: data[1].latitude,
            longitude: data[1].longitude,
            order: data[1].order,
            start_time: data[1].start_time,
            end_time: data[1].end_time,
            location_name: data[1].location_name,
            createdAt: data[1].createdAt,
            updatedAt: data[1].updatedAt,
            AssignmentId: data[1].AssignmentId
        }
    ]);

    const requestLocationPermission = async () => {
        try {
            const granted = await check(
                Platform.OS === 'ios'
                    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
            );

            if (granted === RESULTS.GRANTED) {
                return true;
            } else if (granted === RESULTS.DENIED) {
                const requestResult = await request(
                    Platform.OS === 'ios'
                        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                );

                if (requestResult === RESULTS.GRANTED) {
                    return true;
                } else {
                    setLocationPermissionError('Joylashuv ruxsati berilmadi');
                    return false;
                }
            } else {
                setLocationPermissionError('Joylashuv ruxsati berilmadi');
                return false;
            }
        } catch (error) {
            console.error('Joylashuv ruxsatlarini tekshirishda xatolik:', error);
            setLocationPermissionError('Joylashuv ruxsatlarini tekshirishda xatolik');
            return false;
        }
    };

    const getCurrentLocation = async () => {
        try {
            const hasPermission = await requestLocationPermission();

            if (!hasPermission) {
                setIsLoading(false);
                return;
            }

            Geolocation.getCurrentPosition(
                position => {
                    setCurrentLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    setIsLoading(false);
                    calculateFullRoute(locations);
                },
                error => {
                    console.error('Joylashuvni olishda xatolik:', error);
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
            console.error('getCurrentLocation da xatolik:', error);
            setLocationPermissionError('Joriy joylashuvni olib bo\'lmadi');
            setIsLoading(false);
        }
    };

    const calculateFullRoute = async (currentLocations: Location[]) => {
        try {
            // Uchta nuqta koordinatalari uchun qatorni tuzish
            const coordinatesString = `${currentLocations[0].longitude},${currentLocations[0].latitude};${currentLocations[1].longitude},${currentLocations[1].latitude}`;

            const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

            const response = await fetch(routeUrl);
            const data = await response.json();

            if (data.routes && data.routes[0]) {
                setRouteCoordinates(data.routes[0].geometry.coordinates);
            } else {
                console.error('No route found:', data);
                Alert.alert('Xato', 'Yo\'nalish topilmadi');
            }
        } catch (error) {
            console.error('Yo\'nalishni hisoblashda xatolik:', error);
            Alert.alert('Xato', 'Yo\'nalishni hisoblashda xatolik yuz berdi');
        }
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const createRouteFeature = (coordinates: Position[]): Feature<Geometry> => ({
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: coordinates,
        },
    });

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: '#000' }}>Joylashuv aniqlanmoqda...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container_all}>
            {locationPermissionError ? (
                <TouchableOpacity
                    style={styles.errorContainer}
                    onPress={getCurrentLocation}
                >
                    <Text style={styles.errorText}>
                        {locationPermissionError}. Qayta urinish uchun bosing.
                    </Text>
                </TouchableOpacity>
            ) : null}

            <View style={styles.header_con}>
                <View style={{
                    width: '6%'
                }}>
                    <Icon
                        onPress={() => navigation.navigate('active_loads_detail', { itemId: itemId })}
                        name="angle-left" size={30} color="#7257FF" />
                </View>
                <Text style={styles.title}>
                    Buyurtma #{itemId.slice(0, 8)}
                </Text>
            </View>

            <MapboxGl.MapView style={styles.map}>
                <MapboxGl.Camera
                    zoomLevel={12}
                    centerCoordinate={[parseFloat(locations[0].longitude), parseFloat(locations[0].latitude)]}
                    animationDuration={0}
                />

                {locations.map((location, index) => (
                    <MapboxGl.PointAnnotation
                        key={index + ''}
                        id={`point-${index}`}
                        coordinate={[parseFloat(location.longitude), parseFloat(location.latitude)]}
                    >
                        <View style={[
                            styles.markerContainer,
                            { backgroundColor: index === 0 ? '#4CAF50' : '#F44336' }
                        ]}>
                            <Text style={styles.markerText}>{index + 1}</Text>
                        </View>
                        <MapboxGl.Callout title={index === 0 ? "Boshlang'ich nuqta" : "Tugash nuqta"}>
                            <View style={styles.callout}>
                                <Text style={styles.calloutText}>{location.location_name}</Text>
                            </View>
                        </MapboxGl.Callout>
                    </MapboxGl.PointAnnotation>
                ))}

                {routeCoordinates.length > 0 && (
                    <MapboxGl.ShapeSource
                        id="routeSource"
                        shape={createRouteFeature(routeCoordinates)}
                    >
                        <MapboxGl.LineLayer
                            id="routeLayer"
                            style={styles.routeLine}
                        />
                    </MapboxGl.ShapeSource>
                )}
            </MapboxGl.MapView>
            <View style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: '#fff',

            }}>
                <View style={styles.container}>
                    {
                        data && data.length > 0 && <View style={styles.link_location_texts}>
                            <Text style={styles.link_location_text}>{filertDriverStopOrder(data, 0)}</Text>
                            <Fontisto name="arrow-switch" size={18} color="#B4A6FF" />
                            <Text style={styles.link_location_text}>{filertDriverStopOrder(data, 1)}</Text>
                        </View>
                    }


                    <View style={styles.link_bottom}>
                        <Text style={[
                            styles.link_bottom_text,
                            {
                                backgroundColor: getBgColorKey(status ?? ''),
                                color: getTextColorKey(status ?? '')
                            }
                        ]}>{getStatusText(status ?? '')}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container_all: {
        flex: 1,
        backgroundColor: '#e6e8ea',
        overflow: 'scroll'
    },
    container: {
        width: '100%',
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 30,
        flex: 1,
    },
    link_location_texts: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        gap: 10
    },
    link_location_text: {
        color: '#291F61',
        fontWeight: '700',
        fontSize: 24,

    },

    link_bottom: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center'
        gap: 15

    },

    link_bottom_text: {
        paddingVertical: 4,
        paddingHorizontal: 5,
        fontSize: 15,
        borderRadius: 5,

    },

    header_con: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        width: "100%",
        paddingLeft: 15
    },
    title: {
        color: '#131214',
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 100,
        width: '90%',
        fontWeight: '600',
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    markerText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    routeLine: {
        lineWidth: 4,
        lineColor: '#2196F3',
    },
    timeContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        zIndex: 1,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    timeText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
    },
    callout: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        minWidth: 120,
    },
    calloutText: {
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ffcdd2',
    },
    errorText: {
        color: '#c62828',
        textAlign: 'center',
    },
});

export default ActiveOrderMap;