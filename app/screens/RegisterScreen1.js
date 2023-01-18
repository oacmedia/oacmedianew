import React from "react";
import { StyleSheet, View } from "react-native";

import Screen from "../components/ScreenLR";
import Text from "../components/Text";
import Button from "../components/Button";

function RegisterScreen({ navigation }) {
  return (
    <Screen
    //style={styles.container}
    >
      <View style={styles.container}>
        <Text style={styles.h1}>Join OAC Media</Text>
        <Text style={styles.text}>
          We'll help you create a new account in a few easy steps.
        </Text>
        <Button
          title={"Next"}
          onPress={() => navigation.navigate("RegisterScreen2")}
          backgroundColor="white"
          color="dark"
        />
      </View>
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
