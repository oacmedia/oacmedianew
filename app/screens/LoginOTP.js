import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, Dimensions, Keyboard } from "react-native";
import * as Yup from "yup";

import Screen from "../components/ScreenLR";
import Text from "../components/Text";
import { Form, FormField, SubmitButton } from "../components/forms";
import defaultStyles from "../config/styles";
import { useUserAuth } from "../context/UserAuthContext";
import firebase from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from "../components/storage/storage";

const validationSchema = Yup.object().shape({
  phone: Yup.string().required().label("OTP"),
});

function LoginOTP({ navigation }) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  //const [code, setCode] = useState('');
  const {user, setUser} = useUserAuth();
  const [loginUser, setLoginUser] = useState('');
  const [otpError, setOTPError] = useState("");
  const [processInd, setProcessInd] = useState(false);
  const fullWidth = Dimensions.get('window').width;
  const fullHeight = Dimensions.get('window').height;

  // Handle user state changes
  async function onAuthStateChange(userD) {
    if(userD){
      setProcessInd(true);
      try {
          //console.log("It logged In!");
      
            let phno = user[0].phoneNumber;
            const userData = await firestore().collection('Users').doc(phno).get();
            console.log(userData._exists);
            let currentUser = userData._data;
            if(userData._exists){
              let data = currentUser;
              storage.save({
                key: 'loginState', // Note: Do not use underscore("_") in key!
                data: {
                  phoneNumber: currentUser.phoneNumber
                },
                        
                // if expires not specified, the defaultExpires will be applied instead.
                // if set to null, then it will never expire.
                expires: null
              });
              setProcessInd(false);
              setUser(data);
              navigation.navigate("HomeScreen");
            }
     } catch (error) {
        if (error.code == 'auth/invalid-verification-code') {
          //console.log('Invalid code.');
          setProcessInd(false);
          setOTPError("Enter a valid Code.");
        } else {
          setProcessInd(false);
          console.log(error);
          setOTPError("Enter a valid Code.");
        }
      }
    }
    // setLoginUser(user);
    // if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChange);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle confirm code button press
  async function confirmCode(code) {
    try {
      console.log(code);
      let credential = await auth.PhoneAuthProvider.credential(user[1].verCode, code);
      auth().signInWithCredential(credential).then(async()=>{
        console.log("It logged In!");
    
          let phno = user[0].phoneNumber;
          const userData = await firestore().collection('Users').doc(phno).get();
          console.log(userData._exists);
          let currentUser = userData._data;
          if(userData._exists){
            let data = currentUser;
            storage.save({
              key: 'loginState', // Note: Do not use underscore("_") in key!
              data: {
                phoneNumber: currentUser.phoneNumber
              },
                      
              // if expires not specified, the defaultExpires will be applied instead.
              // if set to null, then it will never expire.
              expires: null
            });
            setProcessInd(false);
            setUser(data);
            navigation.navigate("HomeScreen");
          }
      }).catch((error)=>{
        setProcessInd(false);
        setOTPError("Enter a valid Code.");
      });
   } catch (error) {
      if (error.code == 'auth/invalid-verification-code') {
        //console.log('Invalid code.');
        setProcessInd(false);
        setOTPError("Enter a valid Code.");
      } else {
        setProcessInd(false);
        console.log(error);
        setOTPError("Enter a valid Code.");
      }
    }
  }

  //if (initializing) return null;

  return (
    <Screen>
      {processInd && <ActivityIndicator style={{alignSelf:"center",height: fullHeight, width: fullWidth, justifyContent: "center"}} size={100} color="white"/>}
      <View style={styles.container}>
        <Text style={styles.h1}>Enter the OTP you received</Text>
        {otpError.length > 0 &&
            <Text style={styles.error}>{otpError}</Text>
          }
        <Form
          initialValues={{ otp: "" }}
          onSubmit={async(values) => {
            Keyboard.dismiss();
            setProcessInd(true);
            if((values.otp).length != 6){
              setOTPError("OTP must contain 6 numbers!");
              setProcessInd(false);
              return false;
            }
            setOTPError("");
            //console.log(values);
            confirmCode(values.otp);
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
          <SubmitButton title="Next"/>
        </Form>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: "25%",
  },
  error:{
    alignSelf: "center",
    color: "red",
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

export default LoginOTP;
