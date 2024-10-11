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
import { PasswordChengProps } from '../RouterTypes';

// interface PasswordChengProps {

// }

interface ListItem {
    text: string;
}

const PasswordCheng: React.FC<PasswordChengProps> = ({ navigation }) => {
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [passwordIsFocused, setPasswordIsFocused] = useState<boolean>(false);

    const [passwordReq, setPasswordReq] = useState<string>('');
    const [passwordReqError, setPasswordReqError] = useState<string>('');
    const [passwordReqIsFocused, setPasswordReqIsFocused] = useState<boolean>(false);
    const animatedValue = useRef(new Animated.Value(0)).current;

    const PasswordInputFun = (values: string) => {
        setPassword(values)
    }

    const passwordReqInputFun = (values: string) => {
        setPasswordReq(values)
    }

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

    return (
        <View style={styles.container}>
            <View style={styles.header_con}>
                <View style={{
                    width: '6%'
                }}>
                    <Icon onPress={() => navigation.navigate('Login')} name="angle-left" size={30} color="#7257FF" />
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
                            // onPress={loginBtn} 
                            style={styles.button_text}>
                            Kirish
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

export default PasswordCheng;