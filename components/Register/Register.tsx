import React, { useState, useRef } from 'react';
import {
    SafeAreaView, View,
    StyleSheet, TextInput,
    FlatList, TouchableOpacity,
    Text, Button, Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RegisterProps } from '../RouterTypes';


// interface RegisterProps {

// }

const Register: React.FC<RegisterProps> = ({ navigation }) => {
    const [phone, setPhone] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');
    const [phoneIsFocused, setPhoneIsFocused] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const [nameIsFocused, setNameIsFocused] = useState<boolean>(false);

    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [passwordIsFocused, setPasswordIsFocused] = useState<boolean>(false);

    const [passwordReq, setPasswordReq] = useState<string>('');
    const [passwordReqError, setPasswordReqError] = useState<string>('');
    const [passwordReqIsFocused, setPasswordReqIsFocused] = useState<boolean>(false);

    const phoneInputFun = (values: string) => {
        setPhone(values)
    }

    const nameInputFun = (values: string) => {
        setName(values)
    }

    const PasswordInputFun = (values: string) => {
        setPassword(values)
    }

    const items = [
        { id: '1', text: "Parol 8 ta belgidan kam bo'lmasligi kerak" },
        { id: '2', text: "Kamida bitta katta xarf" },
        { id: '3', text: "Kamida bitta belgi" },
    ];

    // Har bir element uchun ko'rinish
    const renderItem = ({ item, index }) => (
        <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.itemText}>{item.text}</Text>
        </View>
    );


    return (
        <View style={styles.container}>
            <View style={styles.header_con}>
                <View style={{
                    width: '6%'
                }}>
                    <Icon onPress={() => navigation.navigate('Login')} name="angle-left" size={30} color="#7257FF" />
                </View>
                <Text style={styles.text}>
                    Ro'yxatdan o'tish
                </Text>
            </View>
            <SafeAreaView>
                <View>
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>Telefon raqam</Text>
                    <TextInput
                        style={!phoneIsFocused ? styles.input : styles.inputFocus}
                        keyboardType={"numeric"}
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
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>Ism Familya</Text>
                    <TextInput
                        style={!nameIsFocused ? styles.input : styles.inputFocus}
                        placeholderTextColor="#898D8F"
                        value={name}
                        onChangeText={nameInputFun}
                        placeholder="To'liq ismingizni kiriting"
                        onFocus={() => setNameIsFocused(true)}
                        onBlur={() => setNameIsFocused(false)}
                    />
                    {nameError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
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
                    {passwordError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
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
                    <Text style={{ marginBottom: 5, color: '#131214', fontSize: 18, fontWeight: 600 }}>Parol</Text>
                    <TextInput
                        style={!passwordReqIsFocused ? styles.input : styles.inputFocus}
                        placeholderTextColor="#898D8F"
                        value={password}
                        onChangeText={PasswordInputFun}
                        placeholder="Parolni kiriting"
                        onFocus={() => setPasswordIsFocused(true)}
                        onBlur={() => setPasswordIsFocused(false)}
                        secureTextEntry={true}
                    />
                    {passwordError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                </View>

            </SafeAreaView>



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
        width: '90%'
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
        lineHeight: 14
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


});

export default Register;