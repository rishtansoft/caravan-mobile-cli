import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LocationPicker from '../LocationPicker/LocationPicker';

interface Location {
    name: string;
    latitude: number;
    longitude: number;
}

interface LocationArr {
    name: string;
    latitude: number;
    longitude: number;
    order: number;
}

interface LocationItem {
    id: string;
    location: Location | null;
    order: number;
}

interface MultiLocationPickerProps {
    onLocationsChange: (locations: LocationArr[]) => void;
    maxLocations?: number;
}

const MultiLocationPicker: React.FC<MultiLocationPickerProps> = ({
    onLocationsChange,
    maxLocations = 10
}) => {
    const [locationItems, setLocationItems] = useState<LocationItem[]>([]);
    const [nextId, setNextId] = useState(1); // Unique ID uchun counter

    const recalculateOrders = (items: LocationItem[]): LocationItem[] => {
        return items.map((item, index) => ({
            ...item,
            order: index + 2
        }));
    };

    const canAddNewLocation = () => {
        if (locationItems.length === 0) return true;
        const lastLocation = locationItems[locationItems.length - 1];
        return lastLocation.location !== null;
    };

    const handleAddLocation = () => {
        if (!canAddNewLocation()) {
            Alert.alert(
                "Ogohlantirish",
                "To'xtash joyni oldin to'ldiring",
                [{ text: "OK", onPress: () => console.log("Alert closed") }]
            );
            return;
        }

        if (locationItems.length < maxLocations) {
            // Unique ID yaratamiz
            const newId = `location_${nextId}`;
            setNextId(prevId => prevId + 1);

            const newItems = [...locationItems, {
                id: newId,
                location: null,
                order: locationItems.length + 2
            }];
            setLocationItems(newItems);
        }
    };

    const handleRemoveLocation = (id: string) => {
        const newItems = locationItems.filter(item => item.id !== id);
        const updatedItems = recalculateOrders(newItems);
        setLocationItems(updatedItems);

        const allLocations = updatedItems
            .map(item => item.location ? { ...item.location, order: item.order } : null)
            .filter((location): location is LocationArr => location !== null);
        onLocationsChange(allLocations);
    };

    const handleLocationSelect = (id: string, location: Location) => {
        const newItems = locationItems.map(item =>
            item.id === id ? { ...item, location } : item
        );
        setLocationItems(newItems);

        const allLocations = newItems
            .map(item => item.location ? { ...item.location, order: item.order } : null)
            .filter((location): location is LocationArr => location !== null);
        onLocationsChange(allLocations);
    };

    useEffect(() => {
        const allLocations = locationItems
            .map(item => item.location ? { ...item.location, order: item.order } : null)
            .filter((location): location is LocationArr => location !== null);
        onLocationsChange(allLocations);
    }, [locationItems]);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {locationItems.map((item, index) => (
                    <View key={item.id} style={styles.locationItem}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity
                                onPress={() => handleRemoveLocation(item.id)}
                                style={styles.removeButton}
                            >
                                <MaterialIcons name="remove-circle" size={24} color="#710000" />
                            </TouchableOpacity>
                        </View>
                        <LocationPicker
                            sub_text={`${index + 1}-to'xtash joyi`}
                            onLocationSelect={(location) => handleLocationSelect(item.id, location)}
                        />
                    </View>
                ))}
            </ScrollView>

            {locationItems.length < maxLocations && (
                <TouchableOpacity
                    style={[
                        styles.addButton,
                        !canAddNewLocation() && styles.disabledButton
                    ]}
                    onPress={handleAddLocation}
                >
                    <Ionicons name="add-outline" size={28} color="#898D8F" />
                    <Text style={styles.addButtonText}>
                        To'xtash joyi qo'shing
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    locationItem: {
        position: 'relative',
        paddingVertical: 8,
    },
    headerRow: {
        position: 'absolute',
        zIndex: 999,
        right: 5,
        top: 0,
    },
    disabledButton: {
        opacity: 0.5,
    },
    locationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    removeButton: {
        marginBottom: 5
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderBottomColor: '#E6E9EB',
        paddingVertical: 15,
    },
    addButtonCenter: {
        marginVertical: 24,
    },
    addButtonText: {
        lineHeight: 19,
        marginLeft: 8,
        fontSize: 19,
        fontWeight: '700',
        color: '#131214',

    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
    },
});

export default MultiLocationPicker;