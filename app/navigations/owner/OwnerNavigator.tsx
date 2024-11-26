import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Keyboard } from 'react-native';
import { RootStackParamList } from '../../screens/owner/RouterType';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Import navigation hook


import Navbar from '../../screens/owner/Navbar';
import HomeScreen from '../../screens/owner/HomeScreen';
import OwnerProfile from '../../screens/owner/OwnerProfile';
import ActiveOrders from '../../screens/owner/ActiveOrders';
import PastOrders from '../../screens/owner/PastOrders';
import ContactAdmin from '../../screens/owner/ContactAdmin';
import ActiveOrderDetail from '../../screens/owner/ActiveOrderDetail';
import PastOrderDetail from '../../screens/owner/PastOrderDetail';
import TermsAndCondition from '../../screens/owner/TermsAndCondition';
import ProfileDataUpdate from '../../screens/owner/ProfileDataUpdate';
import ActiveOrderMap from '../../screens/owner/ActiveOrderMap';
import AddLoad from '../../screens/owner/AddLoad';
import AddLoadSecond from '../../screens/owner/AddLoadSecond';
import AddLoadThird from '../../screens/owner/AddLoadThird';
import MainPhoneUpdate from '../../screens/owner/MainPhoneUpdate';
import MainPhoneUpdateSmcCode from '../../screens/owner/MainPhoneUpdateSmcCode';
import PastOrderDetailMap from '../../screens/owner/PastOrderDetailMap';
import ActiveLoadCarLoaction from '../../screens/owner/ActiveLoadCarLoaction';
const Stack = createNativeStackNavigator<RootStackParamList>();
interface componentNameProps {
    page: string | undefined,
}

const OwnerNavigation: React.FC<componentNameProps> = ({ page }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [keyboardVisible, setKeyboardVisible] = useState(false);


    useEffect(() => {
        if (page) {
            setActiveTab(page)
        }
    }, [page]);

    const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Specify navigation type

    // Function to navigate based on active tab
    const handleTabChange = (tab: keyof RootStackParamList) => {
        if (
            tab == 'active_loads' || tab == 'home'
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
        < >
            <Stack.Navigator initialRouteName='home'>
                <Stack.Screen
                    name="home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='add_loads'
                    component={AddLoad}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='add_load_second'
                    component={AddLoadSecond}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='add_load_third'
                    component={AddLoadThird}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="active_loads"
                    component={ActiveOrders}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="active_loads_car_map"
                    component={ActiveLoadCarLoaction}
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
                    name='history_detail_map'
                    component={PastOrderDetailMap}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='profile_update'
                    component={ProfileDataUpdate}
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
                    name='profile'
                    component={OwnerProfile}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='active_loads_map'
                    component={ActiveOrderMap}
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
            {(!keyboardVisible && page !== 'add_loads' && page !== 'add_load_second' &&
                page !== 'add_load_third' &&
                page != 'active_loads_map' && page != 'history_detail_map'
                && page != 'main_phone_update_sms_code' && page != 'active_loads_car_map') && <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />}

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