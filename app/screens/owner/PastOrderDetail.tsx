import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { HistoryDetailProps } from './RouterType';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFoundation from 'react-native-vector-icons/Foundation';
import Fontisto from 'react-native-vector-icons/Octicons'; //arrow-switch
import FeatherIcons from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

const defaultData = {
    "status": "Yakunlangan",
    "start_location": "Andijon",
    "end_location": "Toshkent",
    "cargo_details": {
        "start_address": "Andijon viloyati, Baliqchi tumani, Islomobod MFY, Sultonov, B47",
        "stopover_address": "Namangan viloyati, Chust tumani, Cho'pon MFY, Rasulov ko'chasi, A11",
        "end_address": "Toshkent shahri, Chilonzor tumani, Novza avenue, 21-kvartal, A16"
    },
    "vehicle_details": {
        "license_plate": "60A125BA",
        "type": "Yopiq Labo"
    },
    "cargo_type": "Oziq ovqat mahsulotlari",
    "cargo_weight": "203kg",
    "loading_time": "30 daqiqa",
    "receiver_phone": "+998 99 842 79 79",
    "payer": "Yuk beruvchi",
    "round_trip": "Ha",
    "order_comment": "Lorem ipsum dolor amet sit.",
    "date_of_delivery": "Avgust 15, 2024 16:30",
    "date_shipped": "Avgust 15, 2024 23:09"
}

const getBgColorKey = (key: string): string => {
    switch (key) {
        case 'Qidirilmoqda':
            return '#F0EDFF';
        case 'Yukni olishga kelmoqda':
            return '#E5F0FF';
        case 'Yuk ortilmoqda':
            return '#FFEFB3';
        case "Yo'lda":
            return '#FFE9D1';
        case 'Manzilga yetib bordi':
            return '#D7F5E5';
        case 'Tushirilmoqda':
            return '#FFEFB3';
        case 'Yakunlangan':
            return '#D7F5E5';
        default:
            return '#F0EDFF'; // Default rang
    }
};

const getTextColorKey = (key: string): string => {
    switch (key) {
        case 'Qidirilmoqda':
            return '#5336E2';
        case 'Yukni olishga kelmoqda':
            return '#0050C7';
        case 'Yuk ortilmoqda':
            return '#B26205';
        case "Yo'lda":
            return '#E28F36';
        case 'Manzilga yetib bordi':
            return '#006341';
        case 'Tushirilmoqda':
            return '#B26205';
        case 'Yakunlangan':
            return '#006341';
        default:
            return '#5336E2'; // Default rang
    }
};



