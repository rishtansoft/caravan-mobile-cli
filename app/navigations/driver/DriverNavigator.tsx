import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/driver/HomeScreen'; 
import TarihScreen from '../../screens/driver/LoadHistory';
import AdminScreen from '../../screens/driver/ContactAdmin';
import ProfileScreen from '../../screens/driver/DriverProfile';
import DetailScreen from '../../screens/driver/ActiveLoadDetail';
import TermsAndCondition from '../../screens/driver/TermsAndCondition';
import DriverProfileEdit from '../../screens/driver/DriverProfileEdit';
import ActiveLoadDetailMap from '../../screens/driver/ActiveLoadDetailMap';
import LoadHistoryDetails from '../../screens/driver/LoadHistoryDetails';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ActiveLoadDetail" 
        component={DetailScreen} 
        options={{ headerShown:false }} 
      />
      <Stack.Screen 
        name="LoadHistoryDetails" 
        component={LoadHistoryDetails} 
        options={{ headerShown:false }} 
      />
      <Stack.Screen 
        name="TermsAndCondition" 
        component={TermsAndCondition} 
        options={{ headerShown:false }} 
      />
      <Stack.Screen 
        name="DriverProfileEdit" 
        component={DriverProfileEdit} 
        options={{ headerShown:false }} 
      />
      <Stack.Screen 
        name="ActiveLoadDetailMap" 
        component={ActiveLoadDetailMap} 
        options={{ headerShown:false }} 
      />
    </Stack.Navigator>
  );
};

const DriverNavigator = () => {
  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'rgb(255, 255, 255)', 
          paddingBottom: 10, 
          height: 72,
          position: 'absolute', 
          shadowColor: '#000', 
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          elevation: 5,
          borderTopLeftRadius:30,
          borderTopRightRadius:30 
        },
        tabBarLabelStyle: {
          fontSize: 12, 
          fontWeight: '600', 
        },
        tabBarIconStyle: {
          marginBottom: -5, 
        },
        headerShown:false
      }}>
      <Tab.Screen 
        name="Aktiv yuklar" 
        component={HomeStack} // Stack navigator bilan HomeScreen
        options={{
          headerShown:false,
          tabBarIcon: ({ focused }) => (
            <Image 
              source={focused 
                ? require('../../assets/driver/home-icon-active.png')  
                : require('../../assets/driver/home-icon.png')  
              }
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Tarix" 
        component={TarihScreen} 
        options={{
          headerShown:false,
          tabBarIcon: ({ focused }) => (
            <Image 
              source={focused 
                ? require('../../assets/driver/history-icon-active.png')
                : require('../../assets/driver/history-icon.png')
              }
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Admin" 
        component={AdminScreen} 
        options={{
          headerShown:false,
          tabBarIcon: ({ focused }) => (
            <Image 
              source={focused 
                ? require('../../assets/driver/call-icon-active.png')
                : require('../../assets/driver/call-icon.png')
              }
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Profil" 
        component={ProfileScreen} 
        options={{
          headerShown:false,
          tabBarIcon: ({ focused }) => (
            <Image 
              source={focused 
                ? require('../../assets/driver/profile-icon-active.png')
                : require('../../assets/driver/profile-icon.png')
              }
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default DriverNavigator;
