import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

const DriverProfileEdit = ({ navigation }) => {
  const [fullName, setFullName] = useState("Xumoyunmirzo Yakubjonov");
  const [phoneNumber, setPhoneNumber] = useState("+998 99 842 79 79");
  const [optionalPhone, setOptionalPhone] = useState("");
  const [birthDate, setBirthDate] = useState("11/05/2006");
  const [password, setPassword] = useState("password");
  const [confirmPassword, setConfirmPassword] = useState("password");
  const [driverLicense, setDriverLicense] = useState("");
  const [carPassport, setCarPassport] = useState("");

  const handleSave = () => {
    console.log("Ma'lumotlar saqlandi");
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
        <Text style={styles.InputTitle}>Ism Familiya</Text>
        <TextInput
          style={styles.input}
          placeholder="Ism Familiya"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.InputWrapper}>
        <Text style={styles.InputTitle}>Telefon raqam</Text>
        <TextInput
          style={styles.input}
          placeholder="Telefon raqam"
          value={phoneNumber}
          keyboardType="phone-pad"
          onChangeText={setPhoneNumber}
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
          keyboardType="phone-pad"
          onChangeText={setOptionalPhone}
        />
      </View>

      <View style={styles.InputWrapper}>
        <Text style={styles.InputTitle}>Tug'ilgan sana</Text>
        <TextInput
          style={styles.input}
          placeholder="Tug'ilgan sana"
          value={birthDate}
          onChangeText={setBirthDate}
        />
      </View>

      <View style={styles.InputWrapper}>
        <Text style={styles.InputTitle}>Parol</Text>
        <TextInput
          style={styles.input}
          placeholder="Parol"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.InputWrapper}>
        <Text style={styles.InputTitle}>Parolni takrorlang</Text>
        <TextInput
          style={styles.input}
          placeholder="Parolni takrorlang"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <View style={styles.InputWrapper}>
        <Text style={styles.InputTitle}>Prava seriyasi va raqami</Text>
        <TextInput
          style={styles.input}
          placeholder="Prava seriyasi va raqami"
          value={driverLicense}
          onChangeText={setDriverLicense}
        />
      </View>

      <View style={styles.imageUploadContainer}>
        <Text style={styles.imageTitle}>Prava rasmi (ixtiyoriy)</Text>
        <TouchableOpacity style={styles.imageUpload}>
          <Ionicons name="camera-outline" size={32} color="blue" />
        </TouchableOpacity>
      </View>

      <View style={styles.InputWrapper}>
        <Text style={styles.InputTitle}>
          Mashina tex pasporti va seriya raqami
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Seriya raqami"
          value={carPassport}
          onChangeText={setCarPassport}
        />
      </View>

      <View style={styles.imageUploadContainer}>
        <Text style={styles.imageTitle}>Tex passport rasmi(ixtiyoriy)</Text>
        <TouchableOpacity style={styles.imageUpload}>
          <Ionicons name="camera-outline" size={32} color="blue" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Saqlash</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 8,
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
