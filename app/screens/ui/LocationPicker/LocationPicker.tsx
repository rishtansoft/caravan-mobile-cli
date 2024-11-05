import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Geolocation from 'react-native-geolocation-service';
import { MAPBOX_ACCESS_TOKEN, MAPBOXGL_TOKEN } from '@env';

interface Location {
    name: string;
    latitude: number;
    longitude: number;
}

interface LocationPickerProps {
    onLocationSelect: (location: Location) => void;
    sub_text: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, sub_text }) => {
    const [showSearch, setShowSearch] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [searchResults, setSearchResults] = useState<Location[]>([]);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    const cameraRef = useRef<any>(null);

    MapboxGL.setAccessToken(MAPBOXGL_TOKEN);

    // Android uchun ruxsat olish
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Joylashuv ruxsati",
                        message: "Ilovaga joylashuvingizni aniqlash uchun ruxsat bering",
                        buttonNeutral: "Keyinroq so'rash",
                        buttonNegative: "Bekor qilish",
                        buttonPositive: "OK"
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    // Joriy joylashuvni olish va tanlash
    const getCurrentLocation = useCallback(async () => {
        const hasPermission = await requestLocationPermission();

        if (hasPermission) {
            Geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        const response = await fetch(
                            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
                        );
                        const data = await response.json();

                        if (data.features && data.features.length > 0) {
                            const locationData = {
                                name: data.features[0].place_name,
                                latitude,
                                longitude,
                            };
                            setSelectedLocation(locationData);
                            onLocationSelect(locationData);
                            if (showMap) {
                                flyToLocation(latitude, longitude);
                            }
                        }
                    } catch (error) {
                        console.error('Manzil ma\'lumotlarini olishda xatolik:', error);
                    }
                },
                (error) => {
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
    }, [showMap]);

    // Telefon joylashuvini olish (tanlash uchun emas)
    const getUserLocation = useCallback(async () => {
        const hasPermission = await requestLocationPermission();

        if (hasPermission) {
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                    if (showMap && !selectedLocation) {
                        flyToLocation(latitude, longitude);
                    }
                },
                (error) => {
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
    }, [showMap, selectedLocation]);

    // Haritani ochganda telefon joylashuvini olish
    React.useEffect(() => {
        if (showMap && !selectedLocation) {
            getUserLocation();
        }
    }, [showMap]);

    const flyToLocation = useCallback((latitude: number, longitude: number) => {
        if (cameraRef.current) {
            cameraRef.current.setCamera({
                centerCoordinate: [longitude, latitude],
                zoomLevel: 16.5,
                animationDuration: 1000,
            });
        }
    }, []);

    // Haritadan joy tanlash
    const handleMapPress = async (event: any) => {
        const coordinates = event.geometry.coordinates;
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
            );
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const location = {
                    name: data.features[0].place_name,
                    latitude: coordinates[1],
                    longitude: coordinates[0],
                };
                setSelectedLocation(location);
                flyToLocation(location.latitude, location.longitude);
            }
        } catch (error) {
            console.error('Manzil ma\'lumotlarini olishda xatolik:', error);
        }
    };

    // Qidiruv
    const searchLocations = async (query: string) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
            );
            const data = await response.json();

            const locations = data.features.map((feature: any) => ({
                name: feature.place_name,
                latitude: feature.center[1],
                longitude: feature.center[0],
            }));

            setSearchResults(locations);
        } catch (error) {
            console.error('Qidiruv xatosi:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.mainButton}
                onPress={() => setShowSearch(true)}
            >
                <View style={styles.buttonContent}>
                    <View style={styles.btn_left}>
                        <Feather name="menu" size={24} color="#898D8F" />
                        <View>
                            <Text style={styles.buttonText}>
                                {selectedLocation
                                    ? selectedLocation.name
                                    : "Manzil tanlash"}
                            </Text>
                            <Text style={styles.button_sub_text}>{sub_text}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.locationIcon}
                        onPress={getCurrentLocation}
                    >
                        <Feather name="map-pin" size={24} color="#898D8F" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

            {/* Qidiruv modali */}
            <Modal visible={showSearch} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.searchHeader}>
                        <TouchableOpacity onPress={() => setShowSearch(false)}>
                            <MaterialIcons name="arrow-back" size={24} color="#898D8F" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Manzilni qidiring"
                            placeholderTextColor="#898D8F"
                            value={searchQuery}
                            onChangeText={(text) => {
                                setSearchQuery(text);
                                if (text.length > 2) {
                                    searchLocations(text);
                                }
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.mapSearchButton}
                        onPress={() => setShowMap(true)}
                    >
                        <MaterialIcons name="map" size={24} color="#fff" />
                        <Text style={styles.mapSearchText}>Haritadan qidirish</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={searchResults}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.searchItem}
                                onPress={() => {
                                    setSelectedLocation(item);
                                    onLocationSelect(item);
                                    setShowSearch(false);
                                }}
                            >
                                <MaterialIcons name="location-on" size={24} color="#666" />
                                <Text style={styles.searchItemText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>

            {/* Harita modali */}
            <Modal visible={showMap} animationType="slide">
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            if (selectedLocation) {
                                onLocationSelect(selectedLocation);
                            }
                            setShowMap(false);
                        }}
                    >
                        <MaterialIcons name="close" size={24} color="#666" />
                    </TouchableOpacity>

                    <MapboxGL.MapView
                        style={styles.map}
                        onPress={handleMapPress}
                    >
                        <MapboxGL.Camera
                            ref={cameraRef}
                            zoomLevel={16.5}
                            animationMode="flyTo"
                            animationDuration={1000}
                            centerCoordinate={
                                selectedLocation
                                    ? [selectedLocation.longitude, selectedLocation.latitude]
                                    : userLocation
                                        ? [userLocation.longitude, userLocation.latitude]
                                        : [69.2401, 41.2995]
                            }
                        />
                        <MapboxGL.UserLocation visible={true} />
                        {selectedLocation && (
                            <MapboxGL.PointAnnotation
                                id="selectedLocation"
                                title={selectedLocation.name}
                                coordinate={[selectedLocation.longitude, selectedLocation.latitude]}
                            >
                                <View>
                                    <MaterialIcons name="location-on" size={24} color="red" />
                                </View>
                            </MapboxGL.PointAnnotation>
                        )}
                    </MapboxGL.MapView>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    mainButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        justifyContent: 'space-between',
        borderBottomColor: '#E6E9EB',
        paddingVertical: 15,
        borderBottomWidth: 1
    },
    btn_left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    button_sub_text: {
        color: '#6E7375',
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    buttonText: {
        flex: 1,
        lineHeight: 19,
        marginLeft: 8,
        fontSize: 19,
        fontWeight: '700',
        color: '#131214',
    },
    locationIcon: {
        padding: 0,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchInput: {
        flex: 1,
        marginLeft: 16,
        fontSize: 16,
        color: '#333',
    },
    mapSearchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7257FF',
        margin: 16,
        padding: 12,
        borderRadius: 8,
    },
    mapSearchText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
    },
    searchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchItemText: {
        marginLeft: 16,
        fontSize: 16,
        color: '#333',
    },
    map: {
        flex: 1,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});

export default LocationPicker;