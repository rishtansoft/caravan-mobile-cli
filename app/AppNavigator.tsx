import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useSelector } from 'react-redux';
import DriverNavigation from './navigations/driver/DriverNavigator';
import OwnerNavigation from './navigations/owner/OwnerNavigator';
import GeneralNavigation from './navigations/general/GeneralNavigator';
import store, { RootState } from './store/store';
import LoginScreen from './screens/general/LoginScreen';
import { RootStackParamList } from './screens/general/RouterType';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotSmsPassword from './screens/general/ForgotSmsPassword';
import NewPassword from './screens/general/NewPassword';
import RegisterScreen from './screens/general/RegisterScreen';
import RegisterSecondScreen from './screens/general/RegisterSecondScreen';
import HomeScreen from './screens/general/Home';
import VerifySmsScreen from './screens/general/VerifySmsScreen';
import { GetData, RemoveData } from './screens/AsyncStorage/AsyncStorage';
import UserRole from './UserRole';
const Stack = createNativeStackNavigator<RootStackParamList>();

import { useNavigationContainerRef } from '@react-navigation/native';

const AppNavigator = () => {

    const navigationRef = useNavigationContainerRef();
    const [routerPage, setRouterPage] = useState<string | undefined>('');

    useEffect(() => {
        const unsubscribe = navigationRef.addListener('state', () => {
            const currentRouteName = navigationRef.getCurrentRoute()?.name;
            const params = navigationRef.getCurrentRoute()?.params;
            setRouterPage(currentRouteName)

        });

        return unsubscribe;
    }, []);
    return (
        <Provider store={store}>
            <NavigationContainer ref={navigationRef}>
                <RootNavigator name={routerPage} />
            </NavigationContainer>
        </Provider>
    );
};
interface RouterPage {
    name: string | undefined;
    params?: object;
}
const RootNavigator: React.FC<RouterPage> = ({ name }) => {
    const [token, setToken] = useState<string>('');
    const [rolesData, setRolesData] = useState<string>('');
    const auth = useSelector((state: RootState) => state.auth);
    const isLoggedIn = auth.isLoggedIn;
    const role = auth.role;

    useEffect(() => {
        GetData('token').then((res) => {
            if (res) {
                setToken(res)
            }
        }).catch((error) => {
            console.error('Xatolik yuz berdi:', error);
        });
        GetData('role').then((res) => {
            if (res) {
                setRolesData(res)
            }
        }).catch((error) => {
            console.error('Xatolik yuz berdi:', error);
        });
    }, []);



    // if (isLoggedIn) {

    //     if (role === 'driver') {
    //         return <DriverNavigation />;
    //     } else if (role === 'cargo_owner') {
    // return <OwnerNavigation />;
    //     }
    //     return <GeneralNavigation />;
    // }

    if (isLoggedIn) {
        return <UserRole name={name} roles={role} />

    }

    return <AuthNavigator />;
};

const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="home">
            <Stack.Screen options={{ headerShown: false }} name="home" component={HomeScreen} />
            <Stack.Screen options={{ headerShown: false }} name="login" component={LoginScreen} />
            <Stack.Screen options={{ headerShown: false }} name="forgot_sms_pagepassword" component={ForgotSmsPassword} />
            <Stack.Screen options={{ headerShown: false }} name="new_password" component={NewPassword} />
            <Stack.Screen options={{ headerShown: false }} name="register" component={RegisterScreen} />
            <Stack.Screen options={{ headerShown: false }} name="register_second" component={RegisterSecondScreen} />
            <Stack.Screen options={{ headerShown: false }} name="verify_sms_screen" component={VerifySmsScreen} />
            {/* <Stack.Screen options={{ headerShown: false }} name="home" component={HomeScreen} /> */}
        </Stack.Navigator>
    );
};

export default AppNavigator;
