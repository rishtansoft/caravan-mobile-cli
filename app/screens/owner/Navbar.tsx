import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFont from 'react-native-vector-icons/FontAwesome6';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from './RouterType';

type NavbarProps = {
    activeTab: string;
    setActiveTab: (tab: keyof RootStackParamList) => void; // Change type to keyof RootStackParamList
};

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => setActiveTab('home')}
            >
                <Icon name="home" size={24} color={(activeTab === 'home' || activeTab == 'terms_condition' || activeTab == 'contact_admin') ? '#5336E2' : '#898D8F'} />
                <Text style={[
                    styles.navText,
                    { color: (activeTab === 'home' || activeTab == 'terms_condition' || activeTab == 'contact_admin') ? '#5336E2' : '#898D8F' }
                ]}>
                    Asosiy
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => setActiveTab('active_loads')}
            >
                <IconFont name="truck-fast" size={24} color={(activeTab === 'active_loads' || activeTab == 'active_loads_detail' || activeTab == 'active_loads_map') ? '#5336E2' : '#898D8F'} />
                <Text style={[
                    styles.navText,
                    { color: (activeTab === 'active_loads' || activeTab == 'active_loads_detail') ? '#5336E2' : '#898D8F' }
                ]}>
                    Aktiv yuklar
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => setActiveTab('history')}
            >
                <Icon name="cube-sharp" size={24} color={(activeTab === 'history' || activeTab == 'history_detail') ? '#5336E2' : '#898D8F'} />
                <Text style={[
                    styles.navText,
                    { color: (activeTab === 'history' || activeTab == 'history_detail') ? '#5336E2' : '#898D8F' }
                ]}>
                    Tarix
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => setActiveTab('profile')}
            >
                <IconFontAwesome name="user-circle-o" size={24} color={(activeTab === 'profile' || activeTab == 'profile_update') ? '#5336E2' : '#898D8F'} />
                <Text style={[
                    styles.navText,
                    { color: (activeTab === 'profile' || activeTab == 'profile_update') ? '#5336E2' : '#898D8F' }
                ]}>
                    Profil
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 999,

    },
    navItem: {
        alignItems: 'center',
        cursor: 'pointer'
    },
    navText: {
        fontSize: 12,
        color: '#898D8F',
    },
});

export default Navbar;
