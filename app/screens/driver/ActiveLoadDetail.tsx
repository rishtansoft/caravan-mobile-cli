import { View, Text, Image, StyleSheet, TouchableOpacity, } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconFeather from "react-native-vector-icons/Feather";
import IconFont from "react-native-vector-icons/FontAwesome";
import IconIonicons from "react-native-vector-icons/Ionicons";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
const splitText = (text: string,): { text_1: string } => {
    const text_1 = text.slice(0, 8);
    return { text_1 };
};

const ActiveLoadDetail = ({ route }) => {
    const { orderId } = route.params;
    const navigation = useNavigation();
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.header}>
                <IconFont
                    onPress={() => navigation.goBack()}
                    name="angle-left"
                    size={40}
                    color="#7257FF"
                />
                <Text style={styles.headerTitle}>Buyurtma #{splitText(orderId).text_1}</Text>
                <Image source={require("../../assets/driver/map.png")} />
            </View>
            <View style={styles.orderDetails}>
                <Text style={styles.orderDetailText}>Andijon</Text>
                <Image source={require("../../assets/driver/referrer.png")} />
                <Text style={styles.orderDetailText}>Toshkent</Text>
            </View>
            <View style={styles.orderInformation}>
                <View style={styles.orderInformationCard}>
                    <Icon name="map-marker-outline" size={30} color="black" />
                    <View style={styles.orderInformationTexts}>
                        <Text>Yuk manzili</Text>
                        <Text style={styles.orderDescription}>
                            Andijon viloyati, Baliqchi tumani, Islomobod  MFY, Sultonov, B47
                        </Text>
                    </View>
                </View>
                <View style={styles.orderInformationCard}>
                    <Icon name="map-marker-plus-outline" size={30} color="black" />
                    <View style={styles.orderInformationTexts}>
                        <Text>Tohtab o'tish</Text>
                        <Text style={styles.orderDescription}>
                            Namangan viloyati, Chust tumani, Cho’lpon MFY, Rasulov ko’chasi,
                            A11
                        </Text>
                    </View>
                </View>
                <View style={styles.orderInformationCard}>
                    <Icon name="map-marker-check-outline" size={30} color="black" />
                    <View style={styles.orderInformationTexts}>
                        <Text>Yetkazish manzili</Text>
                        <Text style={styles.orderDescription}>
                            Toshkent shahri, Chilonzor tumani, Novza avenue, 21-kvartal, A16
                        </Text>
                    </View>
                </View>
            </View>

            {/* Cargo information */}
            <View style={styles.cargoInformation}>
                <View style={styles.cargoInformationCard}>
                    <Icon name="car" size={30} color="black" />
                    <View style={styles.cargoInformationTexts}>
                        <Text>Mashina raqami</Text>
                        <Text style={styles.cargoNomer}>60A125BA</Text>
                    </View>
                </View>
                <View style={styles.cargoInformationCard}>
                    <IconFeather name="box" size={30} color="black" />
                    <View style={styles.cargoInformationTexts}>
                        <Text>Yuk Turi</Text>
                        <Text style={styles.cargoDescription}>Oziq ovqat mahsulotlari</Text>
                    </View>
                </View>
                <View style={styles.cargoInformationCard}>
                    <IconIonicons name="scale-outline" size={30} color="black" />
                    <View style={styles.cargoInformationTexts}>
                        <Text>Yuk vazni</Text>
                        <Text style={styles.cargoDescription}>203kg</Text>
                    </View>
                </View>
                <View style={styles.cargoInformationCard}>
                    <Icon name="clock-outline" size={30} color="black" />
                    <View style={styles.cargoInformationTexts}>
                        <Text>Yuklash vaqti</Text>
                        <Text style={styles.cargoDescription}>30 daqiqa</Text>
                    </View>
                </View>
                <View style={styles.cargoInformationCard}>
                    <IconFeather name="truck" size={27} color="black" />
                    <View style={styles.cargoInformationTexts}>
                        <Text>Mashina turi</Text>
                        <Text style={styles.cargoDescription}>Yopiq Labo</Text>
                    </View>
                </View>
            </View>

            {/* remaining information */}

            <View style={styles.remainingInformation}>
                <View style={styles.remainingInformationCard}>
                    <IconFeather name="phone-call" size={25} color="black" />
                    <View style={styles.remainingInformationTexts}>
                        <Text>Qabul qiluvchining telefon raqami</Text>
                        <Text style={styles.remainingDescription}>+998 95 024 54 54</Text>
                    </View>
                </View>
                <View style={styles.remainingInformationCard}>
                    <IconIonicons name="logo-usd" size={30} color="black" />
                    <View style={styles.remainingInformationTexts}>
                        <Text>Kim to'laydi</Text>
                        <Text style={styles.remainingDescription}>
                            Yuk beruvchi
                        </Text>
                    </View>
                </View>
                <View style={styles.remainingInformationCard}>
                    <IconAntDesign name="swap" size={30} color="black" />
                    <View style={styles.remainingInformationTexts}>
                        <Text>Borib qaytish</Text>
                        <Text style={styles.remainingDescription}>Ha</Text>
                    </View>
                </View>
                <View style={styles.remainingInformationCard}>
                    <IconFeather name="message-circle" size={30} color="black" />
                    <View style={styles.remainingInformationTexts}>
                        <Text>Buyurtma uchun sharh</Text>
                        <Text style={styles.remainingDescription}>Tez va sifatli yetib borishi kerak</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.mapButton}>
                <Text style={styles.mapButtonText}>Xaritada ko'rish</Text>
                <IconIonicons name="image-outline" size={25} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.loadButton}>
                <Text style={styles.loadButtonText}>Yukni olish</Text>
                <IconFeather name="box" size={25} color="white" />
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 16,
        backgroundColor: "#F4F6F7",
        marginBottom: 70
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 17,
        color: "black",
        fontWeight: "900",
    },
    orderDetails: {
        marginTop: 16,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: "white",
        paddingVertical: 16,
        borderRadius: 15,
    },
    orderDetailText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#291F61",
    },
    orderInformation: {
        borderRadius: 15,
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 20,
        flexDirection: "column",
        gap: 16,
    },
    orderInformationCard: {
        flexDirection: "row",
        gap: 16,
    },
    orderInformationTexts: {
        paddingTop: 10,
        flexDirection: "column",
        gap: 4,
    },
    orderDescription: {
        color: "black",
        fontSize: 18,
        fontWeight: "700",
        width: "50%",
    },
    cargoInformation: {
        marginTop: 8,
        borderRadius: 15,
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 20,
        flexDirection: "column",
        gap: 8,
    },
    cargoInformationCard: {
        flexDirection: "row",
        gap: 16,
    },
    cargoInformationTexts: {
        paddingTop: 10,
        flexDirection: "column",
        gap: 4,
    },
    cargoDescription: {
        color: "black",
        fontSize: 18,
        fontWeight: "700",
    },
    cargoNomer: {
        color: "#5336E2",
        fontWeight: "900",
        fontSize: 18,
    },
    remainingInformation: {
        marginTop: 8,
        borderRadius: 15,
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 20,
        flexDirection: "column",
        gap: 8,
    },
    remainingInformationCard: {
        flexDirection: "row",
        gap: 16,
    },
    remainingInformationTexts: {
        paddingTop: 10,
        flexDirection: "column",
        gap: 4,
    },
    remainingDescription: {
        color: "black",
        fontSize: 18,
        fontWeight: "700",
    },
    remainingNomer: {
        color: "#5336E2",
        fontWeight: "900",
        fontSize: 18,
    },
    mapButton: {
        flexDirection: 'row',
        backgroundColor: '#c5c5c5',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 8
    },
    mapButtonText: {
        color: '#000',
        fontSize: 17,
        marginRight: 10,
    },
    loadButton: {
        flexDirection: 'row',
        backgroundColor: '#7C3AED', // Binafsha rang
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25
    },
    loadButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginRight: 10,
    },
    icon: {
        width: 20,
        height: 20,
    },
});

export default ActiveLoadDetail;
