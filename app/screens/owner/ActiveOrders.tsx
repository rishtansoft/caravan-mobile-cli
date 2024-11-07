import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Alert } from 'react-native';
import { ActiveLoadsProps } from './RouterType'
import Icon from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Octicons'; //arrow-switch
import axios from 'axios';
import { GetData } from '../AsyncStorage/AsyncStorage';
import { API_URL } from '@env';



const defaultData = [
    {
        "start_location": "Andijon",
        "end_location": "Toshkent",
        "status": "Qidirilmoqda",
        "weight": "75kg",
        "id": "16005"
    },
    {
        "start_location": "Namangan",
        "end_location": "Farg'ona",
        "status": "Yukni olishga kelmoqda",
        "weight": "60kg",
        "id": "16006"
    },
    {
        "start_location": "Toshkent",
        "end_location": "Qoraqalpoq",
        "status": "Yuk ortilmoqda",
        "weight": "1.5ton",
        "id": "16007"
    },
    {
        "start_location": "Xorazm",
        "end_location": "Angren",
        "status": "Yo'lda",
        "weight": "200kg",
        "id": "16008"
    },
    {
        "start_location": "Qoraqalpoq",
        "end_location": "Farg'ona",
        "status": "Manzilga yetib bordi",
        "weight": "800kg",
        "id": "16009"
    },
    {
        "start_location": "Namangan",
        "end_location": "Qashqadaryo",
        "status": "Tushirilmoqda",
        "weight": "96kg",
        "id": "16010"
    },
    {
        "start_location": "Buxoro",
        "end_location": "Surxandaryo",
        "status": "Yakunlangan",
        "weight": "65kg",
        "id": "160011"
    },
]
const splitText = (text: string,): { text_1: string } => {
    const text_1 = text.slice(0, 8);
    return { text_1 };
};
const getBgColorKey = (key: string): string => {
    switch (key) {
        case 'posted':
            return '#F0EDFF';
        case 'assigned':
            return '#E5F0FF';
        case 'picked_up':
            return '#FFEFB3';
        case "in_transit":
            return '#FFE9D1';
        case 'delivered':
            return '#D7F5E5';
        case 'Tushirilmoqda':
            return '#FFEFB3';
        case 'Yakunlangan':
            return '#D7F5E5';
        default:
            return '#F0EDFF'; // Default rang
    }
};
const getStatusText = (key: string): string => {
    switch (key) {
        case 'posted':
            return 'Qidirilmoqda';
        case 'assigned':
            return 'Yukni olishga kelmoqda';
        case 'picked_up':
            return 'Yuk ortilmoqda';
        case "in_transit":
            return "Yo'lda";
        case 'delivered':
            return 'Manzilga yetib bordi';
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
        case 'posted':
            return '#5336E2';
        case 'assigned':
            return '#0050C7';
        case 'picked_up':
            return '#B26205';
        case "in_transit":
            return '#E28F36';
        case 'delivered':
            return '#006341';
        case 'Tushirilmoqda':
            return '#B26205';
        case 'Yakunlangan':
            return '#006341';
        default:
            return '#5336E2'; // Default rang
    }
};

interface DriverStop {
    load_id: string;
    latitude: string;
    longitude: string;
    order: number;
    start_time: string | null;
    end_time: string | null;
    location_name: string;
}

interface Cargo {
    cargo_type: string;
    driverStops: DriverStop[];
    id: string;
    loadDetails: any | null;
    load_status: string;
    user_id: string;
    weight: string;
}

interface ResData {
    id: string;
    status: string;
    weight: string;
    sub_id: string;
    start_location: string | undefined;
    end_location: string | undefined;

}

const filertDriverStopOrder = (arr: DriverStop[], order: number) => {
    const orderFilter = arr.find((el) => el.order == order)?.location_name.split(',')

    if (orderFilter && orderFilter.length > 0) {
        const addresa = orderFilter[0]
        return addresa
    } else {
        return orderFilter?.join(' ')
    }

}

