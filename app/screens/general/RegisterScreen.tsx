import React, { useState, useRef, useEffect } from 'react';
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
import { RegisterProps } from './RouterType';
import axios from 'axios';
import { API_URL } from '@env';
import { StoreData, GetData, } from '../AsyncStorage/AsyncStorage';

interface ListItem {
    text: string;
}

const showErrorAlert = (message: string) => {
    Alert.alert('Xatolik', message, [{ text: 'OK', onPress: () => console.log('OK bosildi') }]);
};


const RegisterScreen: React.FC<RegisterProps> = ({ navigation }) => {
    const [phone, setPhone] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');
    const [phoneIsFocused, setPhoneIsFocused] = useState<boolean>(false);
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



    const phoneInputFun = (values: string) => {
        setPhone(values);
        setPhoneError('');
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

    const items = [
        { id: '1', text: "Parol 8 ta belgidan kam bo'lmasligi kerak" },
        { id: '2', text: 'Kamida bitta katta xarf' },
        { id: '3', text: 'Kamida bitta belgi' },
    ];

    const renderItem = ({ item, index }: { item: ListItem; index: number }) => (
        <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.itemText}>{item.text}</Text>
        </View>
    );

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

    const saveDataFun = async () => {
        if (
            phone && phoneValidateFun(phone)
            && name && !/^\s*$/.test(name) &&
            nameLastname && !/^\s*$/.test(nameLastname) &&
            password && passwordReq &&
            validatePassword(password) &&
            password === passwordReq
        ) {
            const postData = {
                "firstname": name,
                "lastname": nameLastname,
                "phone": '+' + phone,
                "password": password,
                "password_rep": passwordReq
            }
            await StoreData('user_data', JSON.stringify(postData));

            await axios.post(API_URL + '/api/auth/register/initial', postData).then((res) => {
                StoreData('user_id', res.data.user_id);
                navigation.navigate('register_second');

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
            if (!name || /^\s*$/.test(name)) {
                setNameError('Ism kiritish shart');
            } else {
                setNameError('');
            }
            if (!nameLastname || /^\s*$/.test(nameLastname)) {
                setNameLastnameError('Familya kiritish shart');
            } else {
                setNameLastnameError('');
            }
            if (!password) {
                setPasswordError('Parol kiritish shart');
            } else if (!validatePassword(password)) {
                setPasswordError("Parolni berilgan shartlar bo'yicha bo'lish shart");
            } else {
                setPasswordError('');
            }
            if (!passwordReq) {
                setPasswordReqError('Parolni takrolash shart');
            } else if (password !== passwordReq) {
                setPasswordReqError("Parolga mos bo'lishi kerak");
            } else {
                setPasswordReqError('');
            }
        }
    };

    return (

        <View style={styles.container}>
            <View style={styles.header_con}>
                <View style={{
                    width: '6%'
                }}>
                    <Icon onPress={() => navigation.navigate('login')} name="angle-left" size={30} color="#7257FF" />
                </View>
                <Text style={styles.text}>
                    Ro'yxatdan o'tish
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}>
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
                        <View style={{ marginTop: 8 }}>
                            <FlatList
                                data={items}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                                style={styles.flatList}
                            />
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
                        <View style={{
                            marginTop: 13
                        }}>
                            <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18 }}>Akkountingiz bormi?   <Text onPress={() => navigation.navigate('login')} style={{ color: '#7257FF', fontWeight: '600' }}>Kirish</Text></Text>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

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
                >
                    <Animated.View style={[styles.button, { backgroundColor }]}>
                        <Text
                            onPress={saveDataFun}
                            style={styles.button_text}>
                            Davom etish
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
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 10,
        position: 'relative',
        overflow: 'scroll',
        height: 100,

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
    scrollContainer: {
        paddingBottom: 35,
        flexGrow: 1,
    },
    errorText: {
        color: 'red',
        marginTop: 6,
        lineHeight: 14,
    },
    flatList: {
        marginLeft: 8,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 1,
    },
    bullet: {
        fontSize: 20,
        lineHeight: 21,
        marginRight: 8,
        fontWeight: '600',
        color: '#008557',
    },
    itemText: {
        fontSize: 16,
        lineHeight: 21,
        color: '#008557',
        flex: 1,
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
export default RegisterScreen;