import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import DriverNavigation from './navigations/driver/DriverNavigator';
import OwnerNavigation from './navigations/owner/OwnerNavigator';
import { GetData } from './screens/AsyncStorage/AsyncStorage';
import GeneralNavigation from './navigations/general/GeneralNavigator';

interface componentNameProps {
    roles: string | null | undefined,
    name: string | undefined,

}

const UserRole: React.FC<componentNameProps> = ({ roles, name }) => {

    if (roles === 'driver') {
        return <DriverNavigation page={name} />;
    } else if (roles === 'cargo_owner') {
        return <OwnerNavigation page={name} />;
    }
    return <GeneralNavigation />;
};

export default UserRole;

const styles = StyleSheet.create({
    container: {

    }
});
