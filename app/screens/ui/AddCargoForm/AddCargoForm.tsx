import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface CargoFormProps {
    onSubmit: (data: {
        cargoType: string;
        weight: string;
        loadingTime: string;
        vehicleType: string;
    }) => void;
}

const CargoForm: React.FC<CargoFormProps> = ({ onSubmit }) => {
    // Input states
    const [weight, setWeight] = useState('');
    const [loadingTime, setLoadingTime] = useState('');

    // Focus states
    const [weightIsFocused, setWeightIsFocused] = useState(false);
    const [loadingTimeIsFocused, setLoadingTimeIsFocused] = useState(false);

    // Dropdown open states
    const [cargoTypeOpen, setCargoTypeOpen] = useState(false);
    const [vehicleTypeOpen, setVehicleTypeOpen] = useState(false);

    // Dropdown values
    const [cargoType, setCargoType] = useState(null);
    const [vehicleType, setVehicleType] = useState(null);

    // Dropdown items
    const [cargoTypes] = useState([
        { label: 'Qurilish materiallari', value: 'construction' },
        { label: 'Oziq-ovqat', value: 'food' },
        { label: 'Mebel', value: 'furniture' },
    ]);

    const [vehicleTypes] = useState([
        { label: 'Yuk mashina', value: 'truck' },
        { label: 'Pikap', value: 'pickup' },
        { label: 'Fura', value: 'semi' },
    ]);

    return (
        <View style={styles.container}>
            {/* Yuk turi Dropdown */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Yuk turi</Text>
                <DropDownPicker
                    open={cargoTypeOpen}
                    value={cargoType}
                    items={cargoTypes}
                    setOpen={setCargoTypeOpen}
                    setValue={setCargoType}
                    placeholder="Yuk turini tanlang"
                    placeholderStyle={styles.placeholderStyle}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    textStyle={styles.dropdownText}
                    zIndex={2000}
                    zIndexInverse={1000}
                />
            </View>

            {/* Yuk og'irligi Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Yuk o'g'irligi</Text>
                <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="Yuk o'g'irligini kiriting"
                    placeholderTextColor="#898D8F"
                    style={weightIsFocused ? styles.inputFocus : styles.input}
                    onFocus={() => setWeightIsFocused(true)}
                    onBlur={() => setWeightIsFocused(false)}
                />
            </View>

            {/* Yuklash vaqti Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Yuklash vaqti</Text>
                <TextInput
                    value={loadingTime}
                    onChangeText={setLoadingTime}
                    placeholder="Yuklash vaqtini tanlang"
                    placeholderTextColor="#898D8F"
                    style={loadingTimeIsFocused ? styles.inputFocus : styles.input}
                    onFocus={() => setLoadingTimeIsFocused(true)}
                    onBlur={() => setLoadingTimeIsFocused(false)}
                />
            </View>

            {/* Mashina turi Dropdown */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Mashina turi</Text>
                <DropDownPicker
                    open={vehicleTypeOpen}
                    value={vehicleType}
                    items={vehicleTypes}
                    setOpen={setVehicleTypeOpen}
                    setValue={setVehicleType}
                    placeholder="Mashina turini tanlang"
                    placeholderStyle={styles.placeholderStyle}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    textStyle={styles.dropdownText}
                    zIndex={1000}
                    zIndexInverse={2000}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    inputContainer: {
        gap: 8,
        marginBottom: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#131214',
        marginBottom: 4,
    },
    input: {
        borderColor: '#E6E9EB',
        width: '100%',
        borderWidth: 1,
        color: '#131214',
        borderRadius: 8,
        paddingLeft: 15,
        height: 48,
    },
    inputFocus: {
        borderColor: '#7257FF',
        width: '100%',
        borderWidth: 2,
        color: '#131214',
        borderRadius: 8,
        paddingLeft: 15,
        height: 48,
        shadowColor: '#7257FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 1,
    },
    dropdown: {
        borderColor: '#E6E9EB',
        borderWidth: 1,
        borderRadius: 8,
        height: 48,
    },
    dropdownContainer: {
        borderColor: '#E6E9EB',
        borderWidth: 1,
        borderRadius: 8,
    },
    dropdownText: {
        color: '#131214',
        fontSize: 14,
    },
    placeholderStyle: {
        color: '#898D8F',
        fontSize: 14,
    },
});

export default CargoForm;