import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet, TextInput,
    FlatList, TouchableOpacity,
    Text, Animated,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MainPhoneUpdateProps } from './RouterType';
import axios from 'axios';
import { API_URL } from '@env';
import { StoreData, GetData, } from '../AsyncStorage/AsyncStorage';

const showErrorAlert = (message: string) => {
    Alert.alert('Xatolik', message, [{ text: 'OK', onPress: () => console.log('OK bosildi') }]);
};



const MainPhoneUpdate: React.FC<MainPhoneUpdateProps> = ({ navigation }) => {
    const [phone, setPhone] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');
    const [phoneIsFocused, setPhoneIsFocused] = useState<boolean>(false);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [user_id, setUser_id] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [unique_id, setUnique_id] = useState<string>('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);

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

    useEffect(() => {
        GetData('user_id').then((res) => {
            if (res) {
                // console.log(44, JSON.parse(res).user_id);
                setUser_id(res)

            }
        }).catch((error) => {
            console.error('Xatolik yuz berdi:', error);
        });
        GetData('unique_id').then((res) => {
            if (res) {
                // console.log(44, JSON.parse(res).user_id);
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

    const phoneInputFun = (values: string) => {
        setPhone(values);
        setPhoneError('');
    };

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#7257FF', '#462eba'], // 0 = 'blue', 1 = 'darkblue'
    });

    const phoneValidateFun = (value: string) => {
        const phoneRegex = /^998\d{9}$/; // +998xxxxxxxxx phone format
        if (value && phoneRegex.test(value)) {
            return true;
        } else {
            return false;
        }
    };

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

    useEffect(() => {

    }, []);


    const updatePhoneFun = async () => {
        if (phone && phoneValidateFun(phone) && token && unique_id && user_id) {
            const postData = {
                "user_id": user_id,
                "unique_id": unique_id,
                "new_phone": '+' + phone
            }
            await StoreData('update_phone', phone)
            await axios.post(API_URL + '/api/auth/request-update-phone', postData, {
                headers: {
                    Authorization: `Bearar ${token}`
                }
            }).then((res) => {
                console.log(129, res.data);

                navigation.navigate('main_phone_update_sms_code');

            }).catch((error) => {
                console.log(error?.response?.data?.message);
                if (error?.response?.data?.message == "This phone number is already registered and active.") {
                    showErrorAlert("Bu telefon raqami allaqachon ro'yxatdan o'tgan va faol.")
                } else {
                    showErrorAlert(error?.response?.data?.message);
                }

            });
        } else {
            if (!phone) {
                setPhoneError('Telefon raqam kiritish shart!');
            } else if (!phoneValidateFun(phone)) {
                setPhoneError('Telefon raqam nato\'g\'ri kiritildi!');
            } else {
                setPhoneError('');
            }
        }
    }



    return (
        <View style={styles.container}>
            <View style={styles.header_con}>
                <View style={{
                    width: '6%'
                }}>
                    <Icon onPress={() => navigation.navigate('profile')} name="angle-left" size={30} color="#7257FF" />
                </View>
                <Text style={styles.text}>
                    Assosiy telefon raqamni almashtrish
                </Text>
            </View>

            <View style={styles.container_main}>
                <View>
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>Telefon raqam</Text>
                    <TextInput
                        style={!phoneIsFocused ? styles.input : styles.inputFocus}
                        keyboardType={'numeric'}
                        placeholderTextColor="#898D8F"
                        value={phone}
                        onChangeText={phoneInputFun}
                        placeholder="+998 __  ___  __  __"
                        onFocus={() => setPhoneIsFocused(true)}
                        onBlur={() => setPhoneIsFocused(false)}
                    />
                    {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : <Text style={{ color: '#6E7375', marginTop: 6, lineHeight: 14 }}>Ushbu raqamga SMS kod yuboriladi</Text>}
                </View>

                {!keyboardVisible && <View style={{
                    position: 'static',
                    bottom: 0,
                    left: 0,
                    right: 0
                }}>
                    <TouchableOpacity
                        // style={isPressed ? styles.inbutton : styles.button}
                        onPressIn={() => handlePressIn()}
                        onPressOut={() => handlePressOut()}
                        activeOpacity={1}
                        onPress={updatePhoneFun}
                    >
                        <Animated.View style={[styles.button, { backgroundColor }]}>
                            <Text

                                style={styles.button_text}>
                                Davom etish
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>}
            </View>

        </View>
    );
};

export default MainPhoneUpdate;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 10,
        position: 'relative',
    },
    container_main: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 50
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