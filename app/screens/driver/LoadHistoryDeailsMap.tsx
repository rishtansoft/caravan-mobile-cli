import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Platform,
    Alert,
    ActivityIndicator,
    Modal,

} from 'react-native';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import MapboxGl from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import { Position } from 'geojson';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { HistoryDetailMapProps } from './RouterType';
import axios from 'axios';
import { API_URL } from '@env';
import { GetData, RemoveData, StoreData } from '../AsyncStorage/AsyncStorage';
import SocketService from '../ui/Socket/index';
import store, { RootState } from '../../store/store';
import { Provider, useSelector } from 'react-redux';
import { useBackgroundTimer } from '../ui/BackgroundTimerService/BackgroundTimerService';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Offline route caching
const OFFLINE_ROUTE_CACHE_KEY = 'OFFLINE_ROUTE_CACHE';
MapboxGl.setAccessToken("pk.eyJ1IjoiaWJyb2hpbWpvbjI1IiwiYSI6ImNtMG8zYm83NzA0bDcybHIxOHlreXRyZnYifQ.7QYLNFuaTX9uaDfvV0054Q");

interface PositionInterface {
    longitude: number,
    latitude: number,
    address?: string,
    heading?: number | null;
}

interface CachedRoute {
    start: PositionInterface;
    end: PositionInterface;
    coordinates: Position[];
    distance: string;
    estimatedTime: string;
}
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
const showErrorAlert = (message: string) => {
    Alert.alert('Xatolik', message, [{ text: 'OK', onPress: () => console.log('OK bosildi') }]);
}
const filterOrderFun = (arr: Location[], order: number) => {
    const oneData = arr.find((el) => el.order == order);
    return oneData
}


const filterStatusData = (arr: Location[], status: string,) => {
    if (status == 'in_transit') {
        const data = filterOrderFun(arr, 1);
        if (data) {
            return {
                latitude: Number(data.latitude),
                longitude: Number(data.longitude)
            }
        }
    } else {
        const data = filterOrderFun(arr, 0);
        if (data) {
            return {
                latitude: Number(data.latitude),
                longitude: Number(data.longitude)
            }
        }
    }
}

