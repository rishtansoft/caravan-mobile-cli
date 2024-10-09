import React, { useContext, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { AuthContext } from '../../context/general/AuthContext';

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [role, setRole] = useState<'driver' | 'owner' | ''>('');

  const handleLogin = () => {
    if (role === 'driver' || role === 'owner') {
      login(role);
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Enter role (driver/owner)" />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
