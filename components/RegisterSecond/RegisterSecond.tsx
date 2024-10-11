import React, { useState, useRef } from 'react';
import {
    SafeAreaView, View,
    StyleSheet, TextInput,
    FlatList, TouchableOpacity,
    Text, Button, Animated,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,

} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RegisterSecondProps } from '../RouterTypes';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CustomDatePicker from '../ui/DatePiker/DatePIker';
import UserTypeSelection from '../ui/ButtonUserRole/ButtonUserRole';

enum UserType {
    DRIVER = 'driver',
    OWNER = 'owner',
}

const RegisterSecond: React.FC<RegisterSecondProps> = ({ navigation }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    const [phone, setPhone] = useState<string>('+998 91 234 56 78');

    const [phoneSecond, setPhoneSecond] = useState<string>('');
    const [phoneSecondError, setPhoneSecondError] = useState<string>('');
    const [phoneSecondIsFocused, setPhoneSecondIsFocused] = useState<boolean>(false);

    const [date, setDate] = useState<Date>(new Date());
    const [dateText, setDateText] = useState<string>(date.toDateString());
    const [dateError, setDateError] = useState<string>('');



    const [role, setRole] = useState<string>('');
    const [roleError, setRoleError] = useState<string>('');
    const [roleIsFocused, setRoleIsFocused] = useState<boolean>(false);



    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#7257FF', '#462eba'], // 0 = 'blue', 1 = 'darkblue'
    });


    const phoneSecondInputFun = (values: string) => {
        setPhoneSecond(values)
        setPhoneSecondError('')
    }

    const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; // Return formatted date as dd/mm/yyyy
    };
    const handleDateChange = (date: Date) => {
        console.log('Selected date:', date);
        setDateError('');
    };

    const handleUserTypeSelect = (type: UserType) => {
        console.log('Tanlangan foydalanuvchi turi:', type);
    };


    return (
        <View style={styles.container}>
            <View style={styles.header_con}>
                <View style={{
                    width: '6%'
                }}>
                    <Icon onPress={() => navigation.navigate('Register')} name="angle-left" size={30} color="#7257FF" />
                </View>
                <Text style={styles.text}>
                    Ro'yxatdan o'tish
                </Text>
            </View>
            <View>
                <View >
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>Telefon raqam</Text>
                    <TextInput
                        style={styles.inputDisebled}
                        value={phone}
                        editable={false}

                    />
                    <Text style={{ color: '#6E7375', marginTop: 6, lineHeight: 14 }}>Asosiy raqamingiz</Text>
                </View>


                <View style={{ marginTop: 18 }}>
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>Telefon raqam</Text>
                    <TextInput
                        style={!phoneSecondIsFocused ? styles.input : styles.inputFocus}
                        keyboardType={"numeric"}
                        placeholderTextColor="#898D8F"
                        value={phoneSecond}
                        onChangeText={phoneSecondInputFun}
                        placeholder="+998 __  ___  __  __"
                        onFocus={() => setPhoneSecondIsFocused(true)}
                        onBlur={() => setPhoneSecondIsFocused(false)}

                    />
                    {phoneSecondError ? <Text style={styles.errorText}>{phoneSecondError}</Text> : null}
                </View>

                <View style={{ marginTop: 18 }}>
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>Tug'ilgan sana</Text>
                    <CustomDatePicker onDateChange={handleDateChange}></CustomDatePicker>
                    {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
                </View>

                <View style={{ flex: 1, marginTop: 18 }}>
                    <UserTypeSelection onSelect={handleUserTypeSelect} />
                </View>




            </View>




            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0
            }}>
                <TouchableOpacity
                    // style={isPressed ? styles.inbutton : styles.button}
                    // onPressIn={() => handlePressIn()}
                    // onPressOut={() => handlePressOut()}
                    activeOpacity={1}

                >
                    <Animated.View style={[styles.button, { backgroundColor }]}>
                        <Text
                            // onPress={saveDataFun}
                            style={styles.button_text}>
                            Ro'yxatdan o'tish
                        </Text>
                    </Animated.View>

                </TouchableOpacity>
            </View>

        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
        position: 'relative'
    },
    header_con: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

    },
    text: {
        color: '#131214',
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 100,
        width: '90%',
        fontWeight: '600'
    },
    input: {
        borderColor: '#E6E9EB',
        width: '100%',
        borderWidth: 1,
        color: '#131214',
        borderRadius: 8,
        paddingLeft: 15,
    },
    inputDisebled: {
        borderColor: '#C1C4C6',
        width: '100%',
        borderWidth: 1,
        color: '#898D8F',
        borderRadius: 8,
        paddingLeft: 15,
        backgroundColor: '#DADDDE'
    },

    inputFocus: {
        borderColor: '#7257FF',
        width: '100%',
        borderWidth: 2,
        color: '#131214',
        borderRadius: 8,
        paddingLeft: 15,
        shadowColor: '#7257FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 1,

    },
    errorText: {
        color: 'red',
        marginTop: 6,
        lineHeight: 14
    },


    button: {
        backgroundColor: '#7257FF',
        padding: 9,
        margin: 10,
        borderRadius: 20,
        cursor: 'pointer',
    },
    button_text: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
        width: "100%"
    },


});



export default RegisterSecond;