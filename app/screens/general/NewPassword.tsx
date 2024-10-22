import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet, TextInput,
    FlatList, TouchableOpacity,
    Text, Animated,
    Keyboard,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NewPasswordProps } from './RouterType';

import axios from 'axios';
import { API_URL } from '@env';
import { GetData, StoreData } from '../AsyncStorage/AsyncStorage';
const showErrorAlert = (message: string) => {
    Alert.alert('Xatolik', message, [{ text: 'OK', onPress: () => console.log('OK bosildi') }]);
};
interface ListItem {
    text: string;
}

const NewPassword: React.FC<NewPasswordProps> = (
    { navigation }
) => {
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [passwordIsFocused, setPasswordIsFocused] = useState<boolean>(false);

    const [passwordReq, setPasswordReq] = useState<string>('');
    const [passwordReqError, setPasswordReqError] = useState<string>('');
    const [passwordReqIsFocused, setPasswordReqIsFocused] = useState<boolean>(false);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [user_id, setUser_id] = useState<string>('');

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        GetData('user_id_passwor').then((res) => {
            if (res) {
                setUser_id(res)
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



    const PasswordInputFun = (values: string) => {
        setPassword(values);
        setPasswordError('');

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
        { id: '2', text: "Kamida bitta katta xarf" },
        { id: '3', text: "Kamida bitta belgi" },
    ];

    // Har bir element uchun ko'rinish
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

    const savePaswordFun = () => {
        if (password && passwordReq &&
            validatePassword(password) &&
            password === passwordReq) {
            axios.post(API_URL + '/api/auth/reset-password', {
                "user_id": user_id,
                "confirm_password": password,
                "new_password": passwordReq
            }).then((res) => {
                console.log(127, res.data);

                navigation.navigate('login');
            }).catch((error) => {
                showErrorAlert(error?.response?.data?.message);
                console.log(error?.response?.data?.message);
            })


        } else {
            if (!password) {
                setPasswordError('Parol kiritish shart');
            } else if (!validatePassword(password)) {
                setPasswordError('Parolni berilgan shartlar bo\'yicha bo\'lish shart');
            } else {
                setPasswordError('');
            }

            if (!passwordReq) {
                setPasswordReqError('Parolni takrolash shart');
            } else if (password !== passwordReq) {
                setPasswordReqError('Parolga mos bo\'lishi kerak');
            } else {
                setPasswordReqError('');
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header_con}>
                <View style={{
                    width: '6%'
                }}>
                    <Icon
                        onPress={() => navigation.navigate('login')}
                        name="angle-left" size={30} color="#7257FF" />
                </View>
                <Text style={styles.text}>
                    Yangi parol qo'yish
                </Text>
            </View>
            <View>
                <View style={{ marginTop: 18 }}>
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>Yangi parol</Text>
                    <TextInput
                        style={!passwordIsFocused ? styles.input : styles.inputFocus}
                        placeholderTextColor="#898D8F"
                        value={password}
                        onChangeText={PasswordInputFun}
                        placeholder="Yangi parolni kiriting"
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
                        onPress={savePaswordFun}
                    >
                        <Animated.View style={[styles.button, { backgroundColor }]}>
                            <Text

                                style={styles.button_text}>
                                Kirish
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
        height: '100%',
        position: 'relative'
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

    header_con: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

    },
    errorText: {
        color: 'red',
        marginTop: 6,
        lineHeight: 14
    },
    flatList: {
        marginLeft: 8,
    },
    text: {
        color: '#131214',
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 100,
        width: '90%',
        fontWeight: '600'

    },

    bullet: {
        fontSize: 20,
        lineHeight: 21,
        marginRight: 8,
        fontWeight: '600',
        color: '#008557',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 1,
    },
    itemText: {
        fontSize: 16,
        lineHeight: 21,
        color: '#008557',
        flex: 1,
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

});

export default NewPassword;