import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Image,
    Alert,
    Platform
} from "react-native";
import CustomDatePicker from '../ui/DatePIker/DatePIker';
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { GetData } from "../AsyncStorage/AsyncStorage";
import { API_URL } from "@env";
import { launchCamera, launchImageLibrary, ImageLibraryOptions, CameraOptions, Asset } from 'react-native-image-picker';

const MAX_IMAGE_SIZE = 200 * 1024; // 200 KB

interface carTypes {
    id: string,
    name: string,
    icon: string
}

const showErrorAlert = (message: string) => {
    Alert.alert('Ogohlantirish', message, [{ text: 'OK', onPress: () => console.log('OK bosildi') }]);
};
interface ImageUploadResponse {
    didCancel?: boolean;
    errorCode?: string;
    errorMessage?: string;
    assets?: Asset[];
}
const uploadImageToAPI = async (imageUri: string, userId: string, authToken: string, api_url: string) => {
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
            url: `${api_url}`,
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


interface SelectModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (item: any) => void;
    items: Array<{ label: string; value: any, icon: string }>;
    title: string;

}

interface ImgModalProp {
    visible: boolean;
    onClose: () => void;
    imgPravadeleteFun: () => void;
    imgTextPasdeleteFun: () => void;
    img_url: string,
    img_type: string,

}

