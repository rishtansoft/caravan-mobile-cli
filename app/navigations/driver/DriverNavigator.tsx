import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Keyboard } from 'react-native';

import { RootStackParamList } from '../../screens/driver/RouterType';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Import navigation hook
import HomeScreen from '../../screens/driver/HomeScreen';
import TarihScreen from '../../screens/driver/LoadHistory';
import AdminScreen from '../../screens/driver/ContactAdmin';
import ProfileScreen from '../../screens/driver/DriverProfile';
import DetailScreen from '../../screens/driver/ActiveLoadDetail';
import TermsAndCondition from '../../screens/driver/TermsAndCondition';
import DriverProfileEdit from '../../screens/driver/DriverProfileEdit';
import ActiveLoadDetailMap from '../../screens/driver/ActiveLoadDetailMap';
import LoadHistoryDetails from '../../screens/driver/LoadHistoryDetails';
import GetLoadNavigator from '../../screens/driver/GetLoadNavigator';
import Navbar from '../../screens/driver/Navbar';
import MainPhoneUpdate from '../../screens/driver/MainPhoneUpdate';
import MainPhoneUpdateSmcCode from '../../screens/driver/MainPhoneUpdateSmcCode';
import LoadHistoryDeailsMap from '../../screens/driver/LoadHistoryDeailsMap';
import { useSocketLoadListener } from '../../screens/ui/Socket/Socket';
import SocketService from '../../screens/ui/Socket/index';


const Stack = createNativeStackNavigator<RootStackParamList>();
interface componentNameProps {
    page: string | undefined,
}

const DriverNavigator: React.FC<componentNameProps> = ({ page }) => {
    const [activeTab, setActiveTab] = useState('active_loads');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const { newLoad, isConnected, acceptLoad, rejectLoad } = useSocketLoadListener();
    const socketService = SocketService.getInstance();
    socketService.showNotification()

    useEffect(() => {
        if (page) {
            setActiveTab(page)

        }
    }, [page]);


    const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Specify navigation type

    // Function to navigate based on active tab
    const handleTabChange = (tab: keyof RootStackParamList) => {
        if (
            tab == 'active_loads' || tab == 'contact_admin'
            || tab == 'history' || tab == 'profile'
        ) {
            navigation.navigate(tab); // Use correct tab type
        }
        setActiveTab(tab);
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true); // Klaviatura ochilganda true ga o'zgartirish
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false); // Klaviatura yopilganda false ga o'zgartirish
        });
        return () => {
            // Listenerlarni tozalash
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <>
            <Stack.Navigator initialRouteName='active_loads'>
                <Stack.Screen
                    name='active_loads'
                    component={HomeScreen}
                    options={{ headerShown: false }}

                />
                <Stack.Screen
                    name='active_loads_detail'
                    component={DetailScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='active_loads_map'
                    component={ActiveLoadDetailMap}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='active_loads_map_appointed'
                    component={GetLoadNavigator}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name='history'
                    component={TarihScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='history_detail'
                    component={LoadHistoryDetails}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='history_detail_map'
                    component={LoadHistoryDeailsMap}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='contact_admin'
                    component={AdminScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='profile'
                    component={ProfileScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="main_phone_update"
                    component={MainPhoneUpdate}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='main_phone_update_sms_code'
                    component={MainPhoneUpdateSmcCode}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='profile_update'
                    component={DriverProfileEdit}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='terms_condition'
                    component={TermsAndCondition}
                    options={{ headerShown: false }}
                />

            </Stack.Navigator>
            {(!keyboardVisible &&
                page != 'active_loads_map'
                && page != 'main_phone_update_sms_code'
            ) && <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />}
        </>
    );
};

export default DriverNavigator;
