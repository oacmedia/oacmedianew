import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Divider } from "@rneui/themed";

import TouchableIcon from "../TouchableIcon";
import { BottomTabIcons } from "../../data/bottomIcons";

const BottomTabs = ({ navigation, scrName }) => {
  const [activeTab, setActiveTab] = useState(scrName);

  return (
    <View style={styles.wrapper}>
      <Divider width={1} orientation="vertical" />
      <View style={styles.container}>
        {BottomTabIcons.map((item, index) => (
          <TouchableIcon
            key={index}
            name={activeTab === item.name ? item.active : item.inactive}
            size={item.name == "MessagesScreen" ? 60: 35}
            iconColor={"#00008B"}
            onPress={() => {
              if(scrName && scrName == "HomeScreen"){
                setActiveTab("");
                navigation.navigate(item.name);  
              }else if(scrName){
                setActiveTab(item.name);
                navigation.navigate(item.name);
              }else{
                setActiveTab("");
                navigation.navigate(item.name);
              }
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
    backgroundColor: "#fff",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    paddingVertical: 10,
  },
});
