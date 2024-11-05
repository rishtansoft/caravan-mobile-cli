import React, { useState } from 'react';
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

interface CargoFormProps {
    onSubmit: (data: {
        cargoType: string;
        weight: string;
        loadingTime: string;
        vehicleType: string;
    }) => void;
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

const CargoForm: React.FC<CargoFormProps> = ({ onSubmit }) => {
    // Input states
    const [weight, setWeight] = useState('');
    const [loadingTime, setLoadingTime] = useState('');
    const [weightIsFocused, setWeightIsFocused] = useState(false);
    const [loadingTimeIsFocused, setLoadingTimeIsFocused] = useState(false);

    // Selected values
    const [selectedCargoType, setSelectedCargoType] = useState<{ label: string, value: any } | null>(null);
    const [selectedVehicleType, setSelectedVehicleType] = useState<{ label: string, value: any } | null>(null);

    // Modal visibility states
    const [cargoTypeModalVisible, setCargoTypeModalVisible] = useState(false);
    const [vehicleTypeModalVisible, setVehicleTypeModalVisible] = useState(false);

    // Dropdown items
    const cargoTypes = [
        { value: 1, label: "Boshqa materiallar" },
        { value: 2, label: "Oziq ovqat" },
        { value: 3, label: "Kiyimlar" },
        { value: 4, label: "Uskunalar va ehtiyot qismlar" },
        { value: 5, label: "Dori vositalari" },
        { value: 6, label: "Xo'jalik mahsulotlari" },
        { value: 7, label: "Temir konstrukcia" },
        { value: 8, label: "Yog'och" },
        { value: 9, label: "Mebel" },
        { value: 10, label: "Qurilish mollari" }
    ];

    const vehicleTypes = [
        { label: 'Yuk mashina', value: 'truck' },
        { label: 'Pikap', value: 'pickup' },
        { label: 'Fura', value: 'semi' },
    ];

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
                            style={styles.selectButton}
                            onPress={() => setCargoTypeModalVisible(true)}
                        >{
                                selectedCargoType ? (<Text style={styles.selectButtonText}>
                                    {selectedCargoType.label}
                                </Text>) : (
                                    <Text style={styles.selectButtonText_plech}>
                                        Yuk turini tanlang
                                    </Text>
                                )
                            }


                        </TouchableOpacity>
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

                    {/* Mashina turi Select */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mashina turi</Text>
                        <TouchableOpacity
                            style={styles.selectButton}
                            onPress={() => setVehicleTypeModalVisible(true)}
                        >
                            <Text style={styles.selectButtonText}>
                                {selectedVehicleType ? selectedVehicleType.label : "Mashina turini tanlang"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Modals */}
                    <SelectModal
                        visible={cargoTypeModalVisible}
                        onClose={() => setCargoTypeModalVisible(false)}
                        onSelect={setSelectedCargoType}
                        items={cargoTypes}
                        title="Yuk turini tanlang"
                    />

                    <SelectModal
                        visible={vehicleTypeModalVisible}
                        onClose={() => setVehicleTypeModalVisible(false)}
                        onSelect={setSelectedVehicleType}
                        items={vehicleTypes}
                        title="Mashina turini tanlang"
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({

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