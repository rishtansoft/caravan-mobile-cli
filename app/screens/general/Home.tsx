import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { HomeProps } from './RouterType';

const HomeScreen: React.FC<HomeProps> = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
        position: 'relative',

    },
    text: {
        color: '#000',
        fontSize: 22,
    },
});
export default HomeScreen;


