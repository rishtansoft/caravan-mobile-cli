import React, { useState, useRef, useEffect } from 'react';
import {
    View, StyleSheet, TextInput, FlatList,
    TouchableOpacity, Text, Button, Animated,
    NativeSyntheticEvent, TextInputKeyPressEventData
} from 'react-native';
import { SmsPagePasswordProps } from '../RouterTypes';
import Icon from 'react-native-vector-icons/FontAwesome';

const SmsPage: React.FC<SmsPagePasswordProps> = ({ navigation }) => {
    const [code, setCode] = useState<string[]>(['', '', '', '']);
    const inputs = useRef<Array<TextInput | null>>([]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [counter, setCounter] = useState<number>(60);

    useEffect(() => {
        if (counter > 0) {
            const timer = setTimeout(() => {
                setCounter(counter - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [counter]);

    useEffect(() => {
        if (code.every(digit => digit !== '')) {
            navigation.navigate('PasswordCheng');
        }
    }, [code, navigation]);

    const resetTimer = () => {
        setCounter(60); // Reset counter to 60
    };


    const handleChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text.length === 1 && index < 3) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        if (event.nativeEvent.key === 'Backspace' && index > 0 && code[index] === '') {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleFocus = (index: number) => {
        setFocusedIndex(index);

    };

    const handleBlur = () => {
        setFocusedIndex(null);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header_con}>
                <View style={{
                    width: '6%'
                }}>
                    <Icon onPress={() => navigation.navigate('Login')} name="angle-left" size={30} color="#7257FF" />
                </View>

            </View>
            <Text style={styles.text_1}>SMS kodni kiriting</Text>
            <Text style={styles.text_2}>+998 99 842 7979</Text>
            <Text style={styles.text_2}>raqamiga kodni SMS tarzda yubordik</Text>

            <View style={styles.inputContener}>
                <View style={styles.inputForm}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            style={[
                                styles.input,
                                focusedIndex === index && styles.inputFocused
                            ]}
                            value={digit}
                            onChangeText={(text) => handleChange(text, index)}
                            onKeyPress={(event) => handleKeyPress(event, index)}
                            onFocus={() => handleFocus(index)}
                            onBlur={handleBlur}
                            keyboardType="numeric"
                            maxLength={1}
                            ref={(ref) => (inputs.current[index] = ref)}
                        />
                    ))}
                </View>
            </View>

            <View>
                <Text
                    disabled={counter == 0 ? false : true}
                    onPress={() => {
                        if (counter == 0) {
                            resetTimer()
                        }
                    }}
                    style={counter == 0 ? styles.text_3_2 : styles.text_3}
                >Kodni qayta yuborish {counter == 0 ? null : <Text >({counter}s)</Text>} </Text>
            </View>


        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 15,
        position: 'relative'
    },
    inputContener: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 25,
        marginBottom: 25
    },
    header_con: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

    },
    input: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 25,
        textAlign: 'center',
        fontSize: 20,
        color: '#000'
    },
    inputFocused: {
        shadowColor: "#7257FF",
        shadowOffset: {
            width: 0,
            height: 2,
        },

        color: '#131214',
        borderWidth: 3,
        borderColor: '#7257FF',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 6, // Android uchun
    },
    inputForm: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '70%',
    },
    text_1: {
        color: '#131214',
        textAlign: 'center',
        fontSize: 32,
        fontWeight: '700',
        marginTop: 40
    },
    text_2: {
        color: '#898D8F',
        textAlign: 'center',
        fontSize: 18,
        marginTop: 10
    },
    text_3: {
        color: '#898D8F',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',

    },

    text_3_2: {
        color: '#7257FF',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600'
    }


});



export default SmsPage;
