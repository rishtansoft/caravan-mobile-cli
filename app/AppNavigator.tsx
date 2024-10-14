import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useSelector } from "react-redux";
import DriverNavigation from "./navigations/driver/DriverNavigator";
import OwnerNavigation from "./navigations/owner/OwnerNavigator";
import GeneralNavigation from "./navigations/general/GeneralNavigator";
import { Text } from "react-native";
import store, { RootState } from "./store/store";
const AppNavigator = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
};

const RootNavigator = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const isLoggedIn = auth.isLoggedIn;
  const role = auth.role;

  if (isLoggedIn) {
    if (role === "driver") {
      return <DriverNavigation />;
    } else if (role === "owner") {
      return <OwnerNavigation />;
    }
    return <GeneralNavigation />;
  }

  return <AuthNavigator />;
};

const AuthNavigator = () => {
  return <Text>Auth Screen (Tizimga kirish sahifasi)</Text>;
};

export default AppNavigator;
