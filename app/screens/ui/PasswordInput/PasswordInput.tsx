import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface Props {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
}

const PasswordInput: React.FC<Props> = ({ value, onChangeText, placeholder }) => {
    const [passwordReqIsFocused, setPasswordReqIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={[!passwordReqIsFocused ? styles.input : styles.inputFocus]}
                placeholderTextColor="#898D8F"
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                onFocus={() => setPasswordReqIsFocused(true)}
                onBlur={() => setPasswordReqIsFocused(false)}
                secureTextEntry={!showPassword}
            />
            <TouchableOpacity
                style={styles.eyeIcon}
                onPress={togglePasswordVisibility}
            >
                <Icon
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="#898D8F"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
    },
    input: {
        borderColor: '#E6E9EB',
        width: '100%',
        borderWidth: 1,
        color: '#131214',
        borderRadius: 8,
        zIndex: 99,
        paddingLeft: 15,
        paddingRight: 45, // Add right padding for the icon
    },
    inputFocus: {
        borderColor: '#7257FF',
        width: '100%',
        borderWidth: 2,
        zIndex: 99,
        color: '#131214',
        borderRadius: 8,
        paddingLeft: 15,
        paddingRight: 45, // Add right padding for the icon
        shadowColor: '#7257FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 1,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{ translateY: -10 }],
        zIndex: 100,
    },
});

export default PasswordInput;