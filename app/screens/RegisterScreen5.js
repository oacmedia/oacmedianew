import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import Text from "../components/Text";
import { Form, FormField, SubmitButton } from "../components/forms";
import defaultStyles from "../config/styles";
import { useUserAuth } from "../context/UserAuthContext";
import firebase from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

const validationSchema = Yup.object().shape({
  phone: Yup.string().required().label("OTP"),
});

function RegisterScreen5({ navigation }) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  //const [code, setCode] = useState('');
  const {user, setUser} = useUserAuth();
  const [loginUser, setLoginUser] = useState('');

  // Handle user state changes
  function onAuthStateChanged(user) {
    setLoginUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle confirm code button press
  async function confirmCode(code) {
    try {
      console.log(user.verCode2);
      console.log(code);
      const credential = auth.PhoneAuthProvider.credential(user.verCode2, code);
      console.log(credential);
      let userData = await auth().signInWithCredential(credential);
      console.log(userData);
      navigation.push("HomeScreen");
    } catch (error) {
      if (error.code == 'auth/invalid-verification-code') {
        console.log('Invalid code.');
      } else {
        console.log(error);
      }
    }
  }

  //if (initializing) return null;

  return (
    <Screen style={styles.container}>
      <Text style={styles.h1}>Enter the OTP you received</Text>
      <Form
        initialValues={{ otp: "" }}
        onSubmit={async(values) => {
          console.log(values);
          const userCreate = await firestore().collection('Users').doc();
          const dat = await userCreate.add({
            firstName: user.firstname,
            lastName: user.lastname,
            title: user.title,
            password: user.password,
            phoneNumber: user.phone,
            country: user.countryCode,
            isAdmin: false,
          });

          console.log(user);
          //console.log("code" , code);
          //confirmCode();
        }}
        //validationSchema={validationSchema}
      >
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          name="otp"
          placeholder={"OTP"}
          keyboardType="phone-pad"
        />
        <SubmitButton title="Next" onTap={()=>{console.log('Ki Hal Ay!')}}/>
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
  countryContainer: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },
  countrySelector: {
    alignItems: "center",
    minWidth: "100%",
    padding: 15,
    borderRadius: 25,
  },
});

export default RegisterScreen5;