const SelectModal: React.FC<SelectModalProps> = ({
    visible,
    onClose,
    onSelect,
    items,
    title,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity onPress={onClose} style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll}>
                        {items.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.modalItem}
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                            >
                                <Text style={styles.modalItemText}>{item.label}</Text>

                                {/* <Image
                                    source={{ uri: item.icon }}
                                    style={{
                                        width: 66,
                                        height: 58,
                                    }}
                                /> */}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const ImgModal: React.FC<ImgModalProp> = ({
    onClose,
    imgPravadeleteFun,
    imgTextPasdeleteFun,
    img_url,
    img_type,
    visible
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity onPress={onClose} style={styles.modalOverlay}>
                <View style={
                    [styles.modalContent, { paddingVertical: 10, paddingHorizontal: 10 }]
                }>

                    <Image
                        source={{ uri: img_url }}
                        style={{
                            width: '100%',
                            height: 300,
                            borderRadius: 8,
                        }}
                    />

                    <TouchableOpacity
                        onPress={img_type == 'prava' ? imgPravadeleteFun : imgTextPasdeleteFun}
                        style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>
                            O'chirish
                        </Text>
                    </TouchableOpacity>
                </View>

            </TouchableOpacity>

        </Modal>
    )
}

const DriverProfileEdit = ({ navigation }) => {
    const [fullName, setFullName] = useState("");
    const [lastname, setLastname] = useState("");
    // const [phoneNumber, setPhoneNumber] = useState("");
    const [optionalPhone, setOptionalPhone] = useState("");
    // const [password, setPassword] = useState("");
    // const [confirmPassword, setConfirmPassword] = useState("");
    const [driverLicense, setDriverLicense] = useState("");
    const [carPassport, setCarPassport] = useState("");
    const [user_id, setUser_id] = useState<string>('');
    const [carName, setCarName] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [keyboardType, setKeyboardType] = useState<'default' | 'numeric'>('default');
    const [keyboardTypeTextPas, setKeyboardTypeTextPas] = useState<'default' | 'numeric'>('default');
    const [vehicleTypeModalVisible, setVehicleTypeModalVisible] = useState(false);
    const [car_type, setCar_type] = useState<{ value: string; label: string } | null>(null);
    const [date, setDate] = useState<Date | null>();
    const [dateError, setDateError] = useState<string>('');
    const [dateValue, setDateValue] = useState<string>('');
    const [dataUpdate, setDataUpdate] = useState<boolean>(false);
    const [prava_img, setPrava_img] = useState<string | null>(null);
    const [textPas_img, setTextPas_img] = useState<string | null>(null);
    const [imgModal, setImgModal] = useState<boolean>(false);
    const [img_url, setimg_url] = useState<string>('');
    const [img_type, setImg_type] = useState<string>('');

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
        if (user_id && token) {
            axios.get(API_URL + `/api/driver/profile?user_id=${user_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                setFullName(res.data.user?.firstname)
                setLastname(res.data.user?.lastname)
                if (res.data?.user?.birthday) {
                    setDateValue(res.data?.user?.birthday)
                }
                if (res.data?.driver?.prava_img) {
                    setPrava_img(res.data.driver.prava_img)
                }
                if (res.data?.driver?.tex_pas_img) {
                    setTextPas_img(res.data.driver.tex_pas_img)
                }

                if (res.data?.user?.phone_2) {
                    setOptionalPhone(res.data?.user?.phone_2.slice(1))
                }
                if (res.data?.driver?.name && res.data?.driver?.name != "unknown") {
                    setCarName(res.data?.driver?.name)
                }
                if (res.data?.driver?.tex_pas_ser && res.data?.driver?.tex_pas_ser != "unknown" && res.data?.driver?.tex_pas_num && res.data?.driver?.tex_pas_num != "unknown") {
                    setCarPassport(res.data?.driver?.tex_pas_ser + res.data?.driver?.tex_pas_num)
                    setKeyboardTypeTextPas('numeric');
                }
                if (res.data?.driver?.prava_ser && res.data?.driver?.prava_ser != "unknown" && res.data?.driver?.prava_num && res.data?.driver?.prava_num != "unknown") {
                    setDriverLicense(res.data?.driver?.prava_ser + res.data?.driver?.prava_num)
                    setKeyboardType('numeric');
                }

            }).catch((error) => {
                console.log(56, error);
            })
        }

    }, [user_id, token]);
    useEffect(() => {
        axios.get(API_URL + '/api/admin/car-type/get-all')
            .then((res) => {
                if (res.data?.carTypes && res.data.carTypes.length > 0) {
                    const newArr = res.data.carTypes.map((el: carTypes) => {
                        return {
                            value: el.id,
                            label: el.name,
                            icon: el.icon
                        }
                    })
                    setVehicleTypes(newArr)
                }

            }).catch((error) => {
                console.log(error);

            })
    }, []);
    useEffect(() => {
        if (user_id && token && dataUpdate) {
            axios.get(API_URL + `/api/driver/profile?user_id=${user_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                if (res.data?.driver?.prava_img) {
                    setPrava_img(res.data.driver.prava_img)
                }
                if (res.data?.driver?.tex_pas_img) {
                    setTextPas_img(res.data.driver.tex_pas_img)
                }


                setDataUpdate(false)
            }).catch((error) => {
                console.log(56, error);
            })
        }

    }, [user_id, token, dataUpdate]);
    const splitText = (text: string, n: number): { text_1: string; text_2: string } => {
        const text_1 = text.slice(0, n);
        const text_2 = text.slice(n);
        return { text_1, text_2 };
    };
    const handleChangeTextTextPas = (input: string) => {
        let formattedText = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const letters = formattedText.slice(0, 3).replace(/[^A-Z]/g, '');
        const numbers = formattedText.slice(3).replace(/[^0-9]/g, '');
        formattedText = letters + numbers;
        if (formattedText.length > 10) {
            formattedText = formattedText.slice(0, 10);
        }
        setCarPassport(formattedText);
        if (letters.length === 3) {
            setKeyboardTypeTextPas('numeric');
        } else {
            setKeyboardTypeTextPas('default');
        }
    };
    const handleChangeTextPrava = (input: string) => {
        let formattedText = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const letters = formattedText.slice(0, 2).replace(/[^A-Z]/g, '');
        const numbers = formattedText.slice(2).replace(/[^0-9]/g, '');
        formattedText = letters + numbers;
        if (formattedText.length > 9) {
            formattedText = formattedText.slice(0, 9);
        }
        setDriverLicense(formattedText);
        if (letters.length === 2) {
            setKeyboardType('numeric');
        } else {
            setKeyboardType('default');
        }
    };
    const handleDateChange = (date: Date) => {
        setDate(date);
        setDateError('');
    };
    function formatDate(dateString: Date): string {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    const phoneValidateFun = (value: string) => {
        const phoneRegex = /^998\d{9}$/; // +998xxxxxxxxx phone format
        if (value && phoneRegex.test(value)) {
            return true;
        } else {
            return false;
        }
    };
    const handleChoosePhotoPrava = () => {
        if (token && user_id) {
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
                    await uploadImageToAPI(response.assets[0].uri, user_id, token, `${API_URL}/api/driver/upload-prava?user_id=${user_id}`).then((res) => {
                        setDataUpdate(true);
                    })
                }
            });
        }
    };
    const handleChoosePhotoTextPassport = () => {
        if (token && user_id) {
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
                    await uploadImageToAPI(response.assets[0].uri, user_id, token, `${API_URL}/api/driver/upload-tex-passport?user_id=${user_id}`).then((res) => {
                        setDataUpdate(true);
                    })
                }
            });
        }
    };
    const handleChoosePhotoCar = () => {
        if (token && user_id) {
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
                    await uploadImageToAPI(response.assets[0].uri, user_id, token, `${API_URL}/api/driver/upload-tex-passport?user_id=${user_id}`).then((res) => {
                        setDataUpdate(true);
                    })
                }
            });
        }
    };
    const deleteImgPravaFun = () => {
        if (token && user_id) {
            setImgModal(false)
            setPrava_img(null)
            axios.delete(`${API_URL}/api/driver/delete-prava?user_id=${user_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                console.log(res.data);
                setDataUpdate(true)


            }).catch((error) => {
                console.log(447, error);

            })
        }
    }
    const deleteImgTextPasFun = () => {
        if (token && user_id) {
            setImgModal(false)
            setTextPas_img(null)
            axios.delete(`${API_URL}/api/driver/delete-tex-passport?user_id=${user_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                console.log(res.data);
                setDataUpdate(true)

            }).catch((error) => {
                console.log(447, error);

            })
        }
    }

    const handleSave = () => {
        if (
            fullName && lastname &&
            car_type && carName &&
            carPassport && driverLicense

        ) {
            if (token && user_id) {
                const resData = {
                    "firstname": fullName,
                    "lastname": lastname,
                    "car_type": car_type.value,
                    "car_name": carName,
                    "phone_2": optionalPhone ? "+" + optionalPhone : null,
                    'birthday': date ? formatDate(date) : dateValue,
                    "tex_pas_ser": splitText(carPassport, 3).text_1,
                    "prava_ser": splitText(driverLicense, 2).text_1,
                    "tex_pas_num": splitText(carPassport, 3).text_2,
                    "prava_num": splitText(driverLicense, 2).text_2,
                }
                console.log(267, resData);


                axios.put(API_URL + `/api/driver/update-profile?user_id=${user_id}`,
                    resData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((res) => {
                    console.log(201, res.data);
                    navigation.goBack()
                }).catch((error) => {
                    console.log(203, error?.response?.data?.message);
                })
            }
        } else {
            showErrorAlert("Ixtiyoriy bo'lmagan barcha qiymatlarni kiritish shart!")
        }

    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                <Text style={styles.title}>Shaxsiy ma'lumotlar</Text>
            </View>

            <View style={styles.InputWrapper}>
                <Text style={styles.InputTitle}>Ism</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ism"
                    placeholderTextColor="#898D8F"
                    value={fullName}
                    onChangeText={setFullName}
                />
            </View>
            <View style={styles.InputWrapper}>
                <Text style={styles.InputTitle}>Familiya</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Familiya"
                    placeholderTextColor="#898D8F"
                    value={lastname}
                    onChangeText={setLastname}
                />
            </View>
            <View style={styles.InputWrapper}>
                <Text style={styles.InputTitle}>
                    Qo'shimcha telefon raqam (ixtiyoriy)
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Qo'shimcha telefon raqam (ixtiyoriy)"
                    value={optionalPhone}
                    maxLength={12}
                    placeholderTextColor="#898D8F"
                    keyboardType="numeric"
                    onChangeText={setOptionalPhone}
                />
            </View>

            <View style={styles.InputWrapper}>
                <Text style={styles.InputTitle}>Tug'ilgan sana</Text>
                <CustomDatePicker value={dateValue} onDateChange={handleDateChange}></CustomDatePicker>
            </View>
            <View style={styles.InputWrapper}>
                <Text style={styles.InputTitle}>Prava seriyasi va raqami</Text>
                <TextInput
                    style={[styles.input, { textTransform: 'uppercase' }]}
                    // placeholder="Prava seriyasi va raqami"
                    value={driverLicense}
                    placeholder="AB1234567"
                    maxLength={9}
                    keyboardType={keyboardType}
                    placeholderTextColor="#898D8F"
                    onChangeText={handleChangeTextPrava}
                />
            </View>

            <View style={styles.imageUploadContainer}>
                <Text style={styles.imageTitle}>Prava rasmi (ixtiyoriy)</Text>
                <View style={styles.img_card}>
                    <TouchableOpacity onPress={handleChoosePhotoPrava} style={styles.imageUpload}>
                        <Ionicons name="camera-outline" size={32} color="blue" />
                    </TouchableOpacity>
                    {
                        prava_img && <TouchableOpacity
                            onPress={() => {
                                setImg_type('prava')
                                setimg_url(prava_img)
                                setImgModal(true)
                            }}
                            style={styles.upload_img_btn}
                        >
                            <Image
                                source={{ uri: prava_img }}
                                style={styles.upload_img}
                            />
                        </TouchableOpacity>
                    }
                </View>

            </View>

            <View style={styles.InputWrapper}>
                <Text style={styles.InputTitle}>
                    Mashina tex pasporti va seriya raqami
                </Text>

                <TextInput
                    style={[styles.input, { textTransform: 'uppercase' }]}
                    placeholder="AAB1234567"
                    value={carPassport}
                    maxLength={10}
                    keyboardType={keyboardTypeTextPas}
                    placeholderTextColor="#898D8F"
                    onChangeText={handleChangeTextTextPas}
                />
            </View>

            <View style={styles.imageUploadContainer}>
                <Text style={styles.imageTitle}>Tex passport rasmi(ixtiyoriy)</Text>
                <View style={styles.img_card}>
                    <TouchableOpacity onPress={handleChoosePhotoTextPassport} style={styles.imageUpload}>
                        <Ionicons name="camera-outline" size={32} color="blue" />
                    </TouchableOpacity>
                    {
                        textPas_img && <TouchableOpacity
                            style={styles.upload_img_btn}
                            onPress={() => {
                                setImg_type('text_pas')
                                setimg_url(textPas_img)
                                setImgModal(true)
                            }}
                        >
                            <Image
                                source={{ uri: textPas_img }}
                                style={styles.upload_img}
                            />
                        </TouchableOpacity>
                    }
                </View>

            </View>

            <View style={styles.InputWrapper}>
                <Text style={styles.InputTitle}>Moshina nomi</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Moshina nomini kiriting"
                    value={carName}
                    placeholderTextColor="#898D8F"
                    onChangeText={setCarName}
                />
            </View>

            <View style={styles.InputWrapper}>
                <Text style={styles.InputTitle}>Mashina turi</Text>
                <TouchableOpacity
                    style={[
                        styles.selectButton,
                        // errors.vehicleTypeError && styles.errorInput
                    ]}
                    onPress={() => setVehicleTypeModalVisible(true)}
                >
                    <Text style={

                        car_type ? styles.selectedText : styles.selectButtonText_plech
                    }>
                        {car_type ? car_type.label : "Mashina turini tanlang"}
                    </Text>
                </TouchableOpacity>

            </View>

            {/* <View style={styles.imageUploadContainer}>
                <Text style={styles.imageTitle}>Mashina rasmi(ixtiyoriy)</Text>
                <TouchableOpacity onPress={handleChoosePhotoCar} style={styles.imageUpload}>
                    <Ionicons name="camera-outline" size={32} color="blue" />
                </TouchableOpacity>
            </View> */}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Saqlash</Text>
            </TouchableOpacity>

            <SelectModal
                visible={vehicleTypeModalVisible}
                onClose={() => setVehicleTypeModalVisible(false)}
                onSelect={setCar_type}
                items={vehicleTypes}
                title="Mashina turini tanlang"
            />

            <ImgModal
                onClose={() => setImgModal(false)}
                visible={imgModal}
                img_url={img_url}
                img_type={img_type}
                imgPravadeleteFun={deleteImgPravaFun}
                imgTextPasdeleteFun={deleteImgTextPasFun}

            />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    modalScroll: {
        maxHeight: '100%',
    },
    cancelButton: {
        marginTop: 10,
        padding: 13,
        alignItems: 'center',
        backgroundColor: '#963838',
        borderRadius: 25,
    },
    cancelButtonText: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: '600',
    },

    img_card: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    upload_img_btn: {
        width: "67%",
    },
    upload_img: {
        width: '100%',
        height: 100,
        marginLeft: 10,
        borderRadius: 16,
    },


    modalItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E9E9',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectedText: {
        color: '#000000',
    },

    selectButton: {
        height: 48,
        borderWidth: 1,
        borderColor: '#E8E9E9',
        borderRadius: 8,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        marginBottom: 15,

    },
    selectButtonText: {
        color: '#131214',
    },

    modalItemText: {
        fontSize: 16,
        color: '#131214',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    selectButtonText_plech: {
        color: "#898D8F"
    },

    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E9E9',
    },
    closeButton: {
        fontSize: 20,
        color: '#2d2d2d',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#131214',
    },

    scrollContainer: {
        flexGrow: 1,
        padding: 10,
        backgroundColor: "white",
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    InputWrapper: {
        flexDirection: "column",
        gap: 5,
    },
    InputTitle: {
        color: "black",
        fontWeight: "600",
        fontSize: 16,
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: "#fff",
        color: '#131214'
    },
    picker: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    imageUploadContainer: {
        marginBottom: 15,
    },
    imageUpload: {
        backgroundColor: "#F0EDFF",
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "blue",
        borderRadius: 16,
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    imageRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: "#7257FF",
        paddingVertical: 15,
        borderRadius: 40,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 70,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
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
    imageTitle: {
        fontWeight: "600",
        fontSize: 16,
        color: "black",
        marginBottom: 8,
    },
});

export default DriverProfileEdit;
