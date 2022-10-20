import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import TouchableIcon from "../TouchableIcon";
import AppText from "../Text";

const Header = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <AppText style={{ fontSize: 35, fontWeight: "600" }}>OAC</AppText>
      </TouchableOpacity>
      <View style={styles.iconsContainer}>
        <TouchableIcon
          name={"plus-box-outline"}
          size={30}
          onPress={() => navigation.push("ListingEditScreen")}
        />
        <TouchableIcon
          name={"bell-outline"}
          size={30}
          badge={9}
          style={{ marginLeft: 10 }}
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  iconsContainer: {
    flexDirection: "row",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});
