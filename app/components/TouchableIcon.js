import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import Icon from "./Icon";

const TouchableIcon = ({ badge, name, onPress, size, style, iconColor }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {badge && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{badge}</Text>
        </View>
      )}
      <Icon iconColor={iconColor} name={name} size={size} style={style} />
    </TouchableOpacity>
  );
};

export default TouchableIcon;

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    resizeMode: "contain",
  },
  unreadBadge: {
    backgroundColor: "#FF3250",
    position: "absolute",
    left: 20,
    bottom: 18,
    width: 25,
    height: 18,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9,
  },
  unreadBadgeText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
