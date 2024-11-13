import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { TermsConditionProps } from "./RouterType";
import Icon from "react-native-vector-icons/FontAwesome";
import IconFoundation from "react-native-vector-icons/Foundation";
import Fontisto from "react-native-vector-icons/Octicons"; //arrow-switch
import FeatherIcons from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesignIcon from "react-native-vector-icons/AntDesign";

const defaultData = [
  {
    title: "By Mike Fix",
    text_1: "The era of design systems is booming, and with good reason.",
    text_2:
      "All design systems employ constraint, but how do they differ? One comparison point is how dynamically they’re consumed. For example, a basic design system could be implemented as a component kit built within another project. On the other end of the spectrum, a complex system may be dynamically consumed through something like a CMS.",
  },
  {
    title: "By Mike Fix",
    text_1: "The era of design systems is booming, and with good reason.",
    text_2:
      "All design systems employ constraint, but how do they differ? One comparison point is how dynamically they’re consumed. For example, a basic design system could be implemented as a component kit built within another project. On the other end of the spectrum, a complex system may be dynamically consumed through something like a CMS.",
  },
  {
    title: "By Mike Fix",
    text_1: "The era of design systems is booming, and with good reason.",
    text_2:
      "All design systems employ constraint, but how do they differ? One comparison point is how dynamically they’re consumed. For example, a basic design system could be implemented as a component kit built within another project. On the other end of the spectrum, a complex system may be dynamically consumed through something like a CMS.",
  },
  {
    title: "By Mike Fix",
    text_1: "The era of design systems is booming, and with good reason.",
    text_2:
      "All design systems employ constraint, but how do they differ? One comparison point is how dynamically they’re consumed. For example, a basic design system could be implemented as a component kit built within another project. On the other end of the spectrum, a complex system may be dynamically consumed through something like a CMS.",
  },
];

const TermsAndCondition: React.FC<TermsConditionProps> = ({ navigation }) => {
  return (
    <View style={styles.container_all}>
      <View style={styles.header_con}>
        <View
          style={{
            width: "6%",
          }}
        >
          <Icon
            onPress={() => navigation.navigate('profile')}
            name="angle-left"
            size={30}
            color="#7257FF"
          />
        </View>
        {/* <View style={styles.title_cont}> */}
        <Text style={styles.title}>Foydalanish shartlari</Text>
        {/* </View> */}
        <MaterialCommunityIcons
          // onPress={() => navigation.navigate('home')}
          name="arrow-collapse-down"
          size={25}
          color="#7257FF"
        />
      </View>
      <View style={styles.container}>
        <Text style={{ color: "#7257FF" }}>DESIGN SYSTEM</Text>
        <Text
          style={{
            color: "#131214",
            fontSize: 24,
            fontWeight: "600",
            marginVertical: 14,
          }}
        >
          White-labeling: Putting the design system in users' hands
        </Text>
      </View>

      <FlatList
        data={defaultData}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Text
              style={{
                color: "#131214",
                fontSize: 16,
                fontWeight: "500",
                marginBottom: 10,
              }}
            >
              {item.title}
            </Text>
            <Text style={{ color: "#131214", fontSize: 16, marginBottom: 10 }}>
              {item.text_1}
            </Text>
            <Text style={{ color: "#131214", fontSize: 16, marginBottom: 10 }}>
              {item.text_2}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={{ marginTop: 70 }}></View>
    </View>
  );
};
const styles = StyleSheet.create({
  container_all: {
    flex: 1,
    overflow: "scroll",
  },
  container: {
    paddingHorizontal: 10,
    // paddingVertica: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    height: "auto",
  },
  header_con: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: "space-between",
    height: "auto",
  },

  title: {
    color: "#131214",
    fontSize: 20,
    lineHeight: 100,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  title_cont: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
});

export default TermsAndCondition;
