import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { AddLoadSecondProps } from './RouterType';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AddCargoForm from '../ui/AddCargoForm/AddCargoForm';

const showErrorAlert = (message: string) => {
    Alert.alert('Xatolik', message, [{ text: 'OK', onPress: () => console.log('OK bosildi') }]);
};

import { StoreData, GetData, RemoveData } from '../AsyncStorage/AsyncStorage';


interface FormState {
    cargoType: { value: number; label: string } | null;
    weight: string;
    loadingTime: string;
    vehicleType: { value: string; label: string } | null;
}

interface FormErrors {
    cargoTypeError: boolean;
    weightError: boolean;
    loadingTimeError: boolean;
    vehicleTypeError: boolean;
}


const AddLoadSecond: React.FC<AddLoadSecondProps> = ({ navigation }) => {

    const [formValues, setFormValues] = useState<FormState>({
        cargoType: null,
        weight: '',
        loadingTime: '',
        vehicleType: null
    });

    // Form errors state
    const [formErrors, setFormErrors] = useState<FormErrors>({
        cargoTypeError: false,
        weightError: false,
        loadingTimeError: false,
        vehicleTypeError: false
    });

    const removeNewLoad = async () => {
        await RemoveData('new_load_1')
        await RemoveData('new_load_2')
        await RemoveData('new_load_3')
        navigation.navigate("home")
    }


    const handleCargoTypeChange = (value: { value: number; label: string } | null) => {
        setFormValues(prev => ({ ...prev, cargoType: value }));
        if (value) {
            setFormErrors(prev => ({ ...prev, cargoTypeError: false }));
        }
    };

    const handleWeightChange = (value: string) => {
        setFormValues(prev => ({ ...prev, weight: value }));
        if (value) {
            setFormErrors(prev => ({ ...prev, weightError: false }));
        }
    };

    const handleLoadingTimeChange = (value: string) => {
        setFormValues(prev => ({ ...prev, loadingTime: value }));
        if (value) {
            setFormErrors(prev => ({ ...prev, loadingTimeError: false }));
        }
    };

    const handleVehicleTypeChange = (value: { value: string; label: string } | null) => {
        setFormValues(prev => ({ ...prev, vehicleType: value }));
        if (value) {
            setFormErrors(prev => ({ ...prev, vehicleTypeError: false }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            cargoTypeError: !formValues.cargoType,
            weightError: !formValues.weight || isNaN(Number(formValues.weight)),
            loadingTimeError: !formValues.loadingTime,
            vehicleTypeError: !formValues.vehicleType
        };

        setFormErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            console.log('Form submitted:', formValues);
            await StoreData('new_load_2', JSON.stringify(formValues))
            navigation.navigate('add_load_third')

        } else {
            showErrorAlert('Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring');
        }
    };





    return (
        <SafeAreaView style={styles.container_all}>
            {/* Header */}
            <View style={styles.header_con}>
                <View style={{ width: '6%' }}>
                    <Icon
                        onPress={() => navigation.navigate('add_loads')}
                        name="angle-left"
                        size={30}
                        color="#7257FF"
                    />
                </View>
                <Icon
                    onPress={handleSubmit}
                    name="angle-right"
                    size={30}
                    color="#7257FF"
                />
            </View>

            {/* Progress Bar */}
            <View style={styles.header_con}>
                <View style={styles.prosent_con}>
                    <View style={styles.prosent}></View>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content_container}>
                {/* <ScrollView */}
                {/* style={styles.scroll_con} */}
                {/* contentContainerStyle={styles.scrollContent} */}
                {/* > */}
                <View style={styles.container}>
                    <AddCargoForm
                        values={formValues}
                        errors={formErrors}
                        onCargoTypeChange={handleCargoTypeChange}
                        onWeightChange={handleWeightChange}
                        onLoadingTimeChange={handleLoadingTimeChange}
                        onVehicleTypeChange={handleVehicleTypeChange}
                    />
                </View>
                {/* </ScrollView> */}

                {/* Bottom Buttons */}
                <View style={styles.bottom_btns}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={removeNewLoad}
                    >
                        <Feather name="x" size={24} color="#131214" />
                        <Text style={styles.cancelButtonText}>Bekor qilish</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.continueButton]}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.continueButtonText}>Davom etish</Text>
                        <AntDesign name="arrowright" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container_all: {
        flex: 1,
        backgroundColor: '#F4F6F7',
    },
    content_container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    prosent_con: {
        width: '100%',
        height: 4,
        backgroundColor: '#E6E9EB',
        borderRadius: 5
    },
    prosent: {
        width: '55%',
        height: 4,
        borderRadius: 5,
        backgroundColor: '#7257FF'
    },
    header_con: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: "100%",
        paddingHorizontal: 15,
        paddingVertical: 15,
        justifyContent: 'space-between',
    },
    scroll_con: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    bottom_btns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20, // Pastdan masofani kamaytirdik
        paddingTop: 12, // Yuqoridan masofani kamaytirdik
        // marginBottom: 40, // Ekran pastidan masofani sozladik
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        flex: 0.48,
    },
    cancelButton: {
        backgroundColor: '#E8EBEB',
    },
    continueButton: {
        backgroundColor: '#7257FF',
    },
    cancelButtonText: {
        color: '#131214',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '500',
    },
    continueButtonText: {
        color: '#FFFFFF',
        marginRight: 8,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default AddLoadSecond;