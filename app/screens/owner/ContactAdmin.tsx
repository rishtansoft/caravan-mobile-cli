import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { ContactAdminProps } from './RouterType'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const ContactAdmin: React.FC<ContactAdminProps> = ({ navigation }) => {
    const handlePress = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <View style={styles.container_all}>
            <View style={styles.header_con}>
                <View style={{
                    width: '6%'
                }}>
                    <Icon
                        onPress={() => navigation.navigate('home')}
                        name="angle-left" size={30} color="#7257FF" />
                </View>
                <Text style={styles.title}>
                    Admin bilan bog'lanish
                </Text>
            </View>

            <View style={styles.container}>
                <View style={styles.contact}>
                    <TouchableOpacity style={styles.link} onPress={() => Linking.openURL('tel:+998901234567')}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>+998901234567</Text>
                            <Text style={styles.subText}>Telefon raqam</Text>
                        </View>
                        <IconFeather name="phone-call" size={20} color="#898D8F" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.link} onPress={() => Linking.openURL('tel:+998901234567')}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>+998901234567</Text>
                            <Text style={styles.subText}>Telefon raqam</Text>
                        </View>
                        <IconFeather name="phone-call" size={20} color="#898D8F" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.link} onPress={() => Linking.openURL('https://t.me/Telegram kanali')}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Caravan_logistics</Text>
                            <Text style={styles.subText}>Telegram kanali</Text>

                        </View>
                        <IconEvilIcons name="sc-telegram" size={26} color="#898D8F" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.link} onPress={() => Linking.openURL('https://t.me/Caravan_admin')}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>Caravan_admin</Text>
                            <Text style={styles.subText}>Telegram lichkasi</Text>
                        </View>
                        <IconEvilIcons name="sc-telegram" size={26} color="#898D8F" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.link} onPress={() => Linking.openURL('mailto:support@caravan.uz')}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>support@caravan.uz</Text>
                            <Text style={styles.subText}>Elektron pochta</Text>
                        </View>
                        <Ionicons name="mail-outline" size={20} color="#898D8F" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.link} onPress={() => Linking.openURL('https://caravan.uz')}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>caravan.uz</Text>
                            <Text style={styles.subText}>Website</Text>
                        </View>
                        <SimpleLineIcons name="globe" size={20} color="#898D8F" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    )
}


const styles = StyleSheet.create({
    container_all: {
        flex: 1,
        backgroundColor: '#e6e8ea',
    },
    container: {
        width: '100%',
        backgroundColor: '#e6e8ea',
        padding: 20,
        flex: 1,
    },

    header_con: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        width: "100%",
        paddingLeft: 15
    },
    title: {
        color: '#131214',
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 100,
        width: '90%',
        fontWeight: '600',
    },


    contact: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginTop: 5
    },
    link: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    textContainer: {
        flex: 1,
    },
    text: {
        fontSize: 16,
        color: '#131214',
        fontWeight: '600'
    },
    subText: {
        fontSize: 14,
        color: '#898D8F',
    }
}
);


export default ContactAdmin