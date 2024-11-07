import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
// import { ProfileProps } from "./RouterType";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { handleLogout } from "../../store/Logout";
import CustomSwitch from "../ui/switch/Switch";
import LanguageSelector from "../ui/Languch/LanguageSelector";
import axios from "axios";
import { GetData } from "../AsyncStorage/AsyncStorage";
import { API_URL } from "@env";
const showErrorAlert = (message: string) => {
    Alert.alert('Xatolik', message, [{ text: 'OK', onPress: () => console.log('OK bosildi') }]);
};

const DriverProfile: React.FC = (
    { navigation }
) => {
    const [nightMode, setNightMode] = useState<boolean>(false);
    const [bacFonFun, setBacFonFun] = useState<boolean>(true);
    const [currentLanguage, setCurrentLanguage] = useState("uz");
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [user_id, setUser_id] = useState<string>('');
    const [token, setToken] = useState<string>('');

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
    }, []);

    useEffect(() => {
        if (user_id && token) {
            axios.get(API_URL + `/api/auth/get-profile?user_id=${user_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                setFirstname(res.data.firstname)
                setLastname(res.data.lastname)
                setPhone(res.data.phone)

            }).catch((error) => {
                console.log(76, error);

                // showErrorAlert(error?.response?.data?.message)
            })
        }

    }, [user_id, token]);


    const handleLanguageChange = (languageCode: string) => {
        setCurrentLanguage(languageCode);
        // Bu yerda til o'zgarganda kerakli logikani yozish mumkin
        // Masalan: i18n configuratsiyasi, AsyncStorage'ga saqlash va h.k.
    };
    const logoutFun = async () => {
        await handleLogout();
    };
    const NavigateTermsAndCondition = () => {
        navigation.navigate("TermsAndCondition");
    };
    const ProfileEdit = () => {
        navigation.navigate("DriverProfileEdit")
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
                        // onPress={() => navigation.navigate("home")}
                        name="angle-left"
                        size={30}
                        color="#7257FF"
                    />
                </View>
                <Text style={styles.title}>Shaxsiy ma'lumotlar</Text>
            </View>
            <ScrollView style={{ flexGrow: 1, marginBottom: 60 }}>
                <View style={styles.container}>
                    <View style={styles.profileContainer}>
                        <Image
                            source={require("../../assets/img/owner/user.png")}
                            style={styles.profileImage}
                        />
                        <View>
                            <Text style={styles.profileName}>{firstname} {lastname}</Text>
                            {/* <TouchableOpacity onPress={() => Linking.openURL('tel:+998998427979')}> */}
                            <Text style={styles.profilePhone}>{phone}</Text>
                            {/* </TouchableOpacity> */}
                        </View>
                    </View>
                    <TouchableOpacity style={styles.editButton} onPress={ProfileEdit}>
                        <Text style={styles.editButtonText}>Ma'lumotlarni tahrirlash</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.container, { marginTop: 10 }]}>
                    <Text style={styles.setting_title}>Sozlamalar</Text>
                    <LanguageSelector
                        selectedLanguage={currentLanguage}
                        onSelectLanguage={handleLanguageChange}
                    />
                    <View style={styles.setting}>
                        <View style={styles.setting_left}>
                            <Icon name="moon-o" size={24} color="#131214" />
                            <Text style={styles.setting_text}>Tungi rejim</Text>
                        </View>
                        <CustomSwitch value={nightMode} onValueChange={setNightMode} />
                    </View>

                    <View style={styles.setting}>
                        <View style={styles.setting_left}>
                            <Ionicons name="copy-outline" size={20} color="#131214" />
                            <Text style={styles.setting_text}>Orqa fonda ishlash</Text>
                        </View>
                        <CustomSwitch value={bacFonFun} onValueChange={setBacFonFun} />
                    </View>
                    <TouchableOpacity style={styles.setting} onPress={NavigateTermsAndCondition}>

                        <View style={styles.setting_left}>
                            <Icon name="file-text-o" size={24} color="#131214" />
                            <Text style={styles.setting_text}>Foydalanish shartlari</Text>
                        </View>
                        <Icon name="angle-right" size={24} color="#131214" />
                    </TouchableOpacity>
                </View>
                <View style={[styles.container, { marginTop: 10 }]}>
                    <TouchableOpacity onPress={logoutFun} style={styles.exit_btn}>
                        <View style={styles.exit_btn_left}>
                            <Ionicons
                                // onPress={() => navigation.navigate('home')}
                                name="exit-outline"
                                size={24}
                                color="#DB340B"
                            />
                            <Text style={styles.exit_btn_text}>Chiqish</Text>
                        </View>

                        <Icon
                            // onPress={() => navigation.navigate("home")}
                            name="angle-right"
                            size={24}
                            color="#DB340B"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={logoutFun} style={styles.exit_btn}>
                        <View style={styles.exit_btn_left}>
                            <Ionicons name="exit-outline" size={24} color="#DB340B" />
                            <Text style={styles.exit_btn_text}>Akkountni o'chirish</Text>
                        </View>
                        <Icon
                            // onPress={() => navigation.navigate('home')}
                            name="angle-right"
                            size={24}
                            color="#DB340B"
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container_all: {
        flex: 1,
        backgroundColor: "#e6e8ea",
    },
    container: {
        width: "100%",
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        paddingVertical: 10,
        height: "auto",
    },
    header_con: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        width: "100%",
        paddingLeft: 15,
    },
    title: {
        color: "#131214",
        textAlign: "center",
        fontSize: 20,
        lineHeight: 100,
        width: "90%",
        fontWeight: "600",
    },
    profileContainer: {
        alignItems: "center",
        marginBottom: 20,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#fff",
        gap: 20,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 50,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 26,
        fontWeight: "bold",
        color: "black",
        marginBottom: 3,
    },
    profilePhone: {
        fontSize: 16,
        color: "#131214",
    },
    editButton: {
        alignItems: "center",
        backgroundColor: "#F0EDFF",
        padding: 10,
        borderRadius: 20,
        marginVertical: 10,
    },
    editButtonText: {
        color: "#5336E2",
        fontSize: 16,
        fontWeight: "600",
    },
    exit_btn: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        justifyContent: "space-between",
        paddingVertical: 10,
    },
    exit_btn_text: {
        color: "#DB340B",
        fontSize: 16,
        fontWeight: "600",
    },
    exit_btn_left: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
    },
    setting_title: {
        color: "#131214",
        fontSize: 19,
        fontWeight: "600",
        marginBottom: 15,
    },
    setting: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        marginBottom: 15,
    },
    setting_left: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
    },
    setting_text: {
        color: "#131214",
        fontSize: 16,
    },
});

export default DriverProfile;
