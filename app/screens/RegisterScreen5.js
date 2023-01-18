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
import { encrypt, decrypt } from 'react-native-simple-encryption';

const validationSchema = Yup.object().shape({
  phone: Yup.string().required().label("OTP"),
});

function RegisterScreen5({ navigation }) {
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
  async function onAuthStateChanged(userD) {
    //alert(user);
    if(userD){
      setProcessInd(true);
      // let credential = await auth.PhoneAuthProvider.credential(user.verCode2, code);
      // auth().signInWithCredential(credential).then(async()=>{
        try {
          let phno = user.phone;
          const userCreate = firestore().collection('Users').doc(phno);
          let pass = encrypt('OaCmEdIa@', user.password);
          userCreate.set({
            id: user.phone,
            firstName: user.firstname,
            lastName: user.lastname,
            title: user.title,
            password: pass,
            phoneNumber: user.phone,
            country: user.countryCode,
            isAdmin: false,
            profile: 'https://firebasestorage.googleapis.com/v0/b/oacmedia-app-8464c.appspot.com/o/profileImages%2Fuser.png?alt=media&token=d7d1964f-3286-4297-8cf9-b6ecf27176fe',
          })
        .then(async() => {
          let phno = user.phone;
          const userData = await firestore().collection('Users').doc(phno).get();
          console.log(userData._exists); 
          let currentUser = userData._data;
          if(userData._exists){
            let data = currentUser;
            storage.save({
              key: 'loginState', // Note: Do not use underscore("_") in key!
              data: {
                phoneNumber: phno
              },
                      
              // if expires not specified, the defaultExpires will be applied instead.
              // if set to null, then it will never expire.
              expires: null
            });
            setUser(data);
            navigation.navigate("HomeScreen");
          }
        }).catch((error)=>{
          setProcessInd(false);
          console.log("Post Cannot Be Created!", error);
          //setOTPError("Enter a valid Code.");
        });
      }
      catch(error){
        if (error.code == 'auth/invalid-verification-code') {
          setProcessInd(false);
          //console.log('Invalid code.');
          setOTPError("Enter a valid Code.");
        } else {
          setProcessInd(false);
          console.log(error);
        }
      };
    }
    //setLoginUser(user);
    //if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle confirm code button press
  async function confirmCode(code) {
    try {
      //console.log(code);
      let credential = await auth.PhoneAuthProvider.credential(user.verCode2, code);
      auth().signInWithCredential(credential).then(async()=>{
          let phno = user.phone;
          const userCreate = firestore().collection('Users').doc(phno);
          let pass = encrypt('OaCmEdIa@', user.password);
          userCreate.set({
            id: user.phone,
            firstName: user.firstname,
            lastName: user.lastname,
            title: user.title,
            password: pass,
            phoneNumber: user.phone,
            country: user.countryCode,
            isAdmin: false,
            profile: 'https://firebasestorage.googleapis.com/v0/b/oacmedia-app-8464c.appspot.com/o/profileImages%2Fuser.png?alt=media&token=d7d1964f-3286-4297-8cf9-b6ecf27176fe',
          })
        .then(async() => {
          let phno = user.phone;
          const userData = await firestore().collection('Users').doc(phno).get();
          console.log(userData._exists);
          let currentUser = userData._data;
          if(userData._exists){
            let data = currentUser;
            storage.save({
              key: 'loginState', // Note: Do not use underscore("_") in key!
              data: {
                phoneNumber: phno
              },
                      
              // if expires not specified, the defaultExpires will be applied instead.
              // if set to null, then it will never expire.
              expires: null
            });
            setUser(data);
            navigation.navigate("HomeScreen");
          }
        }).catch((error)=>{
          setProcessInd(false);
          console.log("Post Cannot Be Created!", error);
          //setOTPError("Enter a valid Code.");
        });
      }).catch((error)=>{
        if (error.code == 'auth/invalid-verification-code') {
          setProcessInd(false);
          //console.log('Invalid code.');
          setOTPError("Enter a valid Code.");
        } else {
          setProcessInd(false);
          console.log(error);
        }
      });
    //   console.log(user.verCode2);
    //   console.log(code);
    //   const credential = auth.PhoneAuthProvider.credential(user.verCode2, code);
    //   console.log(credential);
    //   let userData = await auth().signInWithCredential(credential);
    //   console.log(userData);

    //   const userCreate = firestore().collection('Users').doc(user.phone);
    //   userCreate.set({
    //     id: user.phone,
    //     firstName: user.firstname,
    //     lastName: user.lastname,
    //     title: user.title,
    //     password: user.password,
    //     phoneNumber: user.phone,
    //     country: user.countryCode,
    //     isAdmin: false,
    //     profile: 'https://firebasestorage.googleapis.com/v0/b/oacmedia-app-8464c.appspot.com/o/profileImages%2Fuser.png?alt=media&token=d7d1964f-3286-4297-8cf9-b6ecf27176fe',
    //    })
    // .then(async() => {
    //   let phno = user.phone;
    //   const userData = await firestore().collection('Users').doc(phno).get();
    //   console.log(userData._exists);
    //   let currentUser = userData._data;
    //   if(userData._exists){
    //     let data = currentUser;
    //     setUser(data);
    //   }
    //   navigation.navigate("HomeScreen");
    // })
   } catch(error) {
      if (error.code == 'auth/invalid-verification-code') {
        setProcessInd(false);
        //console.log('Invalid code.');
        setOTPError("Enter a valid Code.");
      } else {
        setProcessInd(false);
        console.log(error);
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
              setProcessInd(false);
              setOTPError("OTP must contain 6 numbers!");
              return false;
            }
            setOTPError("");
            console.log(values);
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

export default RegisterScreen5;
