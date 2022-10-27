import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import { Form, FormField, SubmitButton } from "../components/forms";
import Text from "../components/Text";
import colors from "../config/colors";
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import { useUserAuth } from "../context/UserAuthContext";
import storage from "../components/storage/storage";
import CountryPicker from "react-native-country-picker-modal";
import defaultStyles from "../config/styles";

//let app = firebase.app();
//let app = firebase.apps[0].firestore;
//let app = firestore;


const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required()
    .label("Phone"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen({ navigation }) {
  const {user, setUser} = useUserAuth();
  const [countryCode, setCountryCode] = useState("");
  const [callingCode, setCallingCode] = useState("");
  const [ccError, setCCError] = useState("");
  const [epError, setEPError] = useState("");
  //console.log(user);
useEffect(() => {

  //storage
  storage.load({

    key: 'loginState',

      // autoSync (default: true) means if data is not found or has expired,
      // then invoke the corresponding sync method

      autoSync: true,

        // syncInBackground (default: true) means if data expired,

        // return the outdated data first while invoking the sync method.

        // If syncInBackground is set to false, and there is expired data,
        // it will wait for the new data and return only after the sync completed.
        // (This, of course, is slower)

        syncInBackground: true,



        // you can pass extra params to the sync method

        // see sync example below

        syncParams: {

        extraFetchOptions: {

        // blahblah

        },

        someFlag: true

      }
    })

    .then(async(ret) => {

      // found data go to then()

       //console.log(ret.phoneNumber);
       const userData = await firestore().collection('Users').doc(ret.phoneNumber).get();
       let logginedUser = userData._data;
       if(userData._exists){
        let data = logginedUser;
        //console.log(data);
        setUser(data);
        navigation.navigate("HomeScreen");
       }
      })
    .catch(err => {

      // any exception including data not found
      // goes to catch()
      console.log(err.message);
        switch (err.name) {
          case 'NotFoundError':

          // TODO

          break;
          case 'ExpiredError':
          // TODO
          break;
        }
    });


 // checking if already logged in!
  // if(user != null){
  //   if(user.phoneNumber && user.firstName){
  //     navigation.navigate("HomeScreen");
  //   }
  // }   
}, []);
  //console.log('Hello!');
  return (
    <Screen style={styles.container}>
      <Text style={styles.logo}>OAC</Text>
        {ccError.length > 0 &&
          <Text style={styles.error}>{ccError}</Text>
        }
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
            setCCError("");
          }}
          containerButtonStyle={styles.countrySelector}
        />
      </View>
      {epError.length > 0 &&
          <Text style={styles.error}>{epError}</Text>
        }
      <Form
        initialValues={{ phone: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async(values) => {
          if(!callingCode){
            setCCError("Select Country Code!");
            return false;
          }
          setEPError("");
          const phno = ('+' + callingCode[0] + values.phone).toString();
        //   let phno = ('+'+values.phone).toString();
        const userData = await firestore().collection('Users').doc(phno).get();
        console.log(userData._exists);
        let currentUser = userData._data;
        if(userData._exists){
          if(phno == currentUser.phoneNumber){
              if(values.password == currentUser.password){
                console.log('Successful!');
                console.log(currentUser);
                let data = currentUser;
                setUser(data);
                storage.save({
                  key: 'loginState', // Note: Do not use underscore("_") in key!
                  data: {
                    phoneNumber: currentUser.phoneNumber
                  },
                
                  // if expires not specified, the defaultExpires will be applied instead.
                  // if set to null, then it will never expire.
                  expires: null
                });
                navigation.navigate("HomeScreen");    
              }else{
                setEPError("Wrong Details!");
              }
          }else{
            setEPError("Wrong Details!");
          }
        }else{
          //console.log('User Does not exists!');
          setEPError("Wrong Details!");
        }

//        setPost(null);
      }
          //navigation.navigate("HomeScreen");
    }
      >
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="phone"
          keyboardType="phone-pad"
          name="phone"
          placeholder="Phone Number"
          textContentType="telephoneNumber"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        <SubmitButton title="Login" />
      </Form>

      <View style={styles.signupContainer}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen1")}>
          <Text style={{ color: colors.secondary }}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    fontSize: 72,
    fontWeight: "700",
    alignSelf: "center",
    marginTop: 80,
    marginBottom: 50,
  },
  error:{
    alignSelf: "center",
    color: "red",
  },
  signupContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 50,
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

export default LoginScreen;
