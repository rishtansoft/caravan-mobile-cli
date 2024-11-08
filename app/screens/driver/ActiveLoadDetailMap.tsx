import React, { useState, useEffect } from 'react';
import { View, StyleSheet,  TouchableOpacity, Text, Platform, Alert } from 'react-native';
import MapboxGl from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import { Position, Feature, Geometry } from 'geojson';
import { MAPBOX_ACCESS_TOKEN } from '@env';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { ActiveLoadsDetailMapProps } from './RouterType';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Octicons'; //arrow-switch

MapboxGl.setAccessToken("pk.eyJ1IjoiaWJyb2hpbWpvbjI1IiwiYSI6ImNtMG8zYm83NzA0bDcybHIxOHlreXRyZnYifQ.7QYLNFuaTX9uaDfvV0054Q");

interface Location {
    coordinates: Position;
    title: string;
    description: string;
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



const ActiveLoadDetailMap: React.FC<ActiveLoadsDetailMapProps> = ({ route, navigation }) => {
    const { itemId, data } = route.params;

    const [currentLocation, setCurrentLocation] = useState<Position | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<Position[]>([]);
    const [locationPermissionError, setLocationPermissionError] = useState<string | null>(null);
    const [estimatedTime, setEstimatedTime] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    // Predefined locations with correct [longitude, latitude] format
    const [locations, setLocations] = useState<Location[]>([
        {
            coordinates: [71.21403317505282, 40.41584992170101], // Boshlang'ich nuqta
            title: "Boshlang'ich nuqta",
            description: "Andijondagi boshlang'ich nuqta"
        },
        {
            coordinates: [71.21403317505282, 40.41584992170101], // Will be updated with real location
            title: "Hozirgi joylashuv",
            description: "Sizning joylashuvingiz"
        },
        {
            coordinates: [71.21447672853047, 40.40623817747], // Borish kerak bo'lgan joy
            title: "Borish kerak bo'lgan joy",
            description: "Manzil"
        }
    ]);

    // 40.40623817747, 

    const requestLocationPermission = async () => {
        try {
            const permission = Platform.select({
                android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            });

            if (!permission) {
                setLocationPermissionError('Platform qo\'llab-quvvatlanmaydi');
                return false;
            }

            const permissionStatus = await check(permission);

            if (permissionStatus === RESULTS.GRANTED) {
                return true;
            }

            const result = await request(permission);

            if (result === RESULTS.GRANTED) {
                return true;
            } else {
                setLocationPermissionError('Joylashuv ruxsati rad etildi');
                return false;
            }
        } catch (error) {
            console.error('Joylashuv ruxsatini so\'rashda xatolik:', error);
            setLocationPermissionError('Joylashuv ruxsatini so\'rashda xatolik');
            return false;
        }
    };

    const getCurrentLocation = async () => {
        try {
            const hasPermission = await requestLocationPermission();

            if (!hasPermission) {
                return;
            }

            Geolocation.getCurrentPosition(
                position => {
                    const { longitude, latitude } = position.coords;
                    // Update current location
                    const updatedLocations = [...locations];
                    updatedLocations[1] = {
                        ...updatedLocations[1],
                        coordinates: [longitude, latitude]
                    };
                    setLocations(updatedLocations);
                    setCurrentLocation([longitude, latitude]);
                    setIsLoading(false);

                    // Calculate route with all three points
                    calculateFullRoute(updatedLocations);
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
            // Build coordinates string for all three points
            const coordinatesString = `${currentLocations[0].coordinates[0]},${currentLocations[0].coordinates[1]};${currentLocations[1].coordinates[0]},${currentLocations[1].coordinates[1]};${currentLocations[2].coordinates[0]},${currentLocations[2].coordinates[1]}`;

            const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

            const response = await fetch(routeUrl);
            const data = await response.json();

            if (data.routes && data.routes[0]) {
                setRouteCoordinates(data.routes[0].geometry.coordinates);
                const timeInMinutes = Math.round(data.routes[0].duration / 60);
                setEstimatedTime(`Taxminiy yetib borish vaqti: ${timeInMinutes} daqiqa`);
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

        const locationInterval = setInterval(() => {
            getCurrentLocation();
        }, 30000);

        return () => {
            clearInterval(locationInterval);
        };
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
                <Text>Joylashuv aniqlanmoqda...</Text>
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
                        onPress={() => navigation.navigate('ActiveLoadDetail', { itemId: itemId })}
                        name="angle-left" size={30} color="#7257FF" />
                </View>
                <Text style={styles.title}>
                    Buyurtma #{splitText(itemId).text_1}
                </Text>
            </View>

            {/* {estimatedTime && (
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{estimatedTime}</Text>
                </View>
            )} */}

            <MapboxGl.MapView style={styles.map}>
                <MapboxGl.Camera
                    zoomLevel={12}
                    centerCoordinate={locations[1].coordinates}
                    animationDuration={0}
                />

                {locations.map((location, index) => (
                    <MapboxGl.PointAnnotation
                        key={index + ''}
                        id={`point-${index}`}
                        coordinate={location.coordinates}
                    >
                        <View style={[
                            styles.markerContainer,
                            { backgroundColor: index === 0 ? '#4CAF50' : index === 1 ? '#2196F3' : '#F44336' }
                        ]}>
                            <Text style={styles.markerText}>{index + 1}</Text>
                        </View>
                        <MapboxGl.Callout title={location.title}>
                            <View style={styles.callout}>
                                <Text style={styles.calloutText}>{location.description}</Text>
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
                    <View style={styles.link_location_texts}>
                        <Text style={styles.link_location_text}>Andijon</Text>
                        <Fontisto name="arrow-switch" size={18} color="#B4A6FF" />
                        <Text style={styles.link_location_text}>Toshkent</Text>
                    </View>
                    <View style={styles.link_bottom}>
                        <Text style={[styles.link_bottom_text, { backgroundColor: getBgColorKey("Yo'lda"), color: getTextColorKey("Yo'lda") }]}>Yo'lda</Text>
                        {/* <Text style={{ color: '#6E7375', fontSize: 14 }}>
                            10 daqiqada yetib boradi</Text> */}
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

export default ActiveLoadDetailMap;



// import React, { useEffect, useState } from 'react';
// import MapboxGL from '@react-native-mapbox-gl/maps';
// import { View, Text, StyleSheet } from 'react-native';

// MapboxGL.setAccessToken('YOUR_MAPBOX_ACCESS_TOKEN');

// const NavigationPage = ({ startCoords, endCoords }) => {
//   const [currentCoords, setCurrentCoords] = useState(startCoords);
//   const [route, setRoute] = useState(null);

//   useEffect(() => {
//     const watchLocation = async () => {
//       const watchId = await MapboxGL.locationManager.start();

//       MapboxGL.locationManager.on('location', (location) => {
//         const newCoords = [location.coords.longitude, location.coords.latitude];
//         setCurrentCoords(newCoords);
        
//         if (getDistance(newCoords, route) > 50) {
//           setTimeout(() => {
//             drawRoute(newCoords, endCoords);
//           }, 20000);
//         }
//       });

//       return () => {
//         MapboxGL.locationManager.stop(watchId);
//       };
//     };
    
//     watchLocation();
//   }, []);

//   const drawRoute = async (start, end) => {
//     try {
//       const response = await fetch(
//         `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=YOUR_MAPBOX_ACCESS_TOKEN`
//       );
//       const data = await response.json();
//       setRoute(data.routes[0].geometry);
//     } catch (error) {
//       console.error('Marshrut tuzishda xatolik:', error);
//     }
//   };

//   const getDistance = (coords1, coords2) => {
//     const [lon1, lat1] = coords1;
//     const [lon2, lat2] = coords2;
//     return Math.sqrt(Math.pow(lon2 - lon1, 2) + Math.pow(lat2 - lat1, 2)) * 100000;
//   };

//   useEffect(() => {
//     drawRoute(startCoords, endCoords);
//   }, [startCoords, endCoords]);

//   return (
//     <View style={styles.container}>
//       <MapboxGL.MapView style={styles.map}>
//         <MapboxGL.Camera
//           centerCoordinate={currentCoords}
//           zoomLevel={14}
//           followUserLocation={true}
//         />
//         <MapboxGL.UserLocation visible={false} />  {/* Asl user ikonchasini yashirish */}
        
//         {/* Haydovchi joylashuvi uchun uchburchak shaklidagi marker */}
//         <MapboxGL.ShapeSource id="driverLocation" shape={{
//           type: 'Feature',
//           geometry: {
//             type: 'Point',
//             coordinates: currentCoords,
//           },
//         }}>
//           <MapboxGL.SymbolLayer
//             id="driverIcon"
//             style={{
//               iconImage: require('./assets/triangle-icon.png'),  // Uchburchak ikonka
//               iconSize: 0.5,  // Kichikroq o'lcham uchun
//               iconRotateAlignment: 'map',
//               iconAllowOverlap: true,
//               iconRotationAlignment: 'viewport',
//             }}
//           />
//         </MapboxGL.ShapeSource>

//         {/* Marshrut uchun */}
//         {route && (
//           <MapboxGL.ShapeSource id="routeSource" shape={{ type: 'Feature', geometry: route }}>
//             <MapboxGL.LineLayer id="routeLine" style={styles.routeLine} />
//           </MapboxGL.ShapeSource>
//         )}
//       </MapboxGL.MapView>
//       <View style={styles.info}>
//         <Text>Marshrut bo'yicha yo'l ko'rsatilmoqda...</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: { flex: 1 },
//   routeLine: {
//     lineColor: '#007AFF',
//     lineWidth: 3,
//     lineCap: 'round',
//   },
//   info: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     padding: 10,
//     backgroundColor: 'white',
//     borderRadius: 5,
//     textAlign: 'center',
//   },
// });

// export default NavigationPage;
