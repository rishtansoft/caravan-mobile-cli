import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OwnerHomeScreen from '../../screens/owner/HomeScreen';

const Tab = createBottomTabNavigator();

const OwnerNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="OwnerHome" component={OwnerHomeScreen} />
    </Tab.Navigator>
  );
};

export default OwnerNavigator;
