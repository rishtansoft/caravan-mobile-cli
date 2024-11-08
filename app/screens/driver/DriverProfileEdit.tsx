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
} from "react-native";
import CustomDatePicker from "../ui/DatePIker/DatePIker";

import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { GetData } from "../AsyncStorage/AsyncStorage";
import { API_URL } from "@env";
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from "react-native-image-picker";
interface carTypes {
  id: string;
  name: string;
  icon: string;
}

const showErrorAlert = (message: string) => {
  Alert.alert("Ogohlantirish", message, [
    { text: "OK", onPress: () => console.log("OK bosildi") },
  ]);
};

interface ImageUploadResponse {
  didCancel?: boolean;
  errorCode?: string;
  errorMessage?: string;
  assets?: Asset[];
}

interface SelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (item: any) => void;
  items: Array<{ label: string; value: any; icon: string }>;
  title: string;
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
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const DriverProfileEdit = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [lastname, setLastname] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [optionalPhone, setOptionalPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [carPassport, setCarPassport] = useState("");
  const [user_id, setUser_id] = useState<string>("");
  const [carName, setCarName] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [keyboardType, setKeyboardType] = useState<"default" | "numeric">(
    "default"
  );
  const [keyboardTypeTextPas, setKeyboardTypeTextPas] = useState<
    "default" | "numeric"
  >("default");
  const [vehicleTypeModalVisible, setVehicleTypeModalVisible] = useState(false);
  const [car_type, setCar_type] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [date, setDate] = useState<Date | null>();
  const [dateError, setDateError] = useState<string>("");
  const [dateValue, setDateValue] = useState<string>("");

  const [carImages, setCarImages] = useState<string[]>([]); 
  const [pravaImages, setPravaImages] = useState<string[]>([]); 
  const [passportImages, setPassportImages] = useState<string[]>([]); 

  useEffect(() => {
    GetData("user_id")
      .then((res) => {
        if (res) {
          // console.log(44, JSON.parse(res).user_id);
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
    if (user_id && token) {
      axios
        .get(API_URL + `/api/driver/profile?user_id=${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(54, res.data);
          setFullName(res.data.user?.firstname);
          setLastname(res.data.user?.lastname);
          if (res.data?.user?.phone_2) {
            setOptionalPhone(res.data?.user?.phone_2.slice(1));
          }
          if (res.data?.driver?.name && res.data?.driver?.name != "unknown") {
            setCarName(res.data?.driver?.name);
          }
          if (
            res.data?.driver?.tex_pas_ser &&
            res.data?.driver?.tex_pas_ser != "unknown" &&
            res.data?.driver?.tex_pas_num &&
            res.data?.driver?.tex_pas_num != "unknown"
          ) {
            setCarPassport(
              res.data?.driver?.tex_pas_ser + res.data?.driver?.tex_pas_num
            );
            setKeyboardTypeTextPas("numeric");
          }
          if (
            res.data?.driver?.prava_ser &&
            res.data?.driver?.prava_ser != "unknown" &&
            res.data?.driver?.prava_num &&
            res.data?.driver?.prava_num != "unknown"
          ) {
            setDriverLicense(
              res.data?.driver?.prava_ser + res.data?.driver?.prava_num
            );
            setKeyboardType("numeric");
          }
        })
        .catch((error) => {
          console.log(56, error);
        });
    }
  }, [user_id, token]);
  useEffect(() => {
    axios
      .get(API_URL + "/api/admin/car-type/get-all")
      .then((res) => {
        if (res.data?.carTypes && res.data.carTypes.length > 0) {
          const newArr = res.data.carTypes.map((el: carTypes) => {
            return {
              value: el.id,
              label: el.name,
              icon: el.icon,
            };
          });
          setVehicleTypes(newArr);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const splitText = (
    text: string,
    n: number
  ): { text_1: string; text_2: string } => {
    const text_1 = text.slice(0, n);
    const text_2 = text.slice(n);
    return { text_1, text_2 };
  };

  const handleChangeTextTextPas = (input: string) => {
    let formattedText = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const letters = formattedText.slice(0, 3).replace(/[^A-Z]/g, "");
    const numbers = formattedText.slice(3).replace(/[^0-9]/g, "");
    formattedText = letters + numbers;
    if (formattedText.length > 10) {
      formattedText = formattedText.slice(0, 10);
    }
    setCarPassport(formattedText);
    if (letters.length === 3) {
      setKeyboardTypeTextPas("numeric");
    } else {
      setKeyboardTypeTextPas("default");
    }
  };

  const handleImagePicker = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      quality: 1,
      selectionLimit: 5,
    };

    launchImageLibrary(options, async (response: ImageUploadResponse) => {
      if (response.didCancel) {
        console.log("Foydalanuvchi rasmni tanlamadi");
      } else if (response.errorCode) {
        console.log("ImagePicker Error:", response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        const newImages = response.assets.map((asset) => asset.uri); // Ensure it's a URI
        setCarImages((prevImages) => [...prevImages, ...newImages]);
      }
    });
  };

  const handleImagePrava = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      quality: 1,
      selectionLimit: 5,
    };

    launchImageLibrary(options, async (response: ImageUploadResponse) => {
      if (response.didCancel) {
        console.log("Foydalanuvchi rasmni tanlamadi");
      } else if (response.errorCode) {
        console.log("ImagePicker Error:", response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        const newImages = response.assets.map((asset) => asset.uri); // Ensure it's a URI
        setPravaImages((prevImages) => [...prevImages, ...newImages]);
      }
    });
  };
  const handleImagePassport = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      quality: 1,
      selectionLimit: 5,
    };

    launchImageLibrary(options, async (response: ImageUploadResponse) => {
      if (response.didCancel) {
        console.log("Foydalanuvchi rasmni tanlamadi");
      } else if (response.errorCode) {
        console.log("ImagePicker Error:", response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        const newImages = response.assets.map((asset) => asset.uri); // Ensure it's a URI
        setPassportImages((prevImages) => [...prevImages, ...newImages]);
      }
    });
  };



  const handleChangeTextPrava = (input: string) => {
    let formattedText = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const letters = formattedText.slice(0, 2).replace(/[^A-Z]/g, "");
    const numbers = formattedText.slice(2).replace(/[^0-9]/g, "");
    formattedText = letters + numbers;
    if (formattedText.length > 9) {
      formattedText = formattedText.slice(0, 9);
    }
    setDriverLicense(formattedText);
    if (letters.length === 2) {
      setKeyboardType("numeric");
    } else {
      setKeyboardType("default");
    }
  };

  const handleDateChange = (date: Date) => {
    setDate(date);
    setDateError("");
  };

  function formatDate(dateString: Date): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }


  const handleSave = () => {
    if (
      fullName &&
      lastname &&
      car_type &&
      carName &&
      carPassport &&
      driverLicense
    ) {
      if (token && user_id) {
        const resData = {
          firstname: fullName,
          lastname: lastname,
          car_type: car_type.value,
          car_name: carName,
          phone_2: optionalPhone ? "+" + optionalPhone : null,
          birthday: date ? formatDate(date) : dateValue,
          tex_pas_ser: splitText(carPassport, 3).text_1,
          prava_ser: splitText(driverLicense, 2).text_1,
          tex_pas_num: splitText(carPassport, 3).text_2,
          prava_num: splitText(driverLicense, 2).text_2,
        };

        axios
          .put(
            API_URL + `/api/driver/update-profile?user_id=${user_id}`,
            resData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            console.log(201, res.data);
            navigation.goBack();
          })
          .catch((error) => {
            console.log(203, error?.response?.data?.message);
          });
      }
    } else {
      showErrorAlert("Ixtiyoriy bo'lmagan barcha qiymatlarni kiritish shart!");
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
        <CustomDatePicker
          value={dateValue}
          onDateChange={handleDateChange}
        ></CustomDatePicker>
      </View>

      <View style={styles.InputWrapper}>
        <Text style={styles.InputTitle}>Prava seriyasi va raqami</Text>
        <TextInput
          style={[styles.input, { textTransform: "uppercase" }]}
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
        <View
          style={{
            flexDirection: "row",
            gap: 15,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {carImages.length > 0 &&
            pravaImages.map((image, index) => (
              <Image
                source={{ uri: pravaImages[index] }} // Displays the first uploaded image
                style={{ width: 100, height: 100, marginTop: 10 }} // Adjust dimensions as needed
                resizeMode="cover"
              />
            ))}
          <TouchableOpacity
            style={styles.imageUpload}
            onPress={handleImagePrava}
          >
            <Ionicons name="camera-outline" size={32} color="blue" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.InputWrapper}>
        <Text style={styles.InputTitle}>
          Mashina tex pasporti va seriya raqami
        </Text>

        <TextInput
          style={[styles.input, { textTransform: "uppercase" }]}
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
        <View
          style={{
            flexDirection: "row",
            gap: 15,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {passportImages.length > 0 &&
            passportImages.map((image, index) => (
              <Image
                source={{ uri: passportImages[index] }} // Displays the first uploaded image
                style={{ width: 100, height: 100, marginTop: 10 }} // Adjust dimensions as needed
                resizeMode="cover"
              />
            ))}
          <TouchableOpacity
            style={styles.imageUpload}
            onPress={handleImagePassport}
          >
            <Ionicons name="camera-outline" size={32} color="blue" />
          </TouchableOpacity>
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
          <Text
            style={
              car_type ? styles.selectedText : styles.selectButtonText_plech
            }
          >
            {car_type ? car_type.label : "Mashina turini tanlang"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageUploadContainer}>
        <Text style={styles.imageTitle}>Mashina rasmi(ixtiyoriy)</Text>
        <View
          style={{
            flexDirection: "row",
            gap: 15,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {carImages.length > 0 &&
            carImages.map((image, index) => (
              <Image
                source={{ uri: carImages[index] }} // Displays the first uploaded image
                style={{ width: 100, height: 100, marginTop: 10 }} // Adjust dimensions as needed
                resizeMode="cover"
              />
            ))}
          <TouchableOpacity
            style={styles.imageUpload}
            onPress={handleImagePicker}
          >
            <Ionicons name="camera-outline" size={32} color="blue" />
          </TouchableOpacity>
        </View>
      </View>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalScroll: {
    maxHeight: "100%",
  },

  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E9E9",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedText: {
    color: "#000000",
  },

  selectButton: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E8E9E9",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    marginBottom: 15,
  },
  selectButtonText: {
    color: "#131214",
  },

  modalItemText: {
    fontSize: 16,
    color: "#131214",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  selectButtonText_plech: {
    color: "#898D8F",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E9E9",
  },
  closeButton: {
    fontSize: 20,
    color: "#2d2d2d",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#131214",
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
    color: "#131214",
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
