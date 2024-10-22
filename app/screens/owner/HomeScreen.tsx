import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavigationGrid from './NavigationGrid';
import { RootStackParamList } from './RouterType';
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Import navigation hook


const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('home');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Specify navigation type

  const handleTabChange = (tab: keyof RootStackParamList) => {
    setActiveTab(tab);
    navigation.navigate(tab); // Use correct tab type
  };
  return (
    <View style={styles.container}>
      <NavigationGrid setActiveTab={handleTabChange} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F7',
  },
});

export default HomeScreen