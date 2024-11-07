import React, { useEffect, useState } from 'react';
import {
    View, Text,
    TouchableOpacity, StyleSheet,
    SafeAreaView,
    Alert,
} from 'react-native';
import { AddLoadThirdProps } from './RouterType';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AddReceiverForm from '../ui/AddReceiverForm/AddReceiverForm';
import { StoreData, GetData, RemoveData } from '../AsyncStorage/AsyncStorage';
import { API_URL } from '@env';
import axios from 'axios';

const showErrorAlert = (message: string) => {
    Alert.alert('Xatolik', message, [{ text: 'OK', onPress: () => console.log('OK bosildi') }]);
};

interface LoadData {
    cargoType: { label: string; value: string };
    loadingTime: string;
    vehicleType: { label: string; value: string };
    weight: string;
}

interface LocationData {
    start_location: {
        latitude: number;
        longitude: number;
        name: string;
    };
    end_location: {
        latitude: number;
        longitude: number;
        name: string;
    };
    stop_location: {
        latitude: number;
        longitude: number;
        name: string;
        order: number;
    }[];
}


const AddLoadThird: React.FC<AddLoadThirdProps> = ({ navigation }) => {
    const [phone, setPhone] = useState('');
    const [payer, setPayer] = useState<'sender' | 'receiver'>('sender');
    const [roundTrip, setRoundTrip] = useState(false);
    const [comment, setComment] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const [payerError, setPayerError] = useState(false);
    const [roundTripError, setRoundTripError] = useState(false);
    const [commentError, setCommentError] = useState(false);
    const [user_id, setUser_id] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [loactions, setLoactions] = useState<LocationData | null>(null);
    const [loadData, setLoadData] = useState<LoadData | null>(null);
    useEffect(() => {
        GetData('user_id').then((res) => {
            if (res) {
                // console.log(44, JSON.parse(res).user_id);
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

        GetData('new_load_1').then((res) => {
            if (res) {
                console.log(54, JSON.parse(res));
                setLoactions(JSON.parse(res))
                // setToken(res)
            }
        }).catch((error) => {
            console.error('Xatolik yuz berdi:', error);
        });
        GetData('new_load_2').then((res) => {
            if (res) {
                console.log(63, JSON.parse(res));
                setLoadData(JSON.parse(res))
                // setToken(res)
            }
        }).catch((error) => {
            console.error('Xatolik yuz berdi:', error);
        });


    }, []);

    const removeNewLoad = async () => {
        await RemoveData('new_load_1')
        await RemoveData('new_load_2')
        await RemoveData('new_load_3')
        navigation.navigate("home")
    }


    const phoneValidateFun = (value: string) => {
        const phoneRegex = /^998\d{9}$/; // +998xxxxxxxxx phone format
        if (value && phoneRegex.test(value)) {
            return true;
        } else {
            return false;
        }
    };

    const handleSubmit = async () => {
        if (phone && phoneValidateFun(phone) && payer && comment) {
            if (user_id && token && loactions && loadData) {
                const stop_locations = loactions.stop_location.length > 0 ? loactions.stop_location.map((el) => {
                    return {
                        "address": el.name,
                        "lat": el.latitude,
                        "lon": el.longitude,
                        "order": el.order,
                    }
                }) : []

                const resData = {
                    user_id: user_id,
                    name: `Yuk- ${new Date()}`,
                    cargo_type: loadData.cargoType.value,
                    receiver_phone: '+' + phone,
                    payer: payer,
                    description: comment ? comment : '',
                    origin_location: {
                        "address": loactions.start_location.name,
                        "lat": loactions.start_location.latitude,
                        "lon": loactions.start_location.longitude
                    },
                    destination_location: {
                        "address": loactions.end_location.name,
                        "lat": loactions.end_location.latitude,
                        "lon": loactions.end_location.longitude
                    },
                    stop_locations: stop_locations,
                    weight: loadData.weight,
                    car_type_id: loadData.vehicleType.value,
                    loading_time: loadData.loadingTime,
                    is_round_trip: roundTrip,
                    "length": 2,
                    "width": 1,
                    "height": 1,
                }
                console.log(156, resData);
                console.log(157, stop_locations);

                axios.post(API_URL + '/api/loads/create', resData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((res) => {
                    console.log(res.data);
                    navigation.navigate("home")
                }).catch((error) => {
                    console.log(error?.response?.data?.message);
                    showErrorAlert(error?.response?.data?.message ? error?.response?.data?.message : error)
                })
            }
        } else {
            if (!phone) {
                setPhoneError(true);
            } else if (!phoneValidateFun(phone)) {
                setPhoneError(true);
            } else {
                setPhoneError(false);
            }
            if (!comment) {
                setCommentError(true)
            } else {
                setCommentError(false)
            }
        }
    };



    return (
        <SafeAreaView style={styles.container_all}>
            {/* Header */}
            <View style={styles.header_con}>
                <View style={{ width: '6%' }}>
                    <Icon
                        onPress={() => navigation.navigate('add_load_second')}
                        name="angle-left"
                        size={30}
                        color="#7257FF"
                    />
                </View>
                <Icon
                    onPress={handleSubmit}
                    name="angle-right"
                    size={30}
                    color="#7257FF"
                />
            </View>

            {/* Progress Bar */}
            <View style={styles.header_con}>
                <View style={styles.prosent_con}>
                    <View style={styles.prosent}></View>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content_container}>
                <View style={styles.container}>
                    <AddReceiverForm
                        phone={phone}
                        payer={payer}
                        roundTrip={roundTrip}
                        comment={comment}
                        phoneError={phoneError}
                        payerError={payerError}
                        roundTripError={roundTripError}
                        commentError={commentError}
                        onPhoneChange={setPhone}
                        onPayerChange={setPayer}
                        onRoundTripChange={setRoundTrip}
                        onCommentChange={setComment}
                    />
                </View>

                {/* Bottom Buttons */}
                <View style={styles.bottom_btns}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={removeNewLoad}
                    >
                        <Feather name="x" size={24} color="#131214" />
                        <Text style={styles.cancelButtonText}>Bekor qilish</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.continueButton]}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.continueButtonText}>Davom etish</Text>
                        <AntDesign name="arrowright" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container_all: {
        flex: 1,
        backgroundColor: '#F4F6F7',
    },
    content_container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    prosent_con: {
        width: '100%',
        height: 4,
        backgroundColor: '#E6E9EB',
        borderRadius: 5
    },
    prosent: {
        width: '85%',
        height: 4,
        borderRadius: 5,
        backgroundColor: '#7257FF'
    },
    header_con: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: "100%",
        paddingHorizontal: 15,
        paddingVertical: 15,
        justifyContent: 'space-between',
    },
    input: {
        borderColor: '#E6E9EB',
        width: '100%',
        borderWidth: 1,
        color: '#131214',
        borderRadius: 8,
        paddingLeft: 15,
    },
    inputFocus: {
        borderColor: '#7257FF',
        width: '100%',
        borderWidth: 2,
        color: '#131214',
        borderRadius: 8,
        paddingLeft: 15,
        shadowColor: '#7257FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 1,
    },

    errorText: {
        color: 'red',
        marginTop: 6,
        lineHeight: 14,
    },

    scroll_con: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    bottom_btns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20, // Pastdan masofani kamaytirdik
        paddingTop: 12, // Yuqoridan masofani kamaytirdik
        // marginBottom: 40, // Ekran pastidan masofani sozladik
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        flex: 0.48,
    },
    cancelButton: {
        backgroundColor: '#E8EBEB',
    },
    continueButton: {
        backgroundColor: '#7257FF',
    },
    cancelButtonText: {
        color: '#131214',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '500',
    },
    continueButtonText: {
        color: '#FFFFFF',
        marginRight: 8,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default AddLoadThird;