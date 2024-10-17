import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import IconFont from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";

const ActiveLoadDetail = ({ route }) => {
  const { orderId } = route.params;
  const navigation = useNavigation();
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.header}>
        <IconFont
          onPress={() => navigation.navigate("Home")}
          name="angle-left"
          size={30}
          color="#7257FF"
        />
        <Text style={styles.headerTitle}>Buyurtma #{orderId}</Text>
        <Image source={require("../../assets/driver/map.png")} />
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderDetailText}>Andijon</Text>
        <Image source={require("../../assets/driver/referrer.png")} />
        <Text style={styles.orderDetailText}>Toshkent</Text>
      </View>
      <View style={styles.orderInformation}>
        <View style={styles.orderInformationCard}>
          <Icon name="map-marker-outline" size={30} color="black" />
          <View style={styles.orderInformationTexts}>
            <Text>Yuk manzili</Text>
            <Text style={styles.orderDescription}>
              Andijon viloyati, Baliqchi tumani, Islomobod MFY, Sultonov, B47
            </Text>
          </View>
        </View>
        <View style={styles.orderInformationCard}>
          <Icon name="map-marker-plus-outline" size={30} color="black" />
          <View style={styles.orderInformationTexts}>
            <Text>Tohtab o'tish</Text>
            <Text style={styles.orderDescription}>
              Andijon viloyati, Baliqchi tumani, Islomobod MFY, Sultonov, B47
            </Text>
          </View>
        </View>
        <View style={styles.orderInformationCard}>
          <Icon name="map-marker-check-outline" size={30} color="black" />
          <View style={styles.orderInformationTexts}>
            <Text>Yetkazish manzili</Text>
            <Text style={styles.orderDescription}>
              Andijon viloyati, Baliqchi tumani, Islomobod MFY, Sultonov, B47
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: "#F4F6F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 17,
    color: "black",
    fontWeight: "900",
  },
  orderDetails: {
    marginTop: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 15,
  },
  orderDetailText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#291F61",
  },
  orderInformation: {
    borderRadius: 15,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection:"column",
    gap:16
  },
  orderInformationCard:{
    flexDirection:"row",
    gap:16
  },
  orderInformationTexts:{
    paddingTop:10,
    flexDirection:"column",
    gap:4
  },
  orderDescription:{
    color:"black",
    fontSize:18,
    fontWeight:"700"
  }
});

export default ActiveLoadDetail;
