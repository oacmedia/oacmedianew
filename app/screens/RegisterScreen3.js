import React from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import Text from "../components/Text";
import { Form, FormField, SubmitButton } from "../components/forms";
import {useUserAuth} from "../context/UserAuthContext";
const validationSchema = Yup.object().shape({
  password: Yup.string().required().min(4).label("Password"),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .label("Password"),
});

function RegisterScreen({ navigation }) {
  const {setUser} = useUserAuth();
  return (
    <Screen style={styles.container}>
      <Text style={styles.h1}>Let's set up a password for you</Text>
      <Text style={styles.text}>Enter your password.</Text>
      <Form
        initialValues={{ password: "" }}
        onSubmit={(values) => {
          console.log(values);
          setUser((prev) => ({...prev , password: values.password}))
          navigation.push("RegisterScreen4");
        }}
        validationSchema={validationSchema}
      >
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="confirmPassword"
          placeholder="Confirm Password"
          secureTextEntry
          textContentType="password"
        />
        <SubmitButton title="Register" />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: "25%",
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
