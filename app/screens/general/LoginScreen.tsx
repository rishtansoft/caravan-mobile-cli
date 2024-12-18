import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity, Text,
    Animated,
    Keyboard,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { LoginProps } from './RouterType';
import { API_URL } from '@env';
import { StoreData, GetData, } from '../AsyncStorage/AsyncStorage';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/UserData';
import PasswordInput from '../ui/PasswordInput/PasswordInput';

// interface LoginProps {
//     // navigation: LoginScreenNavigationProp;
// }

const showErrorAlert = (message: string) => {
    Alert.alert('Xatolik', message, [{ text: 'OK', onPress: () => console.log('OK bosildi') }]);
};

const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {
    const [value, setValue] = useState('');
    const [isFocusedValue, setIsFocusedValue] = useState(false);
    const [valuePasword, setValuePasword] = useState('');
    const [isFocusedPasword, setIsFocusedPasword] = useState(false);
    const [isPhone, setIsPhone] = useState<boolean>(false);
    // const [isPressed, setIsPressed] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessagePassword, setErrorMessagePassword] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const dispatch = useDispatch();



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



    const validateInput = (values: string) => {
        setIsPhone(false);
        if (values.length > 0) {
            setValue(values);
            setErrorMessage('');
        } else {
            setValue(values);
            setErrorMessage('Maydoni to\'ldirish shart');
        }

    };

    const validateInputFun = (innervalue: string) => {
        if (innervalue) {
            const idRegex = /^[0-9]{6}$/; // 6 digit ID
            const phoneRegex = /^998\d{9}$/; // +998xxxxxxxxx phone format
            if (idRegex.test(innervalue)) {
                setIsPhone(false)
                return true;
            } else if (phoneRegex.test(innervalue)) {
                setIsPhone(true)
                return true;
            } else {
                return false;
            }
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

    const onPasswordFun = (values: string) => {
        if (values.length > 0) {
            setValuePasword(values);
            setErrorMessagePassword('');
        } else {
            setValuePasword(values);
            setErrorMessagePassword("Maydoni to'ldirish shart");
        }
    };

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#7257FF', '#462eba'], // 0 = 'blue', 1 = 'darkblue'
    });

    const loginBtn = async () => {
        const valueFilter = validateInputFun(value);

        if (value && valuePasword && valueFilter) {

            await axios.post(API_URL + '/api/auth/login', {
                "unique_id": value.length == 6 ? value : '',
                "phone": value.length == 12 ? '+' + value : '',
                "password": valuePasword
            }).then((res) => {
                dispatch(setCredentials({
                    token: res.data.token,
                    role: res.data.role,
                    user_id: res.data.user_id
                }));
                StoreData('user_id', res.data.user_id);
                StoreData('token', res.data.token);
                StoreData('role', res.data.role);
                StoreData('inlogin', 'true');
                StoreData('unique_id', res.data.unique_id);
                setValue('')
                setValuePasword('')
                setErrorMessage('')
                setErrorMessagePassword('')
            }).catch((error) => {
                console.log(error?.response?.data?.message);
                if (error?.response?.data?.message == 'User not found') {
                    showErrorAlert('Foydalanuvchi topilmadi')
                } else if (error?.response?.data?.message == 'Invalid password') {
                    showErrorAlert("Parolni noto'g'ri kiritdingiz. Tekshirib, qaytadan kiring")
                } else {
                    showErrorAlert(error?.response?.data?.message)
                }
            })

        } else {
            if (!value) {
                setErrorMessage("Maydoni to'ldirish shart");
            } else {
                setErrorMessage('');
            }

            if (!valuePasword) {
                setErrorMessagePassword("Maydoni to'ldirish shart");
            } else {
                setErrorMessagePassword('');
            }

            if (!valueFilter) {
                setErrorMessage('ID yoki telefon raqam kiring');
            } else {
                setErrorMessage('');
            }
        }
    }

    const passwordChangFun = () => {
        const phoneRegex = /^998\d{9}$/; // +998xxxxxxxxx phone format
        setErrorMessagePassword('');
        if (value && phoneRegex.test(value)) {
            axios.post(API_URL + '/api/auth/forgot-password', {
                phone: '+' + value
            }).then((res) => {
                console.log(res.data);
                setValue('')
                setValuePasword('')
                setErrorMessage('')
                setErrorMessagePassword('')
                StoreData("user_phone", value)
                navigation.navigate('forgot_sms_pagepassword');
            }).catch((error) => {
                if (error?.response?.data?.message == 'User with this phone number not found') {
                    showErrorAlert("Ushbu telefon raqamga tegishli foydalanuchi topilmadi.")
                } else {
                    showErrorAlert(error?.response?.data?.message)
                }
            })

        } else {
            setErrorMessage('Telefon raqamni kirtish shart');

        }
    };



    return (
        <View style={styles.container}>
            <View style={styles.header_con}>
                <View style={{
                    width: '6%'
                }}>
                    <Icon
                        onPress={() => navigation.navigate('home')}
                        name="angle-left" size={30} color="#7257FF" />
                </View>
                <Text style={styles.text}>
                    Kirish
                </Text>
            </View>
            <View>
                <View>
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>ID yoki telefon raqam</Text>
                    <TextInput
                        style={!isFocusedValue ? styles.input : styles.inputFocus}
                        keyboardType={'numeric'}
                        placeholderTextColor="#898D8F"
                        value={value}
                        onChangeText={validateInput}
                        placeholder="ID yoki telefon raqam"
                        onFocus={() => setIsFocusedValue(true)}  // Focus bo'lganda
                        onBlur={() => setIsFocusedValue(false)}   // Focusdan chiqqanda
                    />
                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                </View>

                <View style={{
                    marginTop: 20
                }}>
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>Parol</Text>
                    <PasswordInput
                        value={valuePasword}
                        onChangeText={onPasswordFun}
                        placeholder="Parol kiriting"
                    />
                    {errorMessagePassword ? <Text style={styles.errorText}>{errorMessagePassword}</Text> : null}

                </View>

                <View style={{
                    marginTop: 15
                }}>
                    <Text onPress={passwordChangFun} style={{ marginBottom: 5, color: '#7257FF', fontSize: 18, fontWeight: 600 }}>Parolni unutdingizmi?</Text>
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18 }}>Akkountingiz yo'qmi?  <Text
                        onPress={() => {
                            setValue('')
                            setValuePasword('')
                            setErrorMessage('')
                            setErrorMessagePassword('')
                            navigation.navigate('register')
                        }}
                        style={{ color: '#7257FF', fontWeight: '600' }}> Ro'yxatdan o'tish</Text></Text>
                </View>

            </View>
            {!keyboardVisible &&
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0
                }}>
                    <TouchableOpacity
                        // style={isPressed ? styles.inbutton : styles.button}
                        onPressIn={() => handlePressIn()}
                        onPressOut={() => handlePressOut()}
                        activeOpacity={1}
                        onPress={loginBtn}

                    >
                        <Animated.View style={[styles.button, { backgroundColor }]}>
                            <Text style={styles.button_text}>Kirish</Text>
                        </Animated.View>

                    </TouchableOpacity>
                </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    header_con: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
        position: 'relative',
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
    text: {
        color: '#131214',
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 100,
        width: '90%',
        fontWeight: '600',

    },
    button: {
        backgroundColor: '#7257FF',
        padding: 9,
        margin: 10,
        borderRadius: 20,
        cursor: 'pointer',
    },
    inbutton: {
        backgroundColor: '#4b36b5',
        padding: 9,
        borderRadius: 20,
        margin: 10,
        cursor: 'pointer',
    },
    button_text: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
        width: '100%',
    },
    errorText: {
        color: 'red',
    },

});


export default LoginScreen;