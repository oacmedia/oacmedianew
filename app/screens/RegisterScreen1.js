import React from "react";
import { StyleSheet } from "react-native";

import Screen from "../components/Screen";
import Text from "../components/Text";
import Button from "../components/Button";

function RegisterScreen({ navigation }) {
  return (
    <Screen style={styles.container}>
      <Text style={styles.h1}>Join OAC Media</Text>
      <Text style={styles.text}>
        We'll help you create a new account in a few easy steps.
      </Text>
      <Button
        title={"Next"}
        onPress={() => navigation.push("RegisterScreen2")}
        backgroundColor="light"
        color="dark"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: "40%",
  },
  h1: {
    alignSelf: "center",
    fontWeight: "800",
    marginBottom: 10,
  },
  text: {
    alignSelf: "center",
    fontSize: 14,
    marginBottom: 40,
  },
});

export default RegisterScreen;
