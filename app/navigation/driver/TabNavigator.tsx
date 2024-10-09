import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DriverHomeScreen from '../../screens/driver/HomeScreen';
import DriverProfileScreen from '../../screens/driver/HomeScreen';

const Tab = createBottomTabNavigator();

const DriverNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="DriverHome" component={DriverHomeScreen} />
      <Tab.Screen name="DriverProfile" component={DriverProfileScreen} />
    </Tab.Navigator>
  );
};

export default DriverNavigator;
