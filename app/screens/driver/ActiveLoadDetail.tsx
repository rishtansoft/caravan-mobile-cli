import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconFoundation from "react-native-vector-icons/Foundation";
import Fontisto from "react-native-vector-icons/Octicons"; //arrow-switch
import FeatherIcons from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { GetData } from "../AsyncStorage/AsyncStorage";
import { API_URL } from "@env";
import { ActiveLoadsDetailProps } from "./RouterType";
import { useIsFocused } from '@react-navigation/native';


interface Main {
    id: string;
    status: string;
    user_id: string;
    name: string;
    cargo_type: string;
    receiver_phone: string;
    payer: string;
    description: string;
    load_status: string;
    createdAt: string;
    updatedAt: string;
    UserId: string | null;
}

interface Location {
    id: string;
    status: string;
    load_id: string;
    latitude: string;
    longitude: string;
    order: number;
    start_time: string | null;
    end_time: string | null;
    location_name: string;
    createdAt: string;
    updatedAt: string;
    AssignmentId: string | null;
}

interface CarType {
    name: string;
}

interface LoadDetail {
    id: string;
    status: string;
    load_id: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    car_type_id: string;
    loading_time: string;
    createdAt: string;
    updatedAt: string;
    CarType: CarType;
}

interface Result {
    main: Main;
    locations: Location[];
    loadDetails: LoadDetail[];
}
interface StopoverAddress {
    stopover_address: string | undefined;
}

interface CargoDetails {
    start_address: string | undefined;
    stopover_address: StopoverAddress[] | undefined;
    end_address: string | undefined;
}

interface VehicleDetails {
    license_plate: string;
    type: string;
}

interface CargoInfo {
    status: string;
    start_location: string | undefined;
    end_location: string | undefined;
    cargo_details: CargoDetails;
    vehicle_details: VehicleDetails;
    cargo_type: string;
    cargo_weight: number;
    loading_time: string;
    receiver_phone: string;
    payer: string;
    round_trip: string;
    order_comment: string;
}

