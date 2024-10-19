import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import IconFont from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const DriverProfile = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconFont
          style={styles.gobackIcon}
          onPress={() => navigation.goBack()}
          name="angle-left"
          size={30}
          color="#7257FF"
        />
        <Text style={styles.headerTitle}>Shaxsiy ma'lumotlar</Text>
      </View>

      <View style={styles.InformationContainer}>
        <View style={styles.informationBox}>
          <Image source={require("../../assets/driver/UserAvatar.png")} />
          <View>
            <Text style={styles.userFirstName}>Anvar</Text>
            <Text style={styles.userPhoneNumber}>+998 99 842 79 79</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.loadButton}>
          <Text style={styles.loadButtonText}>Ma'lumotlarni tahrirlash</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.notificationContainer}>
        <View style={styles.notificationBox}>
          <Image
            source={require("../../assets/driver/missing-info-register.png")}
            style={styles.image}
          />
          <Text style={styles.notificationText}>
            Ro'yxatdan o'tishni tugatish uchun, iltimos, ma'lumotlaringizni
            to'liq to'ldiring, yana bir necha qadam qoldi!
          </Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  header: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    fontWeight: "600",
    flex: 1,
  },
  gobackIcon: {
    paddingHorizontal: 15,
  },
  notificationContainer: {
    paddingHorizontal: 10,
    marginVertical: 10,
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
  loadButton: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    marginTop:16,
    backgroundColor: "#F0EDFF",
  },
  loadButtonText: {
    color: "#7C3AED",
    fontSize: 16,
    marginRight: 10,
    fontWeight: "700",
  },
  InformationContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  informationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginVertical:8
  },
  userFirstName:{
    fontSize:24,
    fontWeight:"600",
    color:"black",
  },
  userPhoneNumber:{
    color:"black",

  }
});

export default DriverProfile;
