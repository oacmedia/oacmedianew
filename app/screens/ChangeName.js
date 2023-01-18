import React from "react";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import Text from "../components/Text";
import { Form, FormField, SubmitButton } from "../components/forms";
import AppPicker from "../components/Picker";
import { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import {useUserAuth} from "../context/UserAuthContext";

const categories = [
  { label: "Bro", value: 1 },
  { label: "Sis", value: 2 },
  { label: "Underd", value: 3 },
  { label: "Priest", value: 4 },
  { label: "Elder", value: 5 },
  { label: "Ov", value: 6 },
  { label: "Ever", value: 7 },
  { label: "Apostle", value: 8 },
];

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().label("First Name"),
  lastname: Yup.string().required().label("Last Name"),
});

function ChangeName({ navigation }) {
  const [category, setCategory] = useState('');
  const [firstname , setFirstname] = useState('');
  const [lastname , setLastname] = useState('');
  const {user, setUser} = useUserAuth();
  const [catError, setCatError] = useState('');
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.h1}>Change Your Title and Username</Text>
        <Text style={styles.text}>Enter the name you use in real life.</Text>
        {catError.length > 0 &&
          <Text style={styles.error}>{catError}</Text>
        }
        <AppPicker
          placeholder={"Title"}
          items={categories}
          selectedItem={category}
          onSelectItem={(item) => setCategory(item)}
        />
        <Form
          initialValues={{firstname,lastname}}
          onSubmit={(values) => {
            if(!category){
              setCatError("Select Your Favourite Title!");
              return false;
            }
            setCatError('');
            firestore().collection('Users').doc(user.id).update({
              title: category.label,
              firstName: values.firstname,
              lastName: values.lastname
            }).then(()=>{
              console.log('updated');
              navigation.navigate("AccountScreen");
            })
            // setUser((prev) => ({...prev , firstname: values.firstname , lastname : values.lastname , title:category.label}))
            // navigation.navigate("RegisterScreen3" , values);
          }}
          validationSchema={validationSchema}
        >
          <FormField
            autoCorrect={false}
            name="firstname"
            value={firstname}
            placeholder="First Name"
            onChange={(e)=> setFirstname(e.target.value)}
          />
          <FormField
            autoCorrect={false}
            name="lastname"
            value={lastname}
            placeholder="Last Name"
            onChange={(e)=> setLastname(e.target.value)}
          />
          <SubmitButton title="Next" />
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
  h1: {
    alignSelf: "center",
    fontWeight: "800",
    marginBottom: 10,
    fontSize: 18,
  },
  error:{
    alignSelf: "center",
    color: "red",
  },
  text: {
    alignSelf: "center",
    fontSize: 14,
    marginBottom: 40,
  },
});

export default ChangeName;
