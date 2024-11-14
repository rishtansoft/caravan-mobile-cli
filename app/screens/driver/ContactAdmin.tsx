import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Alert,
} from "react-native";
import React from "react";
import IconFont from "react-native-vector-icons/FontAwesome";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import IconEntypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { ContactAdminProps } from "./RouterType";
const ContactAdmin: React.FC<ContactAdminProps> = ({ navigation }) => {

    const dialPhoneNumber = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber}`).catch((err) => {
            Alert.alert("Xatolik", "Telefon raqamni ochib bo'lmadi.");
        });
    };

    const openTelegramLink = (telegramHandle: string) => {
        Linking.openURL(`https://t.me/${telegramHandle}`).catch((err) => {
            Alert.alert("Xatolik", "Telegram profilini ochib bo'lmadi.");
        });
    };

    const sendEmail = (email: string) => {
        Linking.openURL(`mailto:${email}`).catch((err) => {
            Alert.alert("Xatolik", "Elektron pochtani ochib bo'lmadi.");
        });
    };

    const openWebsite = (url: string) => {
        Linking.openURL(url).catch((err) => {
            Alert.alert("Xatolik", "Veb-saytni ochib bo'lmadi.");
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconFont
                    style={styles.gobackIcon}
                    onPress={() => navigation.navigate('active_loads')}
                    name="angle-left"
                    size={30}
                    color="#7257FF"
                />
                <Text style={styles.headerTitle}>Admin bilan bog'lanish </Text>
            </View>

            <View style={styles.contactBox}>
                <TouchableOpacity onPress={() => dialPhoneNumber("+998998427979")}>
                    <View style={styles.contactItem}>
                        <View style={styles.contactText}>
                            <Text style={styles.contactNumber}>+998 99 842 79 79</Text>
                            <Text style={styles.contactLabel}>Telefon raqam</Text>
                        </View>
                        <IconFont name="phone" size={24} color="#898D8F" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => dialPhoneNumber("+998998427979")}>
                    <View style={styles.contactItem}>
                        <View style={styles.contactText}>
                            <Text style={styles.contactNumber}>+998 99 842 79 79</Text>
                            <Text style={styles.contactLabel}>Telefon raqam</Text>
                        </View>
                        <IconFont name="phone" size={24} color="#898D8F" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => openTelegramLink("Mgoziyev")}>
                    <View style={styles.contactItem}>
                        <View style={styles.contactText}>
                            <Text style={styles.contactNumber}>Caravan_logistics</Text>
                            <Text style={styles.contactLabel}>Telegram kanali</Text>
                        </View>
                        <IconEntypo name="paper-plane" size={24} color="#898D8F" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => openTelegramLink("M_goziyev")}>
                    <View style={styles.contactItem}>
                        <View style={styles.contactText}>
                            <Text style={styles.contactNumber}>Caravan_admin</Text>
                            <Text style={styles.contactLabel}>Telegram lichkasi</Text>
                        </View>
                        <IconEntypo name="paper-plane" size={24} color="#898D8F" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => sendEmail("support@caravan.uz")}>
                    <View style={styles.contactItem}>
                        <View style={styles.contactText}>
                            <Text style={styles.contactNumber}>support@caravan.uz</Text>
                            <Text style={styles.contactLabel}>Elektron pochta</Text>
                        </View>
                        <IconMaterial name="email" size={24} color="#898D8F" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => openWebsite("https://caravan.uz")}>
                    <View style={styles.contactItem}>
                        <View style={styles.contactText}>
                            <Text style={styles.contactNumber}>caravan.uz</Text>
                            <Text style={styles.contactLabel}>Website</Text>
                        </View>
                        <IconEntypo name="globe" size={24} color="#898D8F" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "#F6F6F6",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 18,
        color: "black",
        textAlign: "center",
        fontWeight: "600",
        flex: 1,
    },
    gobackIcon: {
        paddingHorizontal: 15,
    },
    contactBox: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 16,
        marginTop: 20,
        elevation: 2,
        gap: 16
    },
    contactItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        gap: 16,
    },
    contactText: {
        marginLeft: 12,
        width: "80%",
    },
    contactNumber: {
        fontSize: 16,
        fontWeight: "500",
        color: "black",
    },
    contactLabel: {
        fontSize: 14,
        color: "#6F6F6F",
    },
});

export default ContactAdmin;