const getBgColorKey = (key: string): string => {
    switch (key) {
        case "posted":
            return "#F0EDFF";
        case "assigned":
            return "#E5F0FF";
        case "picked_up":
            return "#FFEFB3";
        case "in_transit":
            return "#FFE9D1";
        case "delivered":
            return "#D7F5E5";
        case "Tushirilmoqda":
            return "#FFEFB3";
        case "Yakunlangan":
            return "#D7F5E5";
        default:
            return "#F0EDFF"; // Default rang
    }
};
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
const getTextColorKey = (key: string): string => {
    switch (key) {
        case "posted":
            return "#5336E2";
        case "assigned":
            return "#0050C7";
        case "picked_up":
            return "#B26205";
        case "in_transit":
            return "#E28F36";
        case "delivered":
            return "#006341";
        case "Tushirilmoqda":
            return "#B26205";
        case "Yakunlangan":
            return "#006341";
        default:
            return "#5336E2"; // Default rang
    }
};
const splitText = (text: string): { text_1: string } => {
    const text_1 = text.slice(0, 8);
    return { text_1 };
};
const filertDriverStopOrder = (arr: Location[], order: number) => {
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

const filertDriverStopOrderTextFull = (arr: Location[], order: number) => {
    const orderFilter = arr.find((el) => el.order == order)?.location_name;
    return orderFilter;
};

const ActiveLoadDetail: React.FC<ActiveLoadsDetailProps> = ({
    navigation,
    route,
}) => {
    const { itemId } = route.params;
    const [user_id, setUser_id] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [result, setResult] = useState<CargoInfo | null>(null);
    const [locations, setLocations] = useState<Location[] | null>(null);
    const isFocused = useIsFocused();

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

    useEffect(() => {
        if (token && user_id) {
            axios
                .post(
                    API_URL + `/api/loads/details?load_id=${itemId}`,
                    {
                        user_id: user_id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((res) => {

                    if (res.data?.result) {
                        const resData: Result = res.data.result;
                        const stopLoaction =
                            resData.locations.length > 2 &&
                            resData.locations
                                .filter((el) => el.order != 0 && el.order != 1)
                                .map((el) => {
                                    return {
                                        stopover_address: filertDriverStopOrderTextFull(
                                            resData.locations,
                                            el.order
                                        ),
                                    };
                                });
                        setLocations(resData.locations);
                        const newData: CargoInfo = {
                            status: resData.main.load_status,
                            start_location: filertDriverStopOrder(resData.locations, 0),
                            end_location: filertDriverStopOrder(resData.locations, 1),
                            cargo_type: resData.main.cargo_type,
                            cargo_weight: resData?.loadDetails[0]?.weight,
                            loading_time: resData?.loadDetails[0]?.loading_time,
                            receiver_phone: resData.main.receiver_phone,
                            payer: resData.main.payer,
                            order_comment: resData.main.description,
                            cargo_details: {
                                start_address: filertDriverStopOrderTextFull(
                                    resData.locations,
                                    0
                                ),
                                stopover_address:
                                    resData.locations.length > 2 &&
                                        stopLoaction &&
                                        stopLoaction.length > 0
                                        ? stopLoaction
                                        : [],
                                end_address: filertDriverStopOrderTextFull(
                                    resData.locations,
                                    1
                                ),
                            },
                            vehicle_details: {
                                license_plate: "60A125BA",
                                type: resData?.loadDetails[0]?.CarType.name,
                            },
                            round_trip: "Ha",
                        };
                        if (newData) {
                            setResult(newData);
                        }
                    }
                })
                .catch((error) => {
                    console.log(132, error);
                });
        }
    }, [token, user_id]);

    const deleteFun = () => { };

    const assignLoadToDriver = () => {
        if (user_id && itemId && locations) {
            axios.post(API_URL + `/api/loads/assign-load`, { user_id: user_id, load_id: itemId }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    console.log(325, response.data);
                    if (response.data.message == "Load successfully assigned to driver") {
                        navigation.navigate('active_loads_map', {
                            itemId: itemId,
                            data: locations,
                            status: result?.status
                        })
                    } else {
                        Alert.alert('Hatolik', "Cannot assign load to driver")
                    }
                })
                .catch(err => {
                    console.log("Error assign load to driver", err);
                    Alert.alert('Hatolik', "Cannot assign load to driver")
                })
        }

    }

    return (
        <View style={styles.container_all}>
            <View style={styles.header_con}>
                <View
                    style={{
                        width: "6%",
                    }}
                >
                    <Icon
                        onPress={() => navigation.goBack()}
                        name="angle-left"
                        size={30}
                        color="#7257FF"
                    />
                </View>
                <View style={styles.title_cont}>
                    <Text style={styles.title}>Buyurtma #{splitText(itemId).text_1}</Text>
                </View>
                {locations && <IconFoundation
                    onPress={() =>
                        navigation.navigate('active_loads_map', {
                            itemId: itemId,
                            data: locations,
                            status: result?.status
                        })
                    }
                    name="map"
                    size={30}
                    color="#7257FF"
                />
                }

            </View>
            {result && (
                <ScrollView style={{ flex: 1, paddingBottom: 10 }}>
                    <View style={styles.container}>
                        <View style={styles.link_location_texts}>
                            <Text style={styles.link_location_text}>
                                {result.start_location}
                            </Text>
                            <Fontisto name="arrow-switch" size={18} color="#B4A6FF" />
                            <Text style={styles.link_location_text}>
                                {result.end_location}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.content}>
                            <View>
                                <FeatherIcons name="map-pin" size={20} color="#131214" />
                            </View>
                            <View style={styles.content_text_container}>
                                <Text style={styles.content_text_top}>Yuk manzili</Text>
                                <Text style={styles.content_text_bottom} numberOfLines={2}>
                                    {result.cargo_details.start_address}
                                </Text>
                            </View>
                        </View>
                        {result.cargo_details.stopover_address?.map((el, index) => (
                            <View key={index} style={styles.content}>
                                <View>
                                    <MaterialCommunityIcons
                                        name="map-marker-plus-outline"
                                        size={25}
                                        color="#131214"
                                    />
                                </View>
                                <View style={styles.content_text_container}>
                                    <Text style={styles.content_text_top}>To'xtab o'tish</Text>
                                    <Text style={styles.content_text_bottom} numberOfLines={2}>
                                        {el.stopover_address}
                                    </Text>
                                </View>
                            </View>
                        ))}

                        <View style={styles.content}>
                            <View>
                                <MaterialCommunityIcons
                                    name="map-marker-check-outline"
                                    size={26}
                                    color="#131214"
                                />
                            </View>
                            <View style={styles.content_text_container}>
                                <Text style={styles.content_text_top}>Yetkazish manzili</Text>
                                <Text style={styles.content_text_bottom} numberOfLines={2}>
                                    {result.cargo_details.end_address}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.container}>
                        {/* <View style={styles.content}>
                            <View>
                                <Ionicons
                                    name="car-outline" size={25} color="#131214" />
                            </View>
                            <View style={styles.content_text_container}>
                                <Text style={styles.content_text_top}>Mashina raqami</Text>
                                <Text style={[styles.content_text_bottom, { color: '#5336E2' }]} numberOfLines={2}>
                                    {result.vehicle_details.license_plate}
                                </Text>
                            </View>
                        </View> */}
                        <View style={styles.content}>
                            <View>
                                <Ionicons name="cube-outline" size={23} color="#131214" />
                            </View>
                            <View style={styles.content_text_container}>
                                <Text style={styles.content_text_top}>Yuk turi</Text>
                                <Text style={styles.content_text_bottom} numberOfLines={2}>
                                    {result.cargo_type}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.content}>
                            <View>
                                <Ionicons name="scale-outline" size={23} color="#131214" />
                            </View>
                            <View style={styles.content_text_container}>
                                <Text style={styles.content_text_top}>Yuk vazni</Text>
                                <Text style={styles.content_text_bottom} numberOfLines={2}>
                                    {result.cargo_weight}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.content}>
                            <View>
                                <Ionicons name="time-outline" size={23} color="#131214" />
                            </View>
                            <View style={styles.content_text_container}>
                                <Text style={styles.content_text_top}>Yuklash vaqti</Text>
                                <Text style={styles.content_text_bottom} numberOfLines={2}>
                                    {result.loading_time}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.content}>
                            <View>
                                <FeatherIcons name="truck" size={23} color="#131214" />
                            </View>
                            <View style={styles.content_text_container}>
                                <Text style={styles.content_text_top}>Mashina turi</Text>
                                <Text style={styles.content_text_bottom} numberOfLines={2}>
                                    {result.vehicle_details.type}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.content}>
                            <View>
                                <FeatherIcons name="phone-call" size={20} color="#131214" />
                            </View>
                            <View style={styles.content_text_container}>
                                <Text style={styles.content_text_top}>
                                    Qabul qiluvchining telefon raqami
                                </Text>
                                <Text style={styles.content_text_bottom} numberOfLines={2}>
                                    {result.receiver_phone}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.content}>
                            <View>
                                <Ionicons name="logo-usd" size={20} color="#131214" />
                            </View>
                            <View style={styles.content_text_container}>
                                <Text style={styles.content_text_top}>Kim to'laydi</Text>
                                <Text style={styles.content_text_bottom} numberOfLines={2}>
                                    {result.payer}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.content}>
                            <View>
                                <Fontisto name="arrow-switch" size={20} color="#131214" />
                            </View>
                            <View style={styles.content_text_container}>
                                <Text style={styles.content_text_top}>Borib qaytish</Text>
                                <Text style={styles.content_text_bottom} numberOfLines={2}>
                                    {result.round_trip}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.content}>
                            <View>
                                <MaterialCommunityIcons
                                    name="message-reply-text-outline"
                                    size={20}
                                    color="#131214"
                                />
                            </View>
                            <View style={styles.content_text_container}>
                                <Text style={styles.content_text_top}>
                                    Buyurtma uchun sharh
                                </Text>
                                <Text style={styles.content_text_bottom} numberOfLines={2}>
                                    {result.order_comment}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {
                        locations && <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('active_loads_map', {
                                    itemId: itemId,
                                    data: locations,
                                    status: result.status
                                })
                            }
                            style={[
                                styles.btn,
                                { backgroundColor: "#E8EBEB", marginBottom: 20 },
                            ]}
                        >
                            <Text style={[styles.btn_text, { color: "#131214" }]}>
                                Xaritada korish
                            </Text>
                            <IconFoundation name="map" size={25} color="#000" />
                        </TouchableOpacity>
                    }
                    <TouchableOpacity
                        onPress={assignLoadToDriver}
                        style={[styles.btn, { backgroundColor: "#7257FF", marginBottom: 20 }]}
                    >
                        <Text style={[styles.btn_text, { color: "#fff" }]}>
                            Yukni olish
                        </Text>
                        <FeatherIcons name="box" size={25} color="#fff" />

                    </TouchableOpacity>

                </ScrollView>
            )}

            <View style={{ marginTop: 65 }}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container_all: {
        flex: 1,
        backgroundColor: "#F4F6F7",
        overflow: "scroll",
    },
    container: {
        backgroundColor: "#ffffff",
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: 10,
        marginHorizontal: 10,
        flex: 1,
        borderRadius: 10,
        height: "auto",
    },

    header_con: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        width: "100%",
        paddingHorizontal: 15,
        paddingVertical: 15,
        justifyContent: "space-between",
        height: "auto",
    },

    link_location_texts: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    link_location_text: {
        color: "#291F61",
        fontWeight: "700",
        fontSize: 24,
    },

    title: {
        color: "#131214",
        fontSize: 20,
        lineHeight: 10,
        fontWeight: "600",
        textAlign: "center",
        paddingTop: 40,
        paddingHorizontal: 10,
    },
    title_cont: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    link_bottom: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    link_bottom_text: {
        paddingVertical: 4,
        paddingHorizontal: 5,
        fontSize: 15,
        borderRadius: 5,
    },
    content: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 15,
        marginTop: 5,
        paddingRight: 10, // Add padding to prevent text from touching the edge
    },

    content_text_container: {
        flex: 1, // Take remaining space
    },

    content_text_top: {
        color: "#6E7375",
        fontSize: 16,
    },

    content_text_bottom: {
        color: "#131214",
        fontSize: 20,
        fontWeight: "600",
        flexWrap: "wrap", // Enable text wrapping
    },
    btn: {
        paddingHorizontal: 10,
        paddingVertical: 14,
        marginTop: 5,
        marginHorizontal: 10,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 15,
        borderRadius: 20,
    },
    btn_text: {
        textAlign: "center",
        fontSize: 16,
    },
});

export default ActiveLoadDetail;
