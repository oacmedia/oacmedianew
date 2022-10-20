import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";
import CountryPicker from "react-native-country-picker-modal";

import Screen from "../components/Screen";
import Text from "../components/Text";
import { Form, FormField, SubmitButton } from "../components/forms";
import defaultStyles from "../config/styles";
import firebase from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import {collection, addDoc, where, query, getDocs} from '@react-native-firebase/firestore';
import { useUserAuth } from "../context/UserAuthContext";
// const usersCollection = firestore().collection('Users');

//const querySnapshot = firebase.firestore();


const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required()
    .label("Phone"),
});

function RegisterScreen({ navigation }) {
  const [countryCode, setCountryCode] = useState("");
  const [callingCode, setCallingCode] = useState("");
  const {user, setUser} = useUserAuth();
  const [error, setError] = useState();
  //const [confirm, setConfirm] = useState(null);
  //const [code, setCode] = useState('');

  async function signInWPhoneNumber(phoneNumber) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
    return confirmation;
    console.log(confirmation);
  }
  
  // async function confirmCode() {
  //   try {
  //     await confirm.confirm(code);
  //   } catch (error) {
  //     console.log('Invalid code.');
  //   }
  // }

  
  // const [user, setUser] = useState();

  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);


  

  // Handle create account button press
  async function createAccount() {
    try {
      await auth().createUserWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!');
      console.log('User account created & signed in!');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
      console.error(error);
    }
  }

  // Handle the verify phone button press
  // async function verifyPhoneNumber(phoneNumber) {
  //   const confirmation = await auth().verifyPhoneNumber(phoneNumber);
  //   setConfirm(confirmation);
  //   console.log(confirm);
  // }

  // Handle confirm code button press
  // async function confirmCode() {
  //   try {
  //     const credential = auth.PhoneAuthProvider.credential(confirm.verificationId, code);
  //     let userData = await auth().currentUser.linkWithCredential(credential);
  //     setUser(userData.user);
  //   } catch (error) {
  //     if (error.code == 'auth/invalid-verification-code') {
  //       console.log('Invalid code.');
  //     } else {
  //       console.log('Account linking error');
  //     }
  //   }
  // }




  return (
    <Screen style={styles.container}>
      <Text style={styles.h1}>Enter your mobile number</Text>
      <Text style={styles.text}>
        Enter the mobile number where you can be reached.
      </Text>
      <View style={styles.countryContainer}>
        <CountryPicker
          withFilter
          countryCode={countryCode}
          withFlag
          withCallingCode
          withCountryNameButton
          onSelect={({ callingCode, cca2 }) => {
            setCallingCode(callingCode);
            setCountryCode(cca2);
          }}
          containerButtonStyle={styles.countrySelector}
        />
      </View>
      <Form
        initialValues={{ phone: "" }}
        onSubmit={async(values) => {
            //const user = await firestore().collection('Users').doc('5VyDBNvGpTl9FOxaD5f4');
            // const dat = await user.set({
            //   name: 'Ada Lovelace',
            //   age: 30,
            // });

            //console.log(user);
            

              




          //setError('');
          // console.log((callingCode[0] + values.phone).toString());
          // console.log("country" , countryCode);
           
          // const db = await usersCollection.get();

          // console.log({db});



          // const confirmation = await signInWithPhoneNumber(callingCode[0] + values.phone);
          // console.log(confirmation);
          // const usersCollectionRef = doc(db, 'users' , data.phone)
          // const colRef = firestore().collection('users')
          // const usersCollectionRef = firestore().collection('users').query(colRef , firestore().collection('users').where('phone' , '==' , data.phone));
          // const doc = await firestore().getDocs(usersCollectionRef);
          // if(doc.docs[0]){
          //   setError('Phone number already exist.');
          //   return
          // }
          // await firestore().collection('users').add(data);
          // console.log("user created successfully");
          // firestore().collection('Users').get()
          // .then(querySnapshot => {
          //   console.log('User added!');
          //   querySnapshot.forEach(record => {
          //     console.log(record.data());
          //   })
          // });
          //setUser({});
          // navigation.push("LoginScreen");
            // const email = 'ukashatariq21@gmail.com';
            // const password = '123456789';
            // const user = await auth().createUserWithEmailAndPassword(email,password);
            // console.log(user);
            const ph_no = ('+' + callingCode[0] + values.phone).toString();
            const verCode = await signInWPhoneNumber(ph_no);
            const verCode2 = verCode._verificationId;
            let data = {...user , phone: '+'+callingCode[0] + values.phone , countryCode, verCode2};
            setUser(data);
            // ()=>{
            //   return (
            //     <View>
            //       <Text style={styles.h1}>Enter the OTP you received</Text>
            //     <Form
            //       initialValues={{ phone: "" }}
            //       onSubmit={(values) => {
            //         console.log(values);
            //       }}
            //       validationSchema={validationSchema}
            //     >
            //       <FormField
            //         autoCapitalize="none"
            //         autoCorrect={false}
            //         name="OTP"
            //         placeholder={"OTP"}
            //         keyboardType="phone-pad"
            //       />
            //       <SubmitButton title="Next" />
            //       </Form>
            //     </View>
            //   )
            // };
            //console.log(phReg);
            //verifyPhoneNumber(ph_no);
          console.log(ph_no);
          navigation.push("RegisterScreen5");
        }}
        validationSchema={validationSchema}
      >
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="phone"
          name="phone"
          placeholder={"Phone number"}
          textContentType="telephoneNumber"
          keyboardType="phone-pad"
        />
        <SubmitButton title="Next" />
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

export default RegisterScreen;
