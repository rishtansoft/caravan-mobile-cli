import React, { useState, useRef, useEffect } from 'react';
import {
    View, StyleSheet,
    TextInput,
    TouchableOpacity, Text,
    Animated,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { LoginProps } from './RouterType';
import { API_URL } from '@env';
import { StoreData, GetData, } from '../AsyncStorage/AsyncStorage';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/UserData';

// interface LoginProps {
//     // navigation: LoginScreenNavigationProp;
// }

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
                "phone": isPhone ? '+' + value : value,
                "password": valuePasword
            }).then((res) => {
                dispatch(setCredentials({
                    token: res.data.token,
                    role: res.data.role,
                    user_id: res.data.user_id
                }));
                // login(res.data.token, res.data.role);
                StoreData('user_id', res.data.user_id);
                StoreData('token', res.data.token);
                StoreData('role', res.data.role);
                StoreData('inlogin', 'true');
                // navigation.navigate("Home");
                // setValue('');
                // setValuePasword('');
            }).catch((error) => {
                // console.log(125, isPhone ? '+' + value : value);
                // console.log(126, valuePasword);

                console.log(error.response.data.message);

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
        if (value && phoneRegex.test(value)) {
            navigation.navigate('forgot_sms_pagepassword');
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
                        //  onPress={() => navigation.navigate('Home')}
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
                    <TextInput
                        style={!isFocusedPasword ? styles.input : styles.inputFocus}
                        value={valuePasword}
                        secureTextEntry={true}
                        placeholderTextColor="#898D8F"
                        onChangeText={onPasswordFun}
                        placeholder="Parol kiriting"
                        onFocus={() => setIsFocusedPasword(true)}  // Focus bo'lganda
                        onBlur={() => setIsFocusedPasword(false)}   // Focusdan chiqqanda
                    />
                    {errorMessagePassword ? <Text style={styles.errorText}>{errorMessagePassword}</Text> : null}

                </View>

                <View style={{
                    marginTop: 15
                }}>
                    <Text onPress={passwordChangFun} style={{ marginBottom: 5, color: '#7257FF', fontSize: 18, fontWeight: 600 }}>Parolni unutdingizmi?</Text>
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18 }}>Akkountingiz yo'qmi?  <Text
                        onPress={() => navigation.navigate('register')}
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

                    >
                        <Animated.View style={[styles.button, { backgroundColor }]}>
                            <Text onPress={loginBtn} style={styles.button_text}>Kirish</Text>
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