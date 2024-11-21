import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    RefreshControl
} from "react-native";
import axios from "axios";
import { GetData } from "../AsyncStorage/AsyncStorage";
import { API_URL } from "@env";
import Icon from "react-native-vector-icons/FontAwesome";
import { HistoryProps } from './RouterType';
import { useIsFocused } from '@react-navigation/native';

const splitText = (text: string): { text_1: string } => {
    const text_1 = text.slice(0, 8);
    return { text_1 };
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
    load_id: string;
    loadDetails: any | null;
    load_status: string;
    user_id: string;
    weight: string;
}

const getStatusText = (key: string): string => {
    switch (key) {
        case "posted":
            return "Qidirilmoqda";
        case "assigned":
            return "Yukni olishga kelmoqda";
        case "picked_up":
            return "Yuk ortilmoqda";
        case "in_transit":
            return "Yo'lda";
        case "delivered":
            return "Manzilga yetib bordi";
        case "Tushirilmoqda":
            return "#FFEFB3";
        case "Yakunlangan":
            return "#D7F5E5";
        default:
            return "#F0EDFF"; // Default rang
    }
};

interface ResData {
    id: string;
    cargo_type: string;
    weight: string;
    sub_id: string;
    start_location: string | undefined;
    end_location: string | undefined;
}

const filertDriverStopOrder = (arr: DriverStop[], order: number) => {
    const orderFilter = arr
        .find((el) => el.order == order)
        ?.location_name.split(",");
    if (orderFilter && orderFilter.length > 0) {
        const addresa = orderFilter[0];
        return addresa;
    } else {
        return orderFilter?.join(" ");
    }
};

const filterByDriverStops = (cargos: Cargo[]): Cargo[] => {
    return cargos.filter(
        (cargo) => cargo.driverStops && cargo.driverStops.length > 0
    );
};

