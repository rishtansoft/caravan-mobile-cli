import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    Image,
    Switch,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Modal,

} from "react-native";
import axios from 'axios';
import { GetData } from '../AsyncStorage/AsyncStorage';
import { API_URL } from '@env'
import CustomSwitch from "../ui/switch/Switch";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from '@react-navigation/native';

const splitText = (text: string,): { text_1: string } => {
    const text_1 = text.slice(0, 8);
    return { text_1 };
};
import { ActiveLoadsProps } from './RouterType';

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
    cargo_type: string;
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



const HomeScreen: React.FC<ActiveLoadsProps> = ({
    navigation
}) => {
    const [user_id, setUser_id] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [resData, setResData] = useState<ResData[] | null>(null);
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<boolean>(false);
    const [inRegister, setInRegister] = useState<boolean>(false);
    const isFocused = useIsFocused();

    // Royhatdan toliq o'tgan yoki yoqligini tekshirish asnc storage bilan tekshirish
    const userRegister = true;


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

    const fetchLoadData = useCallback(() => {
        if (!token || !user_id) return;

        axios.post(`${API_URL}/api/auth//check-driver?user_id=${user_id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }).then((res) => {
            setInRegister(res.data?.success)
            if (res.data?.success) {
                axios.get(API_URL + `/api/loads/get-all-active-loads?user_id=${user_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then((res) => {
                        if (res.data?.data && res.data.data.length > 0) {
                            const resdataFileter = filterByDriverStops(res.data?.data)
                            if (resdataFileter.length > 0) {
                                const newData = resdataFileter.map((el) => ({
                                    id: el.id,
                                    cargo_type: el.cargo_type,
                                    weight: el?.weight ? el.loadDetails[0].weight : '',
                                    sub_id: splitText(el.id).text_1,
                                    start_location: filertDriverStopOrder(el.driverStops, 0),
                                    end_location: filertDriverStopOrder(el.driverStops, 1),
                                }));
                                if (newData && newData.length > 0) {
                                    setResData(newData)
                                }
                            }
                        }
                    }).catch((error) => {
                        console.log('Load data error:', error);
                    })
            }
        }).catch((error) => {
            console.log('Check driver error:', error);
        })
    }, [token, user_id]);


    useEffect(() => {
        if (isFocused) {
            fetchLoadData();
        }
    }, [isFocused, fetchLoadData]);



    useEffect(() => {
        if (token && user_id) {
            setResData(null)

            axios.post(`${API_URL}/api/auth//check-driver?user_id=${user_id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then((res) => {
                setInRegister(res.data?.success)
                if (res.data?.success) {
                    axios.get(API_URL + `/api/loads/get-all-active-loads?user_id=${user_id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                        .then((res) => {
                            if (res.data?.data && res.data.data.length > 0) {
                                const resdataFileter = filterByDriverStops(res.data?.data)
                                if (resdataFileter.length > 0) {
                                    const newData = resdataFileter.map((el) => {
                                        return {
                                            id: el.id,
                                            cargo_type: el.cargo_type,
                                            weight: el?.weight ? el.loadDetails[0].weight : '',
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
            }).catch((error) => {
                console.log(error);

            })
        }
    }, [token, user_id,],);

    useEffect(() => {
        if (token && user_id && dataUpdate) {
            axios.get(API_URL + `/api/loads/get-all-active-loads?user_id=${user_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    console.log(214, res);

                    setDataUpdate(false)
                    if (res.data?.data && res.data.data.length > 0) {
                        const resdataFileter = filterByDriverStops(res.data?.data)
                        if (resdataFileter.length > 0) {
                            const newData = resdataFileter.map((el) => {
                                return {
                                    id: el.id,
                                    cargo_type: el.cargo_type,
                                    weight: el?.weight ? el.loadDetails[0].weight : '',
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
    }, [token, user_id, dataUpdate]);

    const toggleSwitch = () => setIsSwitchOn((previousState) => !previousState);

    const toggleModal = (id: string) => {
        if (userRegister) {
            navigation.navigate('active_loads_detail', { itemId: id });//Aynan shu buyurtma malumotlarini uzatish uchun ishlatildi
        } else {
            setModalVisible(!isModalVisible);
        }
    };

    const goToHome = () => {
        setModalVisible(!isModalVisible);
    };

    const goToProfile = () => {
        setModalVisible(!isModalVisible);

        navigation.navigate('profile');
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            {
                !inRegister && <View style={styles.notificationBox}>
                    <Image
                        source={require("../../assets/driver/missing-info-register.png")}
                        style={styles.image}
                    />
                    <Text style={styles.notificationText}>
                        Ro'yxatdan o'tishni tugatish uchun, iltimos, ma'lumotlaringizni to'liq
                        to'ldiring, yana bir necha qadam qoldi! <Text onPress={() => navigation.navigate('profile_update')} style={{ color: '#7257FF', fontWeight: '600' }}>  Ro'yxatdan o'tish</Text>
                    </Text>
                </View>
            }


            <View style={styles.switchContainer}>
                <Text style={styles.switchText}>Bo'sh sifatida ko'rsatish</Text>

                <CustomSwitch
                    onValueChange={toggleSwitch}
                    value={isSwitchOn}
                    disabled={!inRegister}
                />
            </View>

            <View style={styles.orders}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 10, marginVertical: 10 }}>
                    <Text style={styles.sectionTitle}>Aktiv buyurtmalar </Text>
                    <TouchableOpacity disabled={!inRegister} onPress={() => setDataUpdate(true)}>
                        <FontAwesomeIcon
                            name="refresh" size={25} color={!inRegister ? "#898D8F" : "#7257FF"} />
                    </TouchableOpacity>
                </View>

                {resData && resData.length > 0 && resData.map((order, index) => (
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



            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
            // onRequestClose={toggleModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Image
                            source={require("../../assets/driver/missing-info-register-lg.png")}
                            style={styles.imageModal}
                        />
                        <Text style={styles.modalTitle}>Registratsiya yakunlanmagan</Text>
                        <Text style={styles.modalText}>
                            Ro'yxatdan o'tishni tugatish uchun, iltimos, ma'lumotlaringizni to'liq to'ldiring.
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.backButton} onPress={goToHome}>
                                <Text style={styles.backButtonText}>Orqaga</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.finishButton} onPress={goToProfile}>
                                <Text style={styles.finishButtonText}>Yakunlash</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    notificationBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#DADDDE",
    },
    image: {
        width: 107,
        height: 86,
        marginRight: 16,
    },
    notificationText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 18,
        color: "#333",
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#DADDDE",
    },
    switchText: {
        color: "#333",
        fontSize: 21,
        fontWeight: "700",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        marginLeft: 10,
        color: "#291F61",
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    imageModal: {
        width: 345,
        height: 250,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    backButton: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#000',
        fontSize: 16,
    },
    finishButton: {
        backgroundColor: '#4B0082',
        padding: 10,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
    },
    finishButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default HomeScreen;