const filterByDriverStops = (cargos: Cargo[]): Cargo[] => {
    return cargos.filter(cargo => cargo.driverStops && cargo.driverStops.length > 0);
};

const ActiveOrders: React.FC<ActiveLoadsProps> = ({ navigation }) => {
    const [user_id, setUser_id] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [resData, setResData] = useState<ResData[] | null>(null);

    useEffect(() => {
        GetData('user_id').then((res) => {
            if (res) {
                setUser_id(res)
            }
        }).catch((error) => {
            console.error('Xatolik yuz berdi:', error);
        });
        GetData('token').then((res) => {
            if (res) {
                setToken(res)
            }
        }).catch((error) => {
            console.error('Xatolik yuz berdi:', error);
        });
    }, []);

    useEffect(() => {
        if (token && user_id) {
            axios.get(API_URL + `/api/loads/get-user-all-loads?user_id=${user_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (res.data?.data && res.data.data.length > 0) {
                        const resdataFileter = filterByDriverStops(res.data?.data)
                        if (resdataFileter.length > 0) {
                            console.log(207, resdataFileter);

                            const newData = resdataFileter.map((el) => {
                                console.log(210, el.weight);

                                return {
                                    id: el.id,
                                    status: el.load_status,
                                    weight: el.loadDetails.weight,
                                    sub_id: splitText(el.id).text_1,
                                    start_location: filertDriverStopOrder(el.driverStops, 0),
                                    end_location: filertDriverStopOrder(el.driverStops, 1),
                                }
                            });
                            if (newData && newData.length > 0) {
                                setResData(newData)
                            }
                        }
                    }
                }).catch((error) => {
                    console.log(132, error);
                })
        }
    }, [token, user_id]);

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
            {/* <ScrollView style={styles.container}>
                {
                    defaultData.map((el, index) =>
                        <TouchableOpacity key={index} style={styles.link}>
                            <View style={styles.link_location}>
                                <View style={styles.link_location_texts}>
                                    <Text style={styles.link_location_text}>{el.start_location}</Text>
                                    <Fontisto name="arrow-switch" size={15} color="#B4A6FF" />
                                    <Text style={styles.link_location_text}>{el.end_location}</Text>
                                </View>
                                <Text style={styles.link_location_id}>#{el.id}</Text>
                            </View>
                            <View style={styles.link_bottom}>
                                <Text style={[styles.link_bottom_text, { backgroundColor: getBgColorKey(el.status), color: getTextColorKey(el.status) }]}>{el.status}</Text>
                                <Text style={[styles.link_bottom_text, { backgroundColor: '#F0EDFF', color: '#5336E2', }]}>{el.weight}</Text>
                            </View>
                        </TouchableOpacity>)
                }

            </ScrollView > */}
            <View style={styles.container}>
                {
                    resData && resData.length > 0 && <FlatList
                        data={resData}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('active_loads_detail', { itemId: item.id })}
                                style={styles.link}>
                                <View style={styles.link_location}>
                                    <View style={styles.link_location_texts}>
                                        <Text style={styles.link_location_text}>{item.start_location}</Text>
                                        <Fontisto name="arrow-switch" size={15} color="#B4A6FF" />
                                        <Text style={styles.link_location_text}>{item.end_location}</Text>
                                    </View>
                                    <Text style={styles.link_location_id}>#{item.sub_id}</Text>
                                </View>
                                <View style={styles.link_bottom}>
                                    <Text style={[styles.link_bottom_text, { backgroundColor: getBgColorKey(item.status), color: getTextColorKey(item.status) }]}>{getStatusText(item.status)}</Text>
                                    <Text style={[styles.link_bottom_text, { backgroundColor: '#F0EDFF', color: '#5336E2', }]}>{item.weight}kg</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                }

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

export default ActiveOrders