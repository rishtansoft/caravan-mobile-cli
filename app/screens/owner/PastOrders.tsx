import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { HistoryProps } from './RouterType'
import Icon from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Octicons'; //arrow-switch

const defaultData = [
    {
        "start_location": "Andijon",
        "end_location": "Toshkent",
        "status": "Qidirilmoqda",
        "weight": "75kg",
        "id": "16005",
        'car_data': 'Labo 60 A 125 BA'
    },
    {
        "start_location": "Namangan",
        "end_location": "Farg'ona",
        "status": "Yukni olishga kelmoqda",
        "weight": "60kg",
        "id": "16006",
        'car_data': 'Labo 60 A 125 BA'

    },
    {
        "start_location": "Toshkent",
        "end_location": "Qoraqalpoq",
        "status": "Yuk ortilmoqda",
        "weight": "1.5ton",
        "id": "16007",
        'car_data': 'Labo 60 A 125 BA'
    },
    {
        "start_location": "Xorazm",
        "end_location": "Angren",
        "status": "Yo'lda",
        "weight": "200kg",
        "id": "16008",
        'car_data': 'Labo 60 A 125 BA'
    },
    {
        "start_location": "Qoraqalpoq",
        "end_location": "Farg'ona",
        "status": "Manzilga yetib bordi",
        "weight": "800kg",
        "id": "16009",
        'car_data': 'Labo 60 A 125 BA'
    },
    {
        "start_location": "Namangan",
        "end_location": "Qashqadaryo",
        "status": "Tushirilmoqda",
        "weight": "96kg",
        "id": "16010",
        'car_data': 'Labo 60 A 125 BA'
    },
    {
        "start_location": "Buxoro",
        "end_location": "Surxandaryo",
        "status": "Yakunlangan",
        "weight": "65kg",
        "id": "160011",
        'car_data': 'Labo 60 A 125 BA'
    },
]
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

const PastOrders: React.FC<HistoryProps> = ({ navigation }) => {

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
                    Aktiv buyurtmlar
                </Text>
            </View>
            <View style={styles.container}>
                <FlatList
                    data={defaultData}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('history_detail', { itemId: item.id })}
                            style={styles.link}>
                            <View style={styles.link_location}>
                                <View style={styles.link_location_texts}>
                                    <Text style={styles.link_location_text}>{item.start_location}</Text>
                                    <Fontisto name="arrow-switch" size={15} color="#B4A6FF" />
                                    <Text style={styles.link_location_text}>{item.end_location}</Text>
                                </View>
                                <Text style={styles.link_location_id}>#{item.id}</Text>
                            </View>
                            <View style={styles.link_bottom}>
                                <Text style={[styles.link_bottom_text, { backgroundColor: '#F0EDFF', color: '#5336E2', }]}>{item.car_data}</Text>
                                <Text style={[styles.link_bottom_text, { backgroundColor: '#F0EDFF', color: '#5336E2', }]}>{item.weight}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <View style={{ marginTop: defaultData.length > 7 ? 20 : 15 }}></View>


        </View>
    )
};

const styles = StyleSheet.create({
    container_all: {
        flex: 1,
        backgroundColor: '#e6e8ea',
        overflow: 'scroll'
    },
    container: {
        width: '100%',
        backgroundColor: '#e6e8ea',
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 30,
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
    link: {
        backgroundColor: '#ffffff',
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10
    },
    link_location: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    link_location_texts: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    link_location_text: {
        color: '#291F61',
        fontWeight: '700',
        fontSize: 18,

    },
    link_location_id: {
        color: '#898D8F'
    },
    link_bottom: {
        marginTop: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10

    },
    link_bottom_text: {
        paddingVertical: 3,
        paddingHorizontal: 4,
        fontSize: 12,
        borderRadius: 3
    }
}
);

export default PastOrders