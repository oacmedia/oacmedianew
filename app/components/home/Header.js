import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import TouchableIcon from "../TouchableIcon";
import AppText from "../Text";

const Header = ({ navigation, notfCount }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <AppText style={{ fontSize: 25,fontFamily: "Roboto", fontWeight: "600" }}>My<AppText style={{fontSize: 30,fontFamily: "Roboto", fontWeight: "600",}}>OAC</AppText></AppText>
      </TouchableOpacity>
      <View style={styles.iconsContainer}>
        <TouchableIcon
          name={"bell-outline"}
          size={35}
          badge={notfCount>0?(notfCount>99?"99+":notfCount):""}
          onPress={() => navigation.navigate("NotificationsScreen")}
          />
        <TouchableIcon
          name={"plus-box-outline"}
          size={35}
          style={{ marginLeft: 10 }}
          onPress={() => navigation.navigate("ListingEditScreen")}
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
