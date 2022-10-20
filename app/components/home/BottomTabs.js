import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Divider } from "@rneui/themed";

import TouchableIcon from "../TouchableIcon";
import { BottomTabIcons } from "../../data/bottomIcons";

const BottomTabs = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("");

  return (
    <View style={styles.wrapper}>
      <Divider width={1} orientation="vertical" />
      <View style={styles.container}>
        {BottomTabIcons.map((item, index) => (
          <TouchableIcon
            key={index}
            name={activeTab === item.name ? item.active : item.inactive}
            size={30}
            onPress={() => {
              setActiveTab(item.name);
              navigation.push(item.name);
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    zIndex: 9,
    backgroundColor: "#120E2E",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    paddingTop: 10,
  },
});
