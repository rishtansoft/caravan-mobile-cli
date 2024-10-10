import React from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, Text, Button, Animated } from 'react-native';

interface HomeProps {

}

const Home: React.FC<HomeProps> = () => {
    return (
        <View style={styles.container}>
            <Text style={{
                color: '#000'
            }}>Home</Text>
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



export default Home;