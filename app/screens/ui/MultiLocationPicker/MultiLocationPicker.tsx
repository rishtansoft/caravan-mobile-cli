import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LocationPicker from '../LocationPicker/LocationPicker';

interface Location {
    name: string;
    latitude: number;
    longitude: number;
}

interface LocationItem {
    id: string;
    location: Location | null;
}

interface MultiLocationPickerProps {
    onLocationsChange: (locations: Location[]) => void;
    maxLocations?: number;
}

const MultiLocationPicker: React.FC<MultiLocationPickerProps> = ({
    onLocationsChange,
    maxLocations = 10
}) => {
    const [locationItems, setLocationItems] = useState<LocationItem[]>([]);

    const handleAddLocation = () => {
        if (locationItems.length < maxLocations) {
            const newId = (locationItems.length + 1).toString();
            setLocationItems([...locationItems, { id: newId, location: null }]);
        }
    };

    // const handleRemoveLocation = (id: string) => {
    //     const newItems = locationItems.filter(item => item.id !== id);
    //     setLocationItems(newItems);

    //     // Update parent component with new locations
    //     const validLocations = newItems
    //         .map(item => item.location)
    //         .filter((location): location is Location => location !== null);
    //     onLocationsChange(validLocations);
    // };

    // const handleLocationSelect = (id: string, location: Location) => {
    //     const newItems = locationItems.map(item =>
    //         item.id === id ? { ...item, location } : item
    //     );
    //     setLocationItems(newItems);

    //     // Update parent component with new locations
    //     const validLocations = newItems
    //         .map(item => item.location)
    //         .filter((location): location is Location => location !== null);
    //     onLocationsChange(validLocations);
    // };


    // const handleAddLocation = () => {
    //     if (locationItems.length < maxLocations) {
    //         const newId = (locationItems.length + 1).toString();
    //         setLocationItems([...locationItems, { id: newId, location: null }]);

    //         // Yangi location qo'shilganda ham onLocationsChange ni chaqiramiz
    //         const allLocations = [...locationItems, { id: newId, location: null }]
    //             .map(item => item.location)
    //             .filter((location): location is Location => location !== null);
    //         onLocationsChange(allLocations);
    //     }
    // };

    const handleRemoveLocation = (id: string) => {
        const newItems = locationItems.filter(item => item.id !== id);
        setLocationItems(newItems);

        // Remove qilinganda ham onLocationsChange ni chaqiramiz
        const allLocations = newItems
            .map(item => item.location)
            .filter((location): location is Location => location !== null);
        onLocationsChange(allLocations);
    };

    const handleLocationSelect = (id: string, location: Location) => {
        const newItems = locationItems.map(item =>
            item.id === id ? { ...item, location } : item
        );
        setLocationItems(newItems);

        // Location tanlaganda barcha locationlarni yuboramiz
        const allLocations = newItems
            .map(item => item.location)
            .filter((location): location is Location => location !== null);
        onLocationsChange(allLocations);
    };

    // Har safar locationItems o'zgarganda onLocationsChange ni chaqiramiz
    useEffect(() => {
        const allLocations = locationItems
            .map(item => item.location)
            .filter((location): location is Location => location !== null);
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
                    style={styles.addButton}
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
    locationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    removeButton: {
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