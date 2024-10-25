import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { AddLoadSecondProps } from './RouterType';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AddCargoForm from '../ui/AddCargoForm/AddCargoForm';

const AddLoadSecond: React.FC<AddLoadSecondProps> = ({ navigation }) => {


    return (
        <SafeAreaView style={styles.container_all}>
            {/* Header */}
            <View style={styles.header_con}>
                <View style={{ width: '6%' }}>
                    <Icon
                        onPress={() => navigation.navigate('add_loads')}
                        name="angle-left"
                        size={30}
                        color="#7257FF"
                    />
                </View>
                <Icon
                    onPress={() => navigation.navigate('add_load_third')}
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
                {/* <ScrollView */}
                {/* style={styles.scroll_con} */}
                {/* contentContainerStyle={styles.scrollContent} */}
                {/* > */}
                <View style={styles.container}>
                    <AddCargoForm onSubmit={(data) => {
                        console.log(data);
                        // Form ma'lumotlarini qayta ishlash
                    }} />
                </View>
                {/* </ScrollView> */}

                {/* Bottom Buttons */}
                <View style={styles.bottom_btns}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => navigation.navigate("home")}
                    >
                        <Feather name="x" size={24} color="#131214" />
                        <Text style={styles.cancelButtonText}>Bekor qilish</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.continueButton]}
                        onPress={() => navigation.navigate('add_load_third')}
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
        width: '55%',
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

export default AddLoadSecond;