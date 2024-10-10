import React from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, Text, Button, Animated } from 'react-native';

interface RegisterProps {

}

const Register: React.FC<RegisterProps> = () => {
    return (
        <View style={styles.container}>
            <Text style={{
                color: '#000'
            }}>Ro'yxatdan o'tish</Text>
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

});

export default Register;