import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Alert, Platform, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary, ImageLibraryOptions, CameraOptions, Asset } from 'react-native-image-picker';
import { handleLogout } from '../../store/Logout';
import CustomSwitch from '../ui/switch/Switch';
import LanguageSelector from '../ui/Languch/LanguageSelector';
import axios from 'axios';
import { GetData } from '../AsyncStorage/AsyncStorage';
import { API_URL } from '@env';
import EditProfileModal from '../ui/EditProfileModal/EditProfileModal';
import { ProfileProps } from './RouterType';

const MAX_IMAGE_SIZE = 200 * 1024; // 200 KB

const showErrorAlert = (message: string) => {
    Alert.alert('Xatolik', message, [{ text: 'OK', onPress: () => console.log('OK bosildi') }]);
};

interface ImageUploadResponse {
    didCancel?: boolean;
    errorCode?: string;
    errorMessage?: string;
    assets?: Asset[];
}
const uploadImageToAPI = async (imageUri: string, userId: string, authToken: string,) => {
    try {
        const imageSize = await getImageSize(imageUri);
        if (imageSize > MAX_IMAGE_SIZE) {
            showErrorAlert('Rasm hajmi 200 KB dan oshmasligi kerak');
            return;
        }

        const formData = new FormData();
        const fileName = imageUri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(fileName);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('file', {
            uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
            type: type,
            name: fileName,
        } as any);

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${API_URL}/api/auth/upload-profile-picture?user_id=${userId}`,
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        };

        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
const getImageSize = async (imageUri: string): Promise<number> => {
    try {
        const response = await axios.get(imageUri, { responseType: 'blob' });
        return response.data.size;
    } catch (error) {
        console.error('Rasm hajmini olishda xatolik:', error);
        return 0;
    }
};

const DriverProfile: React.FC<ProfileProps> = (
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
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [imageChangeModal, setImageChangeModal] = useState(false);
    const [img_url, setImg_url] = useState<string | null>(null);
    const [dataUpdate, setDataUpdate] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [unique_id, setUnique_id] = useState<string>('');

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
        GetData('unique_id').then((res) => {
            if (res) {
                setUnique_id(res)

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

    useEffect(() => {
        if (user_id && token && dataUpdate) {
            axios.get(API_URL + `/api/auth/get-profile?user_id=${user_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                setFirstname(res.data.firstname)
                setLastname(res.data.lastname)
                setPhone(res.data.phone)
                if (res.data?.user_img) {
                    setImg_url(res.data.user_img)
                }
                setDataUpdate(false)

            }).catch((error) => {
                console.log(76, error);
                showErrorAlert(error?.response?.data?.message)
            })
        }

    }, [user_id, token, dataUpdate]);

    const ImagePickerModal = () => (
        <Modal
            visible={imageChangeModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setImageChangeModal(false)}
        >
            <TouchableOpacity onPress={() => setImageChangeModal(false)} style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* <TouchableOpacity style={styles.modalButton} onPress={handleTakePhoto}>
                        <Icon name="camera" size={24} color="#5336E2" />
                        <Text style={styles.modalButtonText}>Kameradan rasmga olish</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={styles.modalButton} onPress={handleChoosePhoto}>
                        <Icon name="image" size={24} color="#5336E2" />
                        <Text style={styles.modalButtonText}>Galereyadan tanlash</Text>
                    </TouchableOpacity>

                    {/* {profileImage && (
                        <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={handleDeletePhoto}>
                            <Icon name="trash" size={24} color="#DB340B" />
                            <Text style={[styles.modalButtonText, styles.deleteButtonText]}>Rasmni o'chirish</Text>
                        </TouchableOpacity>
                    )} */}

                    <TouchableOpacity style={styles.cancelButton} onPress={() => setImageChangeModal(false)}>
                        <Text style={styles.cancelButtonText}>Bekor qilish</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>

    );

    const handleChoosePhoto = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            quality: 1,
            selectionLimit: 1,
        };

        launchImageLibrary(options, async (response: ImageUploadResponse) => {
            if (response.didCancel) {
                console.log('Foydalanuvchi rasmni tanlamadi');
            } else if (response.errorCode) {
                console.log('ImagePicker Error:', response.errorMessage);
            } else if (response.assets && response.assets[0].uri) {
                await uploadImageToAPI(response.assets[0].uri, user_id, token,).then((res) => {
                    setDataUpdate(true);
                })
            }
        });
        setImageChangeModal(false);
    };

    const handleLanguageChange = (languageCode: string) => {
        setCurrentLanguage(languageCode);
        // Bu yerda til o'zgarganda kerakli logikani yozish mumkin
        // Masalan: i18n configuratsiyasi, AsyncStorage'ga saqlash va h.k.
    };
    const logoutFun = async () => {
        await handleLogout();
    };
    const NavigateTermsAndCondition = () => {
        navigation.navigate('terms_condition');
    };
    const handleChangePhoneNumber = () => {
        setModalVisible(false);
        navigation.navigate('main_phone_update')
    };
    const handleChangePersonalInfo = () => {
        setModalVisible(false);
        navigation.navigate('profile_update')
    };

    return (
        <View style={styles.container_all}>
            <View style={styles.header_con}>
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
                <Text style={styles.title}>Shaxsiy ma'lumotlar</Text>
            </View>
            <ScrollView style={{ flexGrow: 1, marginBottom: 60 }}>
                <View style={styles.container}>
                    <View style={styles.profileContainer}>
                        <TouchableOpacity onPress={() => setImageChangeModal(true)}>
                            <Image
                                source={img_url ? { uri: img_url } : require('../../assets/img/owner/user.png')}
                                style={styles.profileImage}
                            />
                            <View style={styles.editImageButton}>
                                <Icon name="camera" size={16} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.profileName}>{firstname} {lastname}</Text>
                            {/* <TouchableOpacity onPress={() => Linking.openURL('tel:+998998427979')}> */}
                            <Text style={styles.profilePhone}>{phone}</Text>
                            <Text style={styles.profilePhone}>ID: {unique_id}</Text>
                            {/* </TouchableOpacity> */}
                        </View>
                    </View>
                    <TouchableOpacity style={styles.editButton}
                        onPress={() => setModalVisible(true)}
                    >
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

            <EditProfileModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onChangePhoneNumber={handleChangePhoneNumber}
                onChangePersonalInfo={handleChangePersonalInfo}
            />

            <ImagePickerModal />


        </View>
    );
};

const styles = StyleSheet.create({
    editImageButton: {
        position: 'absolute',
        right: 0,
        bottom: 8,
        backgroundColor: '#5336E2',
        borderRadius: 15,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    deleteButton: {
        borderBottomWidth: 0,
    },
    deleteButtonText: {
        color: '#DB340B',
    },
    cancelButton: {
        marginTop: 10,
        padding: 15,
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#131214',
        fontWeight: '600',
    },

    modalContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
        height: '100%',
        zIndex: 9999
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e8ea',
        gap: 10,
    },
    modalButtonText: {
        fontSize: 16,
        color: '#131214',
        marginLeft: 10,
    },

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
