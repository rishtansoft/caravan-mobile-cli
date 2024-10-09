import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GeneralHomeScreen from '../../screens/general/HomeScreen';

const Tab = createBottomTabNavigator();

const GeneralNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="GeneralHome" component={GeneralHomeScreen} />
    </Tab.Navigator>
  );
};

export default GeneralNavigator;
