import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Navbar from '../../screens/owner/Navbar';
import { RootStackParamList } from '../../screens/owner/RouterType';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/owner/HomeScreen';
import OwnerProfile from '../../screens/owner/OwnerProfile';
import ActiveOrders from '../../screens/owner/ActiveOrders';
import PastOrders from '../../screens/owner/PastOrders';
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Import navigation hook
import ContactAdmin from '../../screens/owner/ContactAdmin';
import ActiveOrderDetail from '../../screens/owner/ActiveOrderDetail';
import PastOrderDetail from '../../screens/owner/PastOrderDetail';
import TermsAndCondition from '../../screens/owner/TermsAndCondition';

const Stack = createNativeStackNavigator<RootStackParamList>();


const OwnerNavigation = () => {
    const [activeTab, setActiveTab] = useState('home');

    const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Specify navigation type

    // Function to navigate based on active tab
    const handleTabChange = (tab: keyof RootStackParamList) => {
        setActiveTab(tab);
        navigation.navigate(tab); // Use correct tab type
    };

    return (
        < >
            <Stack.Navigator initialRouteName='home'>
                <Stack.Screen
                    name="home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="active_loads"
                    component={ActiveOrders}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="active_loads_detail"
                    component={ActiveOrderDetail}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='history'
                    component={PastOrders}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='history_detail'
                    component={PastOrderDetail}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='profile'
                    component={OwnerProfile}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="contact_admin"
                    component={ContactAdmin}

                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='terms_condition'
                    component={TermsAndCondition}

                />

            </Stack.Navigator>
            <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#F4F6F7'
    },

});
export default OwnerNavigation;