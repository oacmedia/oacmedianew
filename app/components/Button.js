import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function AppButton({
  title,
  onPress,
  backgroundColor = "primary",
  color = "white",
  width = "100%",
  fontSize = 18,
  style,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors[backgroundColor], width },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: colors[color] }, { fontSize }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
  },
  text: {
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
