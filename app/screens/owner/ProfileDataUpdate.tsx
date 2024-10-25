import React, { useState, useEffect, useRef } from 'react';
import {
    Text, Alert,
    View, StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    TextInput,
    Keyboard
} from 'react-native';
import { ProfileDataUpdateProps } from './RouterType';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { GetData } from '../AsyncStorage/AsyncStorage';
import { API_URL } from '@env';
import CustomDatePicker from '../ui/DatePIker/DatePIker';

const showErrorAlert = (message: string) => {
    Alert.alert('Xatolik', message, [{ text: 'OK', onPress: () => console.log('OK bosildi') }]);
};

const ProfileDataUpdate: React.FC<ProfileDataUpdateProps> = ({ navigation }) => {

    const [name, setName] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const [nameIsFocused, setNameIsFocused] = useState<boolean>(false);
    const [nameLastname, setNameLastname] = useState<string>('');
    const [nameLastnameError, setNameLastnameError] = useState<string>('');
    const [nameLastnameIsFocused, setNameLastnameIsFocused] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [passwordIsFocused, setPasswordIsFocused] = useState<boolean>(false);
    const [passwordReq, setPasswordReq] = useState<string>('');
    const [passwordReqError, setPasswordReqError] = useState<string>('');
    const [passwordReqIsFocused, setPasswordReqIsFocused] = useState<boolean>(false);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [phoneSecond, setPhoneSecond] = useState<string>('');
    const [phoneSecondError, setPhoneSecondError] = useState<string>('');
    const [phoneSecondIsFocused, setPhoneSecondIsFocused] = useState<boolean>(false);
    const [date, setDate] = useState<Date | null>();
    const [dateError, setDateError] = useState<string>('');
    const [dateValue, setDateValue] = useState<string>('');
    const [user_id, setUser_id] = useState<string>('');
    const [token, setToken] = useState<string>('');
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
        GetData('token').then((res) => {
            if (res) {
                setToken(res)
            }
        }).catch((error) => {
            console.error('Xatolik yuz berdi:', error);
        });
    }, []);

    useEffect(() => {

        if (user_id && token) {
            axios.get(API_URL + `/api/auth/get-profile?user_id=${user_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                console.log(73, res.data);
                setName(res.data.firstname)
                setNameLastname(res.data.lastname)
                if (res.data?.birthday) {
                    setDateValue(res.data.birthday)
                }
            }).catch((error) => {
                console.log(76, error);

                showErrorAlert(error?.response?.data?.message)
            })
        }

    }, [user_id, token]);

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
    const nameInputFun = (values: string) => {
        setName(values);
        setNameError('');
    };
    const nameLastnameInputFun = (values: string) => {
        setNameLastname(values);
        setNameLastnameError('');
    };
    const PasswordInputFun = (values: string) => {
        setPassword(values);
        setPasswordError('');
    };
    const passwordReqInputFun = (values: string) => {
        if (password === values) {
            setPasswordReq(values);
            setPasswordReqError('');
        } else {
            setPasswordReq(values);
            setPasswordReqError("Parolga mos bo'lishi kerak");
        }
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
    const validatePassword = (password: string) => {
        const minLength = 8;
        const capitalLetterPattern = /[A-Z]/;
        const specialCharacterPattern = /[^A-Za-z0-9]/;
        if (password.length < minLength) {
            return false;
        }
        if (!capitalLetterPattern.test(password)) {
            return false;
        }
        if (!specialCharacterPattern.test(password)) {
            return false;
        }
        return true; // If the password meets all criteria
    };
    const phoneSecondInputFun = (values: string) => {
        setPhoneSecond(values);
        setPhoneSecondError('');
    };
    const handleDateChange = (date: Date) => {
        setDate(date);
        setDateError('');
    };

    return (
        <View style={styles.container_all}>
            <View style={styles.header_con}>
                <View style={{
                    width: '6%'
                }}>
                    <Icon
                        onPress={() => navigation.navigate('profile')}
                        name="angle-left" size={30} color="#7257FF" />
                </View>
                <Text style={styles.title}>
                    Shaxsiy ma'lumotlar
                </Text>
            </View>
            <ScrollView style={styles.container}>
                <View style={{ marginTop: 18 }}>
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>Ism</Text>
                    <TextInput
                        style={!nameIsFocused ? styles.input : styles.inputFocus}
                        placeholderTextColor="#898D8F"
                        value={name}
                        onChangeText={nameInputFun}
                        placeholder="Ismingizni kiriting"
                        onFocus={() => setNameIsFocused(true)}
                        onBlur={() => setNameIsFocused(false)}
                    />
                    {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                </View>
                <View style={{ marginTop: 18 }}>
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>Familya</Text>
                    <TextInput
                        style={!nameLastnameIsFocused ? styles.input : styles.inputFocus}
                        placeholderTextColor="#898D8F"
                        value={nameLastname}
                        onChangeText={nameLastnameInputFun}
                        placeholder="Familyangizni kiriting"
                        onFocus={() => setNameLastnameIsFocused(true)}
                        onBlur={() => setNameLastnameIsFocused(false)}
                    />
                    {nameLastnameError ? <Text style={styles.errorText}>{nameLastnameError}</Text> : null}
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
                    <CustomDatePicker value={dateValue} onDateChange={handleDateChange}></CustomDatePicker>
                    {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
                </View>


                <View style={{ marginTop: 18 }}>
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>Parol</Text>
                    <TextInput
                        style={!passwordIsFocused ? styles.input : styles.inputFocus}
                        placeholderTextColor="#898D8F"
                        value={password}
                        onChangeText={PasswordInputFun}
                        placeholder="Parolni kiriting"
                        onFocus={() => setPasswordIsFocused(true)}
                        onBlur={() => setPasswordIsFocused(false)}
                        secureTextEntry={true}
                    />
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>

                <View style={{ marginTop: 18 }}>
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>Parolni takrorlang</Text>
                    <TextInput
                        style={!passwordReqIsFocused ? styles.input : styles.inputFocus}
                        placeholderTextColor="#898D8F"
                        value={passwordReq}
                        onChangeText={passwordReqInputFun}
                        placeholder="Parolni takrorlang"
                        onFocus={() => setPasswordReqIsFocused(true)}
                        onBlur={() => setPasswordReqIsFocused(false)}
                        secureTextEntry={true}
                    />
                    {passwordReqError ? <Text style={styles.errorText}>{passwordReqError}</Text> : null}
                </View>
                <View>
                    <TouchableOpacity
                        // style={isPressed styles.inbutton : styles.button}
                        onPressIn={() => handlePressIn()}
                        onPressOut={() => handlePressOut()}
                        activeOpacity={1}
                    // onPress={saveData}
                    >
                        <Animated.View style={[styles.button, { backgroundColor }]}>
                            <Text

                                style={styles.button_text}>
                                Ro'yxatdan o'tish
                            </Text>
                        </Animated.View>

                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{ marginTop: 20 }}></View>
        </View>
    );
};

export default ProfileDataUpdate;

const styles = StyleSheet.create({
    container_all: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        overflow: 'scroll'
    },
    container: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 30,
        flex: 1,
    },
    header_con: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        paddingLeft: 15
    },
    title: {
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
    span_teg: {
        color: '#C1C4C6',
        fontWeight: '500',
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
        marginVertical: 60
    },
    button_text: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
        width: '100%',
    },
});
