import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, Text, Platform, Alert } from 'react-native';
import MapboxGl from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import { Position, Feature, Geometry } from 'geojson';
import { MAPBOX_ACCESS_TOKEN } from '@env';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { ActiveLoadsCarProps } from './RouterType';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Octicons'; //arrow-switch
import axios from 'axios';
import { GetData } from '../AsyncStorage/AsyncStorage';
import { API_URL } from '@env';
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import EvilIcons from 'react-native-vector-icons/MaterialIcons'; // EvilIcons qo'shildi

MapboxGl.setAccessToken("pk.eyJ1IjoiaWJyb2hpbWpvbjI1IiwiYSI6ImNtMG8zYm83NzA0bDcybHIxOHlreXRyZnYifQ.7QYLNFuaTX9uaDfvV0054Q");

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
interface LocationData {
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
const filertDriverStopOrder = (arr: LocationData[], order: number) => {
    const orderFilter = arr.find((el) => el.order == order)?.location_name.split(',')
    if (orderFilter && orderFilter.length > 0) {
        const addresa = orderFilter[0]
        return addresa
    } else {
        return orderFilter?.join(' ')
    }
}
interface PositionInterface {
    longitude: number,
    latitude: number,
    address?: string
}

const SingleLocationMap: React.FC<{ latitude: number; longitude: number }> = ({ latitude, longitude }) => {
    return (
        <MapboxGl.MapView style={styles.map}>
            <MapboxGl.Camera
                zoomLevel={17}
                centerCoordinate={[longitude, latitude]}
                animationDuration={0}
            />

            <MapboxGl.PointAnnotation
                id="single-location"
                coordinate={[longitude, latitude]}
            >
                <View style={styles.singleMarkerContainer}>
                    {/* EvilIcons location ikoni */}
                    <EvilIcons
                        name="location-on"
                        size={40}
                        color="#7257FF"  // Qizil rang 
                        style={styles.locationIcon}
                    />
                </View>
                <MapboxGl.Callout title="Joriy joylashuv">
                    <View style={styles.callout}>
                        <Text style={{ color: '#291F61' }}>Latitude: {latitude}</Text>
                        <Text style={{ color: '#291F61' }}>Longitude: {longitude}</Text>
                    </View>
                </MapboxGl.Callout>
            </MapboxGl.PointAnnotation>
        </MapboxGl.MapView>
    );
};


const ActiveLoadCarLoaction: React.FC<ActiveLoadsCarProps> = ({ route, navigation }) => {
    const { itemId, data, status } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [dataUpdate, setDataUpdate] = useState<boolean>(false);
    const [user_id, setUser_id] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [locations, setLocations] = useState<Location[]>([
        {
            id: data[0].id,
            status: data[0].status,
            load_id: data[0].load_id,
            latitude: data[0].latitude,
            longitude: data[0].longitude,
            order: data[0].order,
            start_time: data[0].start_time,
            end_time: data[0].end_time,
            location_name: data[0].location_name,
            createdAt: data[0].createdAt,
            updatedAt: data[0].updatedAt,
            AssignmentId: data[0].AssignmentId
        },
        {
            id: data[1].id,
            status: data[1].status,
            load_id: data[1].load_id,
            latitude: data[1].latitude,
            longitude: data[1].longitude,
            order: data[1].order,
            start_time: data[1].start_time,
            end_time: data[1].end_time,
            location_name: data[1].location_name,
            createdAt: data[1].createdAt,
            updatedAt: data[1].updatedAt,
            AssignmentId: data[1].AssignmentId
        }
    ]);
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
            axios.get(`${API_URL}/api/driver/get-drvier-location?user_id=${user_id}&load_id=${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then((res) => {
                setLocations(res.data.locations)
                setIsLoading(false)

            }).catch((error) => {
                console.log(163, error);

            })
        }
    }, [token, user_id]);

    useEffect(() => {
        if (token && user_id && dataUpdate) {

            axios.get(`${API_URL}/api/driver/get-drvier-location?user_id=${user_id}&load_id=${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then((res) => {
                setLocations(res.data.locations)
                setDataUpdate(false);
                setIsLoading(false)

            }).catch((error) => {
                console.log(163, error);

            })
        }
    }, [token, user_id, dataUpdate]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: '#000' }}>Joylashuv aniqlanmoqda...</Text>
            </View>
        );
    }


    return (
        <View style={styles.container_all}>


            <View style={styles.header_con}>
                <View style={{
                    width: '6%'
                }}>
                    <Icon
                        onPress={() => navigation.navigate('active_loads_detail', { itemId: itemId })}
                        name="angle-left" size={30} color="#7257FF" />
                </View>
                <Text style={styles.title}>
                    Buyurtma #{itemId.slice(0, 8)}
                </Text>
                <TouchableOpacity onPress={() => {
                    setDataUpdate(true)
                    setIsLoading(true)
                }}>
                    <FontAwesomeIcon
                        name="refresh" size={25} color={"#7257FF"} />
                </TouchableOpacity>

            </View>

            <SingleLocationMap
                latitude={Number(locations[0].latitude)}
                longitude={Number(locations[0].longitude)}
            ></SingleLocationMap>

            <View style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: '#fff',

            }}>
                <View style={styles.container}>
                    {
                        data && data.length > 0 && <View style={styles.link_location_texts}>
                            <Text style={styles.link_location_text}>{filertDriverStopOrder(data, 0)}</Text>
                            <Fontisto name="arrow-switch" size={18} color="#B4A6FF" />
                            <Text style={styles.link_location_text}>{filertDriverStopOrder(data, 1)}</Text>
                        </View>
                    }


                    <View style={styles.link_bottom}>
                        <Text style={[
                            styles.link_bottom_text,
                            {
                                backgroundColor: getBgColorKey(status ?? ''),
                                color: getTextColorKey(status ?? '')
                            }
                        ]}>{getStatusText(status ?? '')}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    singleMarkerContainer: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    locationIcon: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },

    singleMarker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'red',
    },
    // callout: {
    //     padding: 10,
    //     backgroundColor: 'white',
    //     borderRadius: 5,
    // },
    container_all: {
        flex: 1,
        backgroundColor: '#e6e8ea',
        overflow: 'scroll'
    },
    container: {
        width: '100%',
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 30,
        flex: 1,
    },
    link_location_texts: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        gap: 10
    },
    link_location_text: {
        color: '#291F61',
        fontWeight: '700',
        fontSize: 24,

    },

    link_bottom: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center'
        gap: 15

    },

    link_bottom_text: {
        paddingVertical: 4,
        paddingHorizontal: 5,
        fontSize: 15,
        borderRadius: 5,

    },

    header_con: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        justifyContent: 'space-between',
        borderBottomRightRadius: 20,
        width: "100%",
        paddingHorizontal: 20
    },
    title: {
        color: '#131214',
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 100,
        width: '90%',
        fontWeight: '600',
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    markerText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    routeLine: {

    },
    timeContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        zIndex: 1,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    timeText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
    },
    callout: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        minWidth: 120,
    },
    calloutText: {
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ffcdd2',
    },
    errorText: {
        color: '#c62828',
        textAlign: 'center',
    },
});

export default ActiveLoadCarLoaction;