const LoadHistoryDeailsMap: React.FC<HistoryDetailMapProps> = ({ navigation, route }) => {
    const [currentLocation, setCurrentLocation] = useState<PositionInterface | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<Position[]>([]);
    const [navigationStarted, setNavigationStarted] = useState(false);
    const [navigationStarted_2, setNavigationStarted_2] = useState(true);
    const [navigationStarted_3, setNavigationStarted_3] = useState(false);
    const [remainingDistance, setRemainingDistance] = useState<string>('');
    const [estimatedTime, setEstimatedTime] = useState<string>('');
    const [currentSpeed, setCurrentSpeed] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [locationPermissionError, setLocationPermissionError] = useState<string | null>(null);
    const [nextManeuver, setNextManeuver] = useState<string>('');
    const [loadStartAddress, setLoadStartAddress] = useState<PositionInterface | null | undefined>(filterStatusData(route.params.data, route.params.status))
    const watchId = useRef<number | null>(null);
    const mapRef = useRef<MapboxGl.MapView | null>(null);
    const cameraRef = useRef<MapboxGl.Camera | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [iCame, setICame] = useState<boolean>(false);
    const [departure, setDeparture] = useState<boolean>(false);
    const [user_id, setUser_id] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [unique_id, setUnique_id] = useState<string>('');
    const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isOffline, setIsOffline] = useState(false);
    const [cachedRoutes, setCachedRoutes] = useState<CachedRoute[]>([]);
    const appState = useRef(AppState.currentState);
    const auth = useSelector((state: RootState) => state.auth);
    const isLoggedIn = auth.isLoggedIn;
    const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
    const [locationUpdateMethod, setLocationUpdateMethod] = useState<'socket' | 'offline'>('socket');


    useEffect(() => {
        if (route.params.status == 'assigned') {
            setICame(false);
            setDeparture(false);
            setNavigationStarted(false)
        } else if (route.params.status == 'in_transit_get_load') {
            setICame(false);
            setDeparture(false);
            setNavigationStarted(false)
            // startNewLoad()
        } else if (route.params.status == 'arrived_picked_up') {
            setICame(true);
            setDeparture(false);
            setNavigationStarted_2(true)
        } else if (route.params.status == 'picked_up') {
            setICame(true);
            setDeparture(false);
            setNavigationStarted_2(false)
        } else if (route.params.status == 'in_transit') {
            setICame(false);
            setDeparture(true);
            setNavigationStarted_3(false)
        }
    }, [route.params]);

    useEffect(() => {
        GetData('user_id').then((res) => {
            if (res) {
                setUser_id(res)
            }
        }).catch((error) => {
            console.error('Xatolik yuz berdi:', error);
        });
        GetData('unique_id').then((res) => {
            if (res) {
                setUnique_id(res)
            }
        }).catch((error) => {
            console.error('Xatolik yuz berdi:', error);
        });

        GetData('token').then((res) => {
            if (res) {
                setToken(res)
            }
        }).catch((error) => {
            console.error('Xatolik yuz berdi:', error);
        });

    }, []);
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const newStatus = state.isConnected && state.isInternetReachable ? 'online' : 'offline';
            console.log('Network status:', newStatus);

            if (newStatus === 'offline') {
                // Internet o'chganda location update usulini o'zgartirish
                setLocationUpdateMethod('offline');
                stopLocationUpdates();
                setNetworkStatus('offline');
            } else {
                // Internet qayta tiklanganda location update usulini o'zgartirish
                setLocationUpdateMethod('socket');
                sendOfflineLocations();
                setNetworkStatus('online');
            }
        });

        // Dastlabki holat tekshiruvini qo'shamiz
        NetInfo.fetch().then(state => {
            const initialStatus = state.isConnected && state.isInternetReachable ? 'online' : 'offline';
            setNetworkStatus(initialStatus);
            if (initialStatus === 'offline') {
                setLocationUpdateMethod('offline');
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const checkInternetConnection = () => {
            NetInfo.fetch().then(state => {
                const newStatus = state.isConnected && state.isInternetReachable ? 'online' : 'offline';

                if (newStatus !== networkStatus) {
                    setNetworkStatus(newStatus);

                    if (newStatus === 'online') {
                        setLocationUpdateMethod('socket');
                        sendOfflineLocations();
                    } else {
                        setLocationUpdateMethod('offline');
                        stopLocationUpdates();
                    }
                }
            });
        };

        // Har 30 soniyada internet holатini tekshirish
        const intervalId = setInterval(checkInternetConnection, 30000);

        return () => clearInterval(intervalId);
    }, [networkStatus]);

    const stopLocationUpdates = () => {
        const socketService = SocketService.getInstance();
        socketService.stopLocationUpdates(); // Socketning yangi metodi
    };

    const sendOfflineLocations = async () => {
        const existingLocDataString = await GetData('loc_data') || '[]';
        console.log(173);

        if (existingLocDataString) {
            console.log(174);

            const existingLocData = JSON.parse(existingLocDataString);
            if (existingLocData && existingLocData.length > 0 && token && user_id) {
                console.log(176);

                console.log(API_URL + '/api/loads/load-location-all-save');
                console.log(token);


                try {
                    axios.post(API_URL + '/api/loads/load-location-all-save', {
                        user_id: user_id,
                        locations: existingLocData
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then((res) => {
                        console.log('Offline locations sent:', res.data);
                        RemoveData("loc_data");
                    }).catch((error) => {
                        console.log(119, error);

                    })
                } catch (error) {
                    console.error('Error sending offline locations:', error);
                }
            }
        }
    };



    // =============================================================================
    const updateOfflineLocationData = async () => {
        try {
            console.log(178);

            // Mavjud offline location ma'lumotlarini olish va parse qilish
            const existingLocDataString = await GetData('loc_data') || '[]';
            const existingLocData = JSON.parse(existingLocDataString);

            // Yangi location ma'lumotini yaratish
            const newLocationData = {
                longitude: currentLocation?.longitude,
                latitude: currentLocation?.latitude,
                driver_id: route.params.driver_id,
                order: existingLocData.length + 1 || 1, // Oxirgi orderga 1 qo'shib
                recordedAt: new Date().toISOString()
            };

            // Yangi ma'lumotni qo'shish
            const updatedLocData = [...existingLocData, newLocationData];

            // Ma'lumotni JSON string sifatida saqlash
            await StoreData('loc_data', JSON.stringify(updatedLocData));

            console.log('ofiline');
        } catch (error) {
            console.error('Offline location data update error:', error);
        }
    };

    const socketEmitFun = () => {


        if (currentLocation && navigationStarted) {
            switch (locationUpdateMethod) {
                case 'socket':
                    NetInfo.fetch().then(state => {
                        if (state.isConnected && state.isInternetReachable) {
                            const socketService = SocketService.getInstance();
                            socketService.emitLocationUpdate(currentLocation, route.params.driver_id);
                            console.log('Location sent via socket');
                        } else {
                            updateOfflineLocationData();
                            console.log('Switched to offline mode');
                        }
                    });
                    break;
                case 'offline':
                    updateOfflineLocationData();
                    console.log('Offline location update');
                    break;
            }
        }
    };

    const { startTimer, stopTimer } = useBackgroundTimer(() => {
        if (currentLocation && navigationStarted) {
            console.log(285);
            socketEmitFun()
        }
    }, 60000);


    useEffect(() => {
        if (navigationStarted) {
            startTimer();
        } else {
            stopTimer();
        }
        return () => stopTimer();
    }, [navigationStarted]);

    useEffect(() => {
        if (!isLoggedIn || auth.conut == 2) {
            stopTimer();
        }
    }, [isLoggedIn, auth.conut]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active' &&
                navigationStarted
            ) {
                // App has come to foreground
                console.log('App has come to foreground!');
                startTimer();
            } else if (
                appState.current === 'active' &&
                nextAppState.match(/inactive|background/) &&
                navigationStarted
            ) {
                // App has gone to background
                console.log('App has gone to background!');
                startTimer(); // Continue tracking in background
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
            stopTimer();
        };
    }, [navigationStarted]);
    // Clean up when component unmounts
    useEffect(() => {
        return () => {
            stopTimer();
            if (watchId.current !== null) {
                Geolocation.clearWatch(watchId.current);
            }
            if (locationIntervalRef.current) {
                clearInterval(locationIntervalRef.current);
            }
        };
    }, []);



    // ========================================================================
    const cacheRoute = async (route: CachedRoute) => {
        try {
            // Check if the route already exists in cache
            const existingRoutes = await loadCachedRoutes();
            const updatedRoutes = [...existingRoutes, route];

            // Limit cache size (e.g., last 10 routes)
            const limitedRoutes = updatedRoutes.slice(-10);

            await AsyncStorage.setItem(
                OFFLINE_ROUTE_CACHE_KEY,
                JSON.stringify(limitedRoutes)
            );

            setCachedRoutes(limitedRoutes);
        } catch (error) {
            console.error('Error caching route:', error);
        }
    };

    const loadCachedRoutes = async (): Promise<CachedRoute[]> => {
        try {
            const cachedRoutesJson = await AsyncStorage.getItem(OFFLINE_ROUTE_CACHE_KEY);
            return cachedRoutesJson ? JSON.parse(cachedRoutesJson) : [];
        } catch (error) {
            console.error('Error loading cached routes:', error);
            return [];
        }
    };

    const findOfflineRoute = (start: PositionInterface, end: PositionInterface) => {
        // Find a cached route that closely matches the current start and end points
        const matchedRoute = cachedRoutes.find(route =>
            isCloseLocation(route.start, start) &&
            isCloseLocation(route.end, end)
        );

        return matchedRoute;
    };

    const isCloseLocation = (loc1: PositionInterface, loc2: PositionInterface, tolerance = 0.01) => {
        return Math.abs(loc1.latitude - loc2.latitude) < tolerance &&
            Math.abs(loc1.longitude - loc2.longitude) < tolerance;
    };




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
    const calculateRoute = async (start: PositionInterface) => {
        try {
            // Check network connectivity
            const netInfo = await NetInfo.fetch();
            const isConnected = netInfo.isConnected;

            // Validate start and end locations
            if (!start || !start.longitude || !start.latitude) {
                console.log("Start manzili yetarli emas:", start);
                return;
            }

            if (!loadStartAddress || !loadStartAddress.longitude || !loadStartAddress.latitude) {
                console.log("Yuk manzili yetarli emas:", loadStartAddress);
                return;
            }

            // Try online routing first
            if (isConnected) {
                const response = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${loadStartAddress.longitude},${loadStartAddress.latitude}?geometries=geojson&overview=full&steps=true&access_token=pk.eyJ1IjoiaWJyb2hpbWpvbjI1IiwiYSI6ImNtMG8zYm83NzA0bDcybHIxOHlreXRyZnYifQ.7QYLNFuaTX9uaDfvV0054Q`
                );
                const data = await response.json();

                if (data.routes && data.routes[0]) {
                    const routeData = {
                        coordinates: data.routes[0].geometry.coordinates,
                        distance: `${(data.routes[0].distance / 1000).toFixed(1)} km`,
                        estimatedTime: calculateEstimatedTime(data.routes[0].duration),
                        start,
                        end: loadStartAddress
                    };

                    // Cache the route
                    await cacheRoute(routeData);

                    setRouteCoordinates(routeData.coordinates);
                    setRemainingDistance(routeData.distance);
                    setEstimatedTime(routeData.estimatedTime);

                    // Extract next maneuver
                    if (data.routes[0].steps && data.routes[0].steps[0]) {
                        setNextManeuver(data.routes[0].steps[0].maneuver.instruction);
                    }

                    return;
                }
            }

            // Fallback to offline route if available
            const offlineRoute = findOfflineRoute(start, loadStartAddress);
            if (offlineRoute) {
                setIsOffline(true);
                setRouteCoordinates(offlineRoute.coordinates);
                setRemainingDistance(offlineRoute.distance);
                setEstimatedTime(offlineRoute.estimatedTime);

                return;
            }

            // No route available
            Alert.alert('Xato', 'Yo\'nalishni hisoblashda muammo. Internet aloqasi yo\'q va kerakli yo\'nalish topilmadi.');

        } catch (error) {
            console.log('Route calculation error:', error);

            // Attempt offline route
            const offlineRoute = findOfflineRoute(start, loadStartAddress);
            if (offlineRoute) {
                setIsOffline(true);
                setRouteCoordinates(offlineRoute.coordinates);
                setRemainingDistance(offlineRoute.distance);
                setEstimatedTime(offlineRoute.estimatedTime);

                // Alert.alert('Offline Rejim', 'Internetga ulanish yo\'q. Offline yo\'nalish ishlatilmoqda.');
                return;
            }

            Alert.alert('Xato', 'Yo\'nalishni hisoblashda xatolik yuz berdi');
        }
    };

    const calculateEstimatedTime = (durationSeconds: number) => {
        const durationMinutes = Math.round(durationSeconds / 60);
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;

        return hours > 0
            ? `${hours} soat ${minutes} daqiqa`
            : `${minutes} daqiqa`;
    };

    // Offline map tile caching
    const downloadOfflineRegion = async () => {
        try {
            if (currentLocation && loadStartAddress) {
                // Define the bounding box between current location and destination
                const bounds = [
                    [
                        Math.min(currentLocation.longitude, loadStartAddress.longitude),
                        Math.min(currentLocation.latitude, loadStartAddress.latitude)
                    ],
                    [
                        Math.max(currentLocation.longitude, loadStartAddress.longitude),
                        Math.max(currentLocation.latitude, loadStartAddress.latitude)
                    ]
                ];

                // Download offline region
                const regionName = `route_${Date.now()}`;
                await MapboxGl.offlineManager.createPack({
                    name: regionName,
                    styleURL: MapboxGl.StyleURL.Light,
                    bounds: bounds,
                    minZoom: 10,
                    maxZoom: 20,
                    metadata: { route: true }
                });

            }
        } catch (error) {
            console.error('Offline region download error:', error);
        }
    };

    useEffect(() => {
        const handleConnectivityChange = (state) => {
            setIsOffline(!state.isConnected);
        };

        const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

        // Initial check
        NetInfo.fetch().then(state => {
            setIsOffline(!state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Load cached routes on component mount
    useEffect(() => {
        const loadCachedRoutesOnMount = async () => {
            const routes = await loadCachedRoutes();
            setCachedRoutes(routes);
        };

        loadCachedRoutesOnMount();
    }, []);

    // ----------------------------Socket-------------------------------------------
    const startNavigation = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            Alert.alert('Xato', 'Navigatsiya uchun joylashuv ruxsati kerak');
            return;
        }

        setNavigationStarted(true);
        startTimer()

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
                    longitude: position.coords.longitude,
                    heading: position.coords.heading,
                };
                setCurrentLocation(newLocation);
                setCurrentSpeed(position.coords.speed || 0);
                calculateRoute(newLocation);

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
        await downloadOfflineRegion();
    };
    const startNavigationDeparture = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            Alert.alert('Xato', 'Navigatsiya uchun joylashuv ruxsati kerak');
            return;
        }
        setNavigationStarted(true);
        startTimer()


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
                    longitude: position.coords.longitude,
                    heading: position.coords.heading,
                };
                setCurrentLocation(newLocation);
                setCurrentSpeed(position.coords.speed || 0);
                calculateRoute(newLocation);

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
        await downloadOfflineRegion();
    };
    const stopNavigation = () => {
        if (watchId.current !== null) {
            Geolocation.clearWatch(watchId.current);
        }
        if (locationIntervalRef.current) {
            clearInterval(locationIntervalRef.current);
        }
        setNavigationStarted(false);
        stopTimer()
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
    };
    function startNewLoad() {
        if (token && user_id) {
            startNavigation();
            axios.post(`${API_URL}/api/driver/arring-to-get-load`, {
                user_id: user_id,
                load_id: route.params.data[0].load_id,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then((res) => {
                console.log(460, res.data);

            }).catch((error) => {
                console.log(463, error);

            })
        }
    };
    const iCameFun = () => {
        if (token && user_id) {
            const resData = {
                user_id: user_id,
                load_id: route.params.data[0].load_id,
                current_longitude: currentLocation?.longitude,
                current_latitude: currentLocation?.latitude,
                start_longitude: Number(filterOrderFun(route.params.data, 0)?.longitude),
                start_latitude: Number(filterOrderFun(route.params.data, 0)?.latitude)
            }

            axios.post(`${API_URL}/api/driver/arrived-luggage`, resData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
            ).then((res) => {
                if (res.data.success) {
                    setNavigationStarted(false)
                    setIsVisible(false)
                    setICame(true);
                    stopNavigation()
                } else {
                    setIsVisible(false);
                    showErrorAlert(res.data?.message)
                }
            }).catch((error) => {
                console.log(266, error);

            })
        }
    };
    const iCameUploadFun = () => {
        if (token && user_id) {
            const resData = {
                user_id: user_id,
                load_id: route.params.data[0].load_id,
            }

            axios.post(`${API_URL}/api/driver/start-loading`, resData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
            ).then((res) => {
                if (res.data.success) {
                    setNavigationStarted_2(false)
                } else {
                    showErrorAlert(res.data?.message)
                }
            }).catch((error) => {
                console.log(328, error);

            })
        }
    };
    const loadUploadFun = () => {
        setICame(false);
        setDeparture(true);
        axios.post(`${API_URL}/api/driver/finish-pickup-load`, {
            user_id: user_id,
            load_id: route.params.data[0].load_id,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }).then((res) => {
            setDeparture(true);
            setICame(false);

        }).catch((error) => {
            console.log(546, error);

        })
    };
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
    function newAddressFun() {
        setIsVisible(false)
        setNavigationStarted(true);
        setNavigationStarted_3(true);
        startNavigationDeparture()
    }
    const stopLoadFinish = () => {
        if (token && user_id) {
            const resData = {
                user_id: user_id,
                load_id: route.params.data[0].load_id,
                current_longitude: currentLocation?.longitude,
                current_latitude: currentLocation?.latitude,
                start_longitude: Number(filterOrderFun(route.params.data, 1)?.longitude),
                start_latitude: Number(filterOrderFun(route.params.data, 1)?.latitude)
            }


            axios.post(`${API_URL}/api/driver/finish-trip`, resData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
            ).then((res) => {
                if (res.data.success) {
                    if (watchId.current !== null) {
                        Geolocation.clearWatch(watchId.current);
                    }
                    if (locationIntervalRef.current) {
                        clearInterval(locationIntervalRef.current);
                    }
                    stopTimer()

                    Alert.alert('Tabriklaymiz', 'Siz mazilga yetib keldiz');
                    navigation.navigate('active_loads')

                } else {
                    setIsVisible(false);
                    showErrorAlert(res.data?.message)
                }
            }).catch((error) => {
                console.log(266, error);

            })
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
                            {
                                transform: [{
                                    // Use heading or fallback to 0
                                    rotate: `${currentLocation?.heading || 0}deg`
                                }]
                            }
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

                {
                    loadStartAddress && <MapboxGl.PointAnnotation
                        id="destination"
                        coordinate={[loadStartAddress.longitude, loadStartAddress.latitude]}
                    >
                        <View style={styles.destinationMarker}>
                            <MaterialIcons name="location-on" size={30} color="#F44336" />
                        </View>
                    </MapboxGl.PointAnnotation>
                }


            </MapboxGl.MapView>

            {
                !iCame && !departure && <TouchableOpacity
                    style={[styles.startButton, navigationStarted && styles.stopButton]}
                    onPress={navigationStarted ? () => setIsVisible(true) : startNewLoad}
                >
                    <Text style={styles.buttonText}>
                        {navigationStarted ? 'To\'xtatish' : 'Ketdik'}
                    </Text>
                </TouchableOpacity>
            }

            {
                iCame && !departure && <TouchableOpacity
                    style={[styles.startButton, navigationStarted_2 && styles.stopButton]}
                    onPress={navigationStarted_2 ? iCameUploadFun : loadUploadFun}
                >
                    <Text style={styles.buttonText}>
                        {navigationStarted_2 ? 'Yukni olishga keladim' : 'Yukni yuklashni yakunlash'}
                    </Text>
                </TouchableOpacity>
            }

            {
                !iCame && departure && <TouchableOpacity
                    style={[styles.startButton, navigationStarted_3 && styles.stopButton]}
                    onPress={navigationStarted_3 ? stopLoadFinish : newAddressFun}
                >
                    <Text style={styles.buttonText}>
                        {navigationStarted_3 ? "Yetib keldim" : 'Ketdik'}
                    </Text>
                </TouchableOpacity>
            }



            <TouchableOpacity style={styles.showMeButton} onPress={recenterCamera}>
                <Icon name='car' style={styles.showMeButtonIcon}></Icon>
            </TouchableOpacity>

            <Modal
                transparent
                visible={isVisible}
                animationType="slide"
                onRequestClose={() => setIsVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Yetib kelgannizga aminmisiz?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#cd1a17', }]} onPress={iCameFun}>
                                <Text style={styles.buttonText}>Ha</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#7257FF', }]} onPress={() => setIsVisible(false)}>
                                <Text style={styles.buttonText}>Yo'q</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 22,
        marginBottom: 20,
        fontWeight: '600',
        textAlign: 'center',
        color: '#291F61',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
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


export default LoadHistoryDeailsMap;

