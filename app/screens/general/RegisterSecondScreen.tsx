import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet, TextInput,
    TouchableOpacity,
    Text, Animated,
    Keyboard,

} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RegisterSecondProps } from './RouterType';
import CustomDatePicker from '../ui/DatePIker/DatePIker';
import UserTypeSelection from '../ui/ButtonUserRole/ButtonUserRole';
import axios from 'axios';
import { API_URL } from '@env';
import { StoreData, GetData, } from '../AsyncStorage/AsyncStorage';


enum UserType {
    DRIVER = 'driver',
    OWNER = 'cargo_owner',
}

const RegisterSecondScreen: React.FC<RegisterSecondProps> = ({ navigation }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [phone, setPhone] = useState<string>('+998 91 234 56 78');
    const [phoneSecond, setPhoneSecond] = useState<string>('');
    const [phoneSecondError, setPhoneSecondError] = useState<string>('');
    const [phoneSecondIsFocused, setPhoneSecondIsFocused] = useState<boolean>(false);
    const [date, setDate] = useState<Date>();
    const [dateError, setDateError] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [roleError, setRoleError] = useState<string>('');
    const [user_id, setUser_id] = useState<string>('');
    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#7257FF', '#462eba'], // 0 = 'blue', 1 = 'darkblue'
    });
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        GetData('user_id').then((res) => {
            if (res) {
                // console.log(44, JSON.parse(res).user_id);
                setUser_id(res)

            }
        }).catch((error) => {
            console.error('Xatolik yuz berdi:', error);
        });

        GetData('user_data').then((res) => {
            if (res) {
                setPhone(JSON.parse(res).phone)
            }
        }).catch((error) => {
            console.error('Xatolik yuz berdi:', error);
        });
    }, []);

    useEffect(() => {


        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true); // Klaviatura ochilganda true ga o'zgartirish
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false); // Klaviatura yopilganda false ga o'zgartirish
        });

        return () => {
            // Listenerlarni tozalash
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handlePressIn = () => {
        // setIsPressed(true);
        Animated.timing(animatedValue, {
            toValue: 1, // Final holat (bosilganda)
            duration: 100, // O'zgarish vaqti (ms)
            useNativeDriver: false, // ranglar uchun `useNativeDriver` false bo'lishi kerak
        }).start();
    };

    const handlePressOut = () => {
        // setIsPressed(false);
        Animated.timing(animatedValue, {
            toValue: 0, // Bosilmaganda dastlabki holatga qaytadi
            duration: 100, // O'zgarish vaqti (ms)
            useNativeDriver: false,
        }).start();
    };


    const phoneSecondInputFun = (values: string) => {
        setPhoneSecond(values);
        setPhoneSecondError('');
    };

    const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        return `${year}.${month}.${day}`; // Return formatted date as dd/mm/yyyy
    };
    const handleDateChange = (date: Date) => {
        setDate(date);
        setDateError('');
    };

    const handleUserTypeSelect = (type: UserType) => {
        setRole(type);
        setRoleError('');
    };
    const phoneValidateFun = (value: string) => {
        const phoneRegex = /^998\d{9}$/; // +998xxxxxxxxx phone format
        if (value && phoneRegex.test(value)) {
            return true;
        } else {
            return false;
        }
    };

    const saveData = async () => {
        if (
            (phoneSecond && phoneSecond ? phoneValidateFun(phone) : true) || date && role
        ) {
            await axios.post(API_URL + '/api/auth/register/complete', {
                "phone_2": phoneSecond ? '+' + phoneSecond : '',
                "role": role,
                "birthday": date,
                'user_id': user_id
            }).then((res) => {
                console.log(119, res.data);

                StoreData('user_data_2', JSON.stringify({
                    "phone_2": phoneSecond ? '+' + phoneSecond : '',
                    "role": role,
                    "birthday": date,
                    'user_id': user_id
                }));
                navigation.navigate('verify_sms_screen');
            }).catch((error) => {
                console.log(128, error?.response?.data?.message);

            })
        } else {
            if (phoneSecond && !phoneValidateFun(phone)) {
                setPhoneSecondError('Telefon raqam nato\'g\'ri kiritildi!');
            } else {
                setPhoneSecondError('');
            }

        }
    };


    return (
        <View style={styles.container}>
            <View>
                <View style={styles.header_con}>
                    <View style={{
                        width: '6%'
                    }}>
                        <Icon onPress={() => navigation.navigate('register')} name="angle-left" size={30} color="#7257FF" />
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
                        <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>Qo'shimcha telefon raqam <Text style={styles.span_teg}>(ixtiyoriy)</Text></Text>
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
                        {roleError ? <Text style={styles.errorText}>{roleError}</Text> : null}

                    </View>
                </View>
            </View>
            {!keyboardVisible && <View>
                <TouchableOpacity
                    // style={isPressed styles.inbutton : styles.button}
                    onPressIn={() => handlePressIn()}
                    onPressOut={() => handlePressOut()}
                    activeOpacity={1}
                >
                    <Animated.View style={[styles.button, { backgroundColor }]}>
                        <Text
                            onPress={saveData}
                            style={styles.button_text}>
                            Ro'yxatdan o'tish
                        </Text>
                    </Animated.View>

                </TouchableOpacity>
            </View>}


        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
        position: 'relative',
        justifyContent: 'space-between',
    },
    header_con: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

    },
    span_teg: {
        color: '#C1C4C6',
        fontWeight: '500',
    },
    text: {
        color: '#131214',
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 100,
        width: '90%',
        fontWeight: '600',
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
        backgroundColor: '#DADDDE',
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
        lineHeight: 14,
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
        width: '100%',
    },


});



export default RegisterSecondScreen;