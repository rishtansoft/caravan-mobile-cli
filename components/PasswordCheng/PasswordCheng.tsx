import React from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, Text, Button, Animated } from 'react-native';

interface PasswordChengProps {

}

const PasswordCheng: React.FC<PasswordChengProps> = () => {
    return (
        <View style={styles.container}>
            <Text style={{
                color: '#000'
            }}>Paro'lni untdizmi</Text>
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

export default PasswordCheng;