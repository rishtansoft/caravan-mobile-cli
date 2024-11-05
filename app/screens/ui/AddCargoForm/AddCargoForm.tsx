import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal,
    TouchableOpacity,
    Pressable,
    SafeAreaView,
} from 'react-native';
import { API_URL } from '@env';
import axios from 'axios';

interface CargoFormProps {
    values: {
        cargoType: { value: number; label: string } | null;
        weight: string;
        loadingTime: string;
        vehicleType: { value: string; label: string } | null;
    };
    errors: {
        cargoTypeError: boolean;
        weightError: boolean;
        loadingTimeError: boolean;
        vehicleTypeError: boolean;
    };
    onCargoTypeChange: (value: { value: number; label: string } | null) => void;
    onWeightChange: (value: string) => void;
    onLoadingTimeChange: (value: string) => void;
    onVehicleTypeChange: (value: { value: string; label: string } | null) => void;
}


interface SelectModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (item: any) => void;
    items: Array<{ label: string; value: any }>;
    title: string;
}

const SelectModal: React.FC<SelectModalProps> = ({
    visible,
    onClose,
    onSelect,
    items,
    title,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity onPress={onClose} style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll}>
                        {items.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.modalItem}
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                            >
                                <Text style={styles.modalItemText}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

interface carTypes {
    id: string,
    name: string
}

const CargoForm: React.FC<CargoFormProps> = (
    { values,
        errors,
        onCargoTypeChange,
        onWeightChange,
        onLoadingTimeChange,
        onVehicleTypeChange
    }
) => {
    // Input states
    const [weightIsFocused, setWeightIsFocused] = useState(false);
    const [loadingTimeIsFocused, setLoadingTimeIsFocused] = useState(false);

    // Modal visibility states
    const [cargoTypeModalVisible, setCargoTypeModalVisible] = useState(false);
    const [vehicleTypeModalVisible, setVehicleTypeModalVisible] = useState(false);
    const [vehicleTypes, setVehicleTypes] = useState([]);

    // Dropdown items
    const cargoTypes = [
        { value: 'Boshqa materiallar', label: "Boshqa materiallar" },
        { value: 'Oziq ovqat', label: "Oziq ovqat" },
        { value: 'Kiyimlar', label: "Kiyimlar" },
        { value: 'Uskunalar va ehtiyot qismlar', label: "Uskunalar va ehtiyot qismlar" },
        { value: 'Dori vositalari', label: "Dori vositalari" },
        { value: "Xo'jalik mahsulotlari", label: "Xo'jalik mahsulotlari" },
        { value: "Temir konstrukcia", label: "Temir konstrukcia" },
        { value: "Yog'och", label: "Yog'och" },
        { value: "Mebel", label: "Mebel" },
        { value: "Qurilish mollari", label: "Qurilish mollari" }
    ];

    // const vehicleTypes = [
    //     { label: 'Yuk mashina', value: 'truck' },
    //     { label: 'Pikap', value: 'pickup' },
    //     { label: 'Fura', value: 'semi' },
    // ];

    useEffect(() => {
        axios.get(API_URL + '/api/admin/car-type/get-all')
            .then((res) => {
                console.log(115, res.data.carTypes);
                if (res.data?.carTypes && res.data.carTypes.length > 0) {
                    const newArr = res.data.carTypes.map((el: carTypes) => {
                        return {
                            value: el.id,
                            label: el.name
                        }
                    })
                    setVehicleTypes(newArr)
                }

            }).catch((error) => {
                console.log(error);

            })
    }, []);


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContentContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    {/* Yuk turi Select */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Yuk turi</Text>
                        <TouchableOpacity
                            style={[
                                styles.selectButton,
                                errors.cargoTypeError && styles.errorInput
                            ]}
                            onPress={() => setCargoTypeModalVisible(true)}
                        >
                            <Text style={[
                                styles.selectButtonText,
                                values.cargoType && styles.selectedText
                            ]}>
                                {values.cargoType ? values.cargoType.label : "Yuk turini tanlang"}
                            </Text>
                        </TouchableOpacity>
                        {errors.cargoTypeError && (
                            <Text style={styles.errorText}>Yuk turini tanlang</Text>
                        )}
                    </View>

                    {/* Yuk og'irligi Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Yuk o'g'irligi (kg)</Text>
                        <TextInput
                            value={values.weight}
                            onChangeText={onWeightChange}

                            placeholder="Yuk o'g'irligini kiriting"
                            placeholderTextColor="#898D8F"
                            style={[
                                weightIsFocused ? styles.inputFocus : styles.input,
                                errors.weightError && styles.errorInput
                            ]}
                            onFocus={() => setWeightIsFocused(true)}
                            onBlur={() => setWeightIsFocused(false)}
                            keyboardType="numeric"
                        />
                        {errors.weightError && (
                            <Text style={styles.errorText}>To'g'ri og'irlik kiriting</Text>
                        )}
                    </View>

                    {/* Yuklash vaqti Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Yuklash vaqti (soat)</Text>
                        <TextInput
                            value={values.loadingTime}
                            onChangeText={onLoadingTimeChange}
                            placeholder="Yuklash vaqtini tanlang"
                            placeholderTextColor="#898D8F"
                            style={[
                                loadingTimeIsFocused ? styles.inputFocus : styles.input,
                                errors.loadingTimeError && styles.errorInput
                            ]}
                            onFocus={() => setLoadingTimeIsFocused(true)}
                            onBlur={() => setLoadingTimeIsFocused(false)}
                            keyboardType={'numeric'}
                        />
                        {errors.loadingTimeError && (
                            <Text style={styles.errorText}>Yuklash vaqtini kiriting</Text>
                        )}
                    </View>

                    {/* Mashina turi Select */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mashina turi</Text>
                        <TouchableOpacity
                            style={[
                                styles.selectButton,
                                errors.vehicleTypeError && styles.errorInput
                            ]}
                            onPress={() => setVehicleTypeModalVisible(true)}
                        >
                            <Text style={[
                                styles.selectButtonText,
                                values.vehicleType && styles.selectedText
                            ]}>
                                {values.vehicleType ? values.vehicleType.label : "Mashina turini tanlang"}
                            </Text>
                        </TouchableOpacity>
                        {errors.vehicleTypeError && (
                            <Text style={styles.errorText}>Mashina turini tanlang</Text>
                        )}
                    </View>

                    {/* Modals */}
                    <SelectModal
                        visible={cargoTypeModalVisible}
                        onClose={() => setCargoTypeModalVisible(false)}
                        onSelect={onCargoTypeChange}
                        items={cargoTypes}
                        title="Yuk turini tanlang"
                    />

                    <SelectModal
                        visible={vehicleTypeModalVisible}
                        onClose={() => setVehicleTypeModalVisible(false)}
                        onSelect={onVehicleTypeChange}
                        items={vehicleTypes}
                        title="Mashina turini tanlang"
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({

    errorInput: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
    },
    selectedText: {
        color: '#000000',
    },

    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    modalScroll: {
        maxHeight: '100%',
    },
    modalItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E9E9',
    },
    modalItemText: {
        fontSize: 16,
        color: '#131214',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    selectButtonText_plech: {
        color: "#898D8F"
    },

    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E9E9',
    },
    closeButton: {
        fontSize: 20,
        color: '#2d2d2d',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#131214',
    },
    selectButton: {
        height: 48,
        borderWidth: 1,
        borderColor: '#E8E9E9',
        borderRadius: 8,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    selectButtonText: {
        color: '#131214',
    },
    scrollContentContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    container: {
        gap: 16,
        flex: 1,
    },
    inputContainer: {
        gap: 8,
        marginBottom: 16,
        zIndex: 1,
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