const LoadHistory: React.FC<HistoryProps> = ({
    navigation
}) => {
    const [user_id, setUser_id] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [resData, setResData] = useState<ResData[] | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const isFocused = useIsFocused();
    const [refreshing, setRefreshing] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<boolean>(false);

    // Royhatdan toliq o'tgan yoki yoqligini tekshirish asnc storage bilan tekshirish
    const userRegister = true;

    useEffect(() => {
        GetData("user_id")
            .then((res) => {
                if (res) {
                    setUser_id(res);
                }
            })
            .catch((error) => {
                console.error("Xatolik yuz berdi:", error);
            });
        GetData("token")
            .then((res) => {
                if (res) {
                    setToken(res);
                }
            })
            .catch((error) => {
                console.error("Xatolik yuz berdi:", error);
            });
    }, []);


    const fetchLoadData = useCallback(() => {
        if (!token || !user_id) return;
        axios
            .get(API_URL + `/api/loads/get-driver-loads?user_id=${user_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {

                if (res.data?.data && res.data.data.length > 0) {
                    const resdataFileter = filterByDriverStops(res.data?.data);

                    if (resdataFileter.length > 0) {

                        const newData = resdataFileter.map((el) => {
                            console.log(111, el.load_id);

                            return {
                                id: el.load_id,
                                cargo_type: getStatusText(el.load_status),
                                weight: el?.weight ? el?.weight : "",
                                sub_id: splitText(el.load_id).text_1,
                                start_location: filertDriverStopOrder(el.driverStops, 0),
                                end_location: filertDriverStopOrder(el.driverStops, 1),
                            };
                        });
                        if (newData && newData.length > 0) {
                            console.log(122, newData);

                            setResData(newData);
                        }
                    }
                }
            })
            .catch((error) => {
                console.log(132, error);
            });

    }, [token, user_id]);


    useEffect(() => {
        if (isFocused) {
            fetchLoadData();
        }
    }, [isFocused, fetchLoadData]);

    useEffect(() => {
        if (token && user_id && dataUpdate) {
            if (!token || !user_id) return;
            axios
                .get(API_URL + `/api/loads/get-driver-loads?user_id=${user_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setDataUpdate(false)
                    if (res.data?.data && res.data.data.length > 0) {
                        const resdataFileter = filterByDriverStops(res.data?.data);

                        if (resdataFileter.length > 0) {

                            const newData = resdataFileter.map((el) => {
                                console.log(111, el.load_id);

                                return {
                                    id: el.load_id,
                                    cargo_type: getStatusText(el.load_status),
                                    weight: el?.weight ? el?.weight : "",
                                    sub_id: splitText(el.load_id).text_1,
                                    start_location: filertDriverStopOrder(el.driverStops, 0),
                                    end_location: filertDriverStopOrder(el.driverStops, 1),
                                };
                            });
                            if (newData && newData.length > 0) {
                                console.log(122, newData);

                                setResData(newData);
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log(132, error);
                });
        }
    }, [dataUpdate]);




    const toggleModal = (id: string) => {
        if (userRegister) {
            navigation.navigate("history_detail", { itemId: id }); //Aynan shu buyurtma malumotlarini uzatish uchun ishlatildi
        } else {
            setModalVisible(!isModalVisible);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true); // Yangilanishni boshlash
        setTimeout(() => {
            setRefreshing(false); // Yangilanishni tugatish
            setDataUpdate(true);
        }, 2000); // 2 soniyadan keyin tugatadi
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
                    colors={['#5336E2', '#5336E2', '#5336E2']}

                />
            }
        >
            <View style={styles.orders}>
                <View style={[styles.header_con, { marginBottom: 15 }]}>
                    <View
                        style={{
                            width: "6%",
                        }}
                    >
                        <Icon
                            onPress={() => navigation.navigate('active_loads')}
                            name="angle-left"
                            size={30}
                            color="#7257FF"
                        />
                    </View>
                    <View style={styles.title_cont}>
                        <Text style={styles.title}>
                            Buyurtmalar Tarixi
                        </Text>
                    </View>
                </View>
                {resData &&
                    resData.length > 0 &&
                    resData.map((order, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.order}
                            onPress={() => toggleModal(order.id)}
                        >
                            <View style={styles.orderCard}>
                                <View style={styles.orderDetails}>
                                    <Text style={styles.location}>{order.start_location}</Text>
                                    <Image source={require("../../assets/driver/referrer.png")} />
                                    <Text style={styles.location}>{order.end_location}</Text>
                                </View>
                                <View>
                                    <Text style={styles.orderNo}>#{order.sub_id}</Text>
                                </View>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.infoCategory}>{order.cargo_type}</Text>
                                <Text style={styles.infoCategory}>{order.weight}kg</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 16,
        backgroundColor: "#F4F6F7",
    },

    orders: {
        flexDirection: "column",
        marginBottom: 80,
    },
    order: {
        flexDirection: "column",
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#DADDDE",
    },
    orderCard: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    orderDetails: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    location: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#291F61",
    },
    info: {
        marginTop: 10,
        flexDirection: "row",
        gap: 8,
    },
    infoCategory: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: "#F0EDFF",
        borderRadius: 8,
        color: "#5336E2",
    },
    orderNo: {
        color: "#898D8F",
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    backButton: {
        backgroundColor: "#e0e0e0",
        padding: 10,
        borderRadius: 10,
        width: "45%",
        alignItems: "center",
    },
    backButtonText: {
        color: "#000",
        fontSize: 16,
    },
    finishButton: {
        backgroundColor: "#4B0082",
        padding: 10,
        borderRadius: 10,
        width: "45%",
        alignItems: "center",
    },
    finishButtonText: {
        color: "white",
        fontSize: 16,
    },
    header_con: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        width: "100%",
        paddingHorizontal: 15,
        paddingVertical: 15,
        height: "auto",
        gap: 50
    },
    title: {
        color: "#131214",
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        paddingHorizontal: 10,
    },
    title_cont: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },

});

export default LoadHistory;
