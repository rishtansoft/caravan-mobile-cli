import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const LoadHistory = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const orders = [1, 1, 1, 1, 1, 1];

  // Royhatdan toliq o'tgan yoki yoqligini tekshirish asnc storage bilan tekshirish
  const userRegister = true;

  const toggleModal = () => {
    if (userRegister) {
      navigation.navigate("ActiveLoadDetail", { orderId: "55555" }); //Aynan shu buyurtma malumotlarini uzatish uchun ishlatildi
    } else {
      setModalVisible(!isModalVisible);
    }
  };

  const goToHome = () => {
    setModalVisible(!isModalVisible);
  };

  const goToProfile = () => {
    setModalVisible(!isModalVisible);

    navigation.navigate("Profil");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.orders}>
        <Text style={styles.sectionTitle}>Buyurtmalar</Text>
        {orders.map((order, index) => (
          <TouchableOpacity
            key={index}
            style={styles.order}
            onPress={toggleModal}
          >
            <View style={styles.orderCard}>
              <View style={styles.orderDetails}>
                <Text style={styles.location}>Andijon</Text>
                <Image source={require("../../assets/driver/referrer.png")} />
                <Text style={styles.location}>Toshkent</Text>
              </View>
              <View>
                <Text style={styles.orderNo}>#16005</Text>
              </View>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoCategory}>Oziq-ovqat</Text>
              <Text style={styles.infoCategory}>104kg</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  imageModal: {
    width: 345,
    height: 250,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  backButton: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  backButtonText: {
    color: "#000",
    fontSize: 16,
  },
  finishButton: {
    backgroundColor: "#4B0082",
    padding: 10,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  finishButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default LoadHistory;
