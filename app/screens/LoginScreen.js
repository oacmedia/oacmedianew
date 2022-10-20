import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import { Form, FormField, SubmitButton } from "../components/forms";
import Text from "../components/Text";
import colors from "../config/colors";
import {firebase, FirebaseApp} from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";

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
//  useEffect(() => {
//      const docRef = firestore().collection("c1").doc();
//      docRef.set({
//        ukasha: "begart",
//        isTrue: "Yes"
//      }).then(() => {
//        console.log("Custom Effect")
//      })
//    }, [])
//  console.log('Hello!');
  return (
    <Screen style={styles.container}>
      <Text style={styles.logo}>OAC</Text>

      <Form
        initialValues={{ phone: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async(values) => {
        const userData = await firestore().collection('Users').doc('5VyDBNvGpTl9FOxaD5f4').get();
        console.log(userData);
          //console.log(firestore.Timestamp.fromDate(new Date()));
//          collection('posts').add({
//              userId: '123',
//              post: 'post',
//              postTime: this.Timestamp.fromDate(new Date()),
//              likes: null,
//              comments: null,
//        })
//        .then(() => {
//          console.log('Post Added!');
//          Alert.alert(
//            'Post published!',
//            'Your post has been published Successfully!',
//        );
//        setPost(null);
      }
      //)
          //navigation.push("HomeScreen");
        }
        //}
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
        <TouchableOpacity onPress={() => navigation.push("RegisterScreen1")}>
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
  signupContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 50,
  },
});

export default LoginScreen;