const PastOrderDetail: React.FC<HistoryDetailProps> = ({ navigation, route }) => {
    const { itemId } = route.params;
    return (
        <View style={styles.container_all}>
            <View style={styles.header_con}>
                <View style={{
                    width: '6%'
                }}>
                    <Icon
                        onPress={() => navigation.navigate('history')}
                        name="angle-left" size={30} color="#7257FF" />
                </View>
                <View style={styles.title_cont}>
                    <Text style={styles.title}>
                        Buyurtma #{itemId}
                    </Text>
                    <View style={styles.link_bottom}>
                        <Text style={[styles.link_bottom_text, { backgroundColor: getBgColorKey(defaultData.status), color: getTextColorKey(defaultData.status) }]}>{defaultData.status}</Text>

                    </View>

                </View>
                <IconFoundation
                    onPress={() => navigation.navigate('home')}
                    name="map" size={30} color="#7257FF" />
            </View>
            <ScrollView style={{ flex: 1, paddingBottom: 10 }}>
                <View style={styles.container}>
                    <View style={styles.link_location_texts}>
                        <Text style={styles.link_location_text}>{defaultData.start_location}</Text>
                        <Fontisto name="arrow-switch" size={18} color="#B4A6FF" />
                        <Text style={styles.link_location_text}>{defaultData.end_location}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View>
                            <FeatherIcons
                                name="map-pin" size={20} color="#131214" />
                        </View>
                        <View style={styles.content_text_container}>
                            <Text style={styles.content_text_top}>Yuk manzili</Text>
                            <Text style={styles.content_text_bottom} numberOfLines={2}>
                                {defaultData.cargo_details.start_address}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View>
                            <MaterialCommunityIcons
                                name="map-marker-plus-outline" size={25} color="#131214" />
                        </View>
                        <View style={styles.content_text_container}>
                            <Text style={styles.content_text_top}>Yuk manzili</Text>
                            <Text style={styles.content_text_bottom} numberOfLines={2}>
                                {defaultData.cargo_details.stopover_address}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View>
                            <MaterialCommunityIcons
                                name="map-marker-check-outline" size={26} color="#131214" />
                        </View>
                        <View style={styles.content_text_container}>
                            <Text style={styles.content_text_top}>Yuk manzili</Text>
                            <Text style={styles.content_text_bottom} numberOfLines={2}>
                                {defaultData.cargo_details.end_address}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View>
                            <AntDesignIcon
                                name="calendar" size={23} color="#131214" />
                        </View>
                        <View style={styles.content_text_container}>
                            <Text style={styles.content_text_top}>Yuk olingan sana</Text>
                            <Text style={styles.content_text_bottom} numberOfLines={2}>
                                {defaultData.date_of_delivery}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View>
                            <AntDesignIcon
                                name="calendar" size={23} color="#131214" />
                        </View>
                        <View style={styles.content_text_container}>
                            <Text style={styles.content_text_top}>Yuk Tpshirilgan sana</Text>
                            <Text style={styles.content_text_bottom} numberOfLines={2}>
                                {defaultData.date_shipped}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View>
                            <Ionicons
                                name="car-outline" size={25} color="#131214" />
                        </View>
                        <View style={styles.content_text_container}>
                            <Text style={styles.content_text_top}>Mashina raqami</Text>
                            <Text style={[styles.content_text_bottom, { color: '#5336E2' }]} numberOfLines={2}>
                                {defaultData.vehicle_details.license_plate}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View>
                            <Ionicons
                                name="cube-outline" size={23} color="#131214" />
                        </View>
                        <View style={styles.content_text_container}>
                            <Text style={styles.content_text_top}>Yuk turi</Text>
                            <Text style={styles.content_text_bottom} numberOfLines={2}>
                                {defaultData.cargo_type}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View>
                            <Ionicons
                                name="scale-outline" size={23} color="#131214" />
                        </View>
                        <View style={styles.content_text_container}>
                            <Text style={styles.content_text_top}>Yuk vazni</Text>
                            <Text style={styles.content_text_bottom} numberOfLines={2}>
                                {defaultData.cargo_weight}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View>
                            <Ionicons
                                name="time-outline" size={23} color="#131214" />
                        </View>
                        <View style={styles.content_text_container}>
                            <Text style={styles.content_text_top}>Yuklash vaqti</Text>
                            <Text style={styles.content_text_bottom} numberOfLines={2}>
                                {defaultData.loading_time}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View>
                            <FeatherIcons
                                name="truck" size={23} color="#131214" />
                        </View>
                        <View style={styles.content_text_container}>
                            <Text style={styles.content_text_top}>Mashina turi</Text>
                            <Text style={styles.content_text_bottom} numberOfLines={2}>
                                {defaultData.vehicle_details.type}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View>
                            <FeatherIcons
                                name="phone-call" size={20} color="#131214" />
                        </View>
                        <View style={styles.content_text_container}>
                            <Text style={styles.content_text_top}>Qabul qiluvchining telefon raqami</Text>
                            <Text style={styles.content_text_bottom} numberOfLines={2}>
                                {defaultData.receiver_phone}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View>
                            <Ionicons
                                name="logo-usd" size={20} color="#131214" />
                        </View>
                        <View style={styles.content_text_container}>
                            <Text style={styles.content_text_top}>Kim to'laydi</Text>
                            <Text style={styles.content_text_bottom} numberOfLines={2}>
                                {defaultData.payer}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View>
                            <Fontisto
                                name="arrow-switch" size={20} color="#131214" />
                        </View>
                        <View style={styles.content_text_container}>
                            <Text style={styles.content_text_top}>Borib qaytish</Text>
                            <Text style={styles.content_text_bottom} numberOfLines={2}>
                                {defaultData.round_trip}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View>
                            <MaterialCommunityIcons
                                name="message-reply-text-outline" size={20} color="#131214" />
                        </View>
                        <View style={styles.content_text_container}>
                            <Text style={styles.content_text_top}>Buyurtma uchun sharh</Text>
                            <Text style={styles.content_text_bottom} numberOfLines={2}>
                                {defaultData.order_comment}
                            </Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#7257FF', marginBottom: 20 }]}>
                    <Text style={[styles.btn_text, { color: '#fff' }]}>Xaritada ko'rish
                    </Text>
                    <IconFoundation
                        name="map" size={25} color="#fff" />
                </TouchableOpacity>
            </ScrollView>

            <View style={{ marginTop: 65 }}></View>




        </View>
    )
}

const styles = StyleSheet.create({
    container_all: {
        flex: 1,
        backgroundColor: '#F4F6F7',
        overflow: 'scroll'
    },
    container: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: 10,
        marginHorizontal: 10,
        flex: 1,
        borderRadius: 10,
        height: 'auto',

    },

    header_con: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        width: "100%",
        paddingHorizontal: 15,
        paddingVertical: 15,
        justifyContent: 'space-between',
        height: 'auto'
    },

    link_location_texts: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    link_location_text: {
        color: '#291F61',
        fontWeight: '700',
        fontSize: 24,

    },

    title: {
        color: '#131214',
        fontSize: 20,
        lineHeight: 10,
        fontWeight: '600',
        textAlign: 'center',
        paddingTop: 40,
        paddingHorizontal: 10,
    },
    title_cont: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
    },
    link_bottom: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'

    },

    link_bottom_text: {
        paddingVertical: 4,
        paddingHorizontal: 5,
        fontSize: 15,
        borderRadius: 5,

    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 15,
        marginTop: 5,
        paddingRight: 10, // Add padding to prevent text from touching the edge
    },

    content_text_container: {
        flex: 1, // Take remaining space
    },

    content_text_top: {
        color: '#6E7375',
        fontSize: 16
    },

    content_text_bottom: {
        color: '#131214',
        fontSize: 20,
        fontWeight: '600',
        flexWrap: 'wrap', // Enable text wrapping
    },
    btn: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: 15,
        marginHorizontal: 10,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        borderRadius: 20
    },
    btn_text: {
        textAlign: 'center',
        fontSize: 16

    }
}
);

export default PastOrderDetail