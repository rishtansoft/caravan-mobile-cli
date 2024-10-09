import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './navigation/general/AuthNavigator'; // Login va Register sahifalari uchun
import OwnerNavigator from './navigation/owner/TabNavigator';
import DriverNavigator from './navigation/driver/TabNavigator';
import GeneralNavigator from './navigation/general/TabNavigator';
import AuthContextProvider, { AuthContext } from './context/general/AuthContext'; // Auth context

const App = () => {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthContextProvider>
  );
};

const RootNavigator = () => {
  const { user } = useContext(AuthContext);

  // Agar foydalanuvchi login qilmagan bo'lsa, AuthNavigator ko'rsatiladi.
  if (!user) {
    return <AuthNavigator />;
  }

  // User roli asosida navigatsiyani aniqlaymiz.
  if (user.role === 'driver') {
    return <DriverNavigator />;
  } else if (user.role === 'owner') {
    return <OwnerNavigator />;
  }

  // Umumiy sahifalar (general)
  return <GeneralNavigator />;
};

export default App;
