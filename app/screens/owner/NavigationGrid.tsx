import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFont from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from './RouterType';

type NavigationGridProps = {
    setActiveTab: (tab: keyof RootStackParamList) => void; // Change type to keyof RootStackParamList
};

const NavigationGrid: React.FC<NavigationGridProps> = ({ setActiveTab }) => {
    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                <TouchableOpacity onPress={() => setActiveTab('add_loads')} style={styles.gridItem}>
                    <Image source={require('../../assets/img/owner/Yuk.png')} style={styles.image} />
                    <Text style={styles.gridText}>Yuk qo'shish</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('active_loads')}
                    style={styles.gridItem}>
                    <Image source={require('../../assets/img/owner/Aktiv.png')} style={styles.image} />
                    <Text style={styles.gridText}>Aktiv yuklar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('history')}
                    style={styles.gridItem}>
                    <Image source={require('../../assets/img/owner/tarix.png')} style={styles.image} />
                    <Text style={styles.gridText}>Buyurtmalar tarixi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('profile')}
                    style={styles.gridItem}>
                    <Image source={require('../../assets/img/owner/profil.png')} style={styles.image} />
                    <Text style={styles.gridText}>Shaxsiy ma'lumotlar</Text>
                </TouchableOpacity>

            </View>
            <View>
                <TouchableOpacity onPress={() => setActiveTab('contact_admin')} style={styles.gridItem_2}>
                    <IconFont name="phone" size={24} color="#7257FF" />
                    <Text style={styles.gridText}>Admin bilan bog'lanish</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("terms_condition")} style={styles.gridItem_2}>
                    <Icon name="document-text" size={24} color="#7257FF" />
                    <Text style={styles.gridText}>Foydalanish shartlari</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#F4F6F7',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '100%',

    },
    gridItem: {
        width: '45%',
        padding: 10,
        paddingTop: 18,
        paddingBottom: 18,
        alignItems: 'center',
        margin: 5,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 5,
        // elevation: 5,
        cursor: 'pointer',
        borderColor: '#DADDDE',
        borderWidth: 1,
    },
    gridText: {
        fontSize: 16,
        color: '#131214',
        marginTop: 5,
    },
    image: {
        width: 112,
        height: 112,
    },
    gridItem_2: {
        width: '100%',
        padding: 10,
        marginTop: 15,
        borderColor: '#DADDDE',
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 10,
        backgroundColor: '#ffffff',

        display: 'flex',
        flexDirection: 'row',
        gap: 14,
        cursor: 'pointer',
        alignItems: 'center'
    }
});

export default NavigationGrid;
