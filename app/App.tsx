import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import PasswordCheng from '../components/PasswordCheng/PasswordCheng';
import Home from '../components/Home/Home';
import SmsPage from '../components/sms/SmsPage';
import RegisterSecond from '../components/RegisterSecond/RegisterSecond';

import {
    RootStackParamList,
} from '../components/RouterTypes';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator<RootStackParamList>();



const App = () => {
    return (
        <View style={styles.container_div}>
            <NavigationContainer >
                <Stack.Navigator initialRouteName="RegisterSecond">
                    <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
                    <Stack.Screen options={{ headerShown: false }} name="Smspagepassword" component={SmsPage} />
                    <Stack.Screen options={{ headerShown: false }} name="PasswordCheng" component={PasswordCheng} />
                    <Stack.Screen options={{ headerShown: false }} name="Register" component={Register} />
                    <Stack.Screen options={{ headerShown: false }} name="RegisterSecond" component={RegisterSecond} />
                    <Stack.Screen options={{ headerShown: false }} name="Home" component={Home} />
                </Stack.Navigator>
            </NavigationContainer>

        </View>
    );
}

const styles = StyleSheet.create({
    container_div: {
        flex: 1,
        backgroundColor: '#ffffff',
    },


})

export default App;
