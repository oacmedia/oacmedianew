import React from "react";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";

import Screen from "../components/ScreenLR";
import Text from "../components/Text";
import { Form, FormField, SubmitButton } from "../components/forms";
import AppPicker from "../components/Picker";
import { useState } from "react";

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

function RegisterScreen({ navigation }) {
  const [category, setCategory] = useState('');
  const [firstname , setFirstname] = useState('');
  const [lastname , setLastname] = useState('');
  const {setUser} = useUserAuth();
  const [catError, setCatError] = useState('');
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.h1}>What's your name?</Text>
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
            console.log(values);
            setUser((prev) => ({...prev , firstname: values.firstname , lastname : values.lastname , title:category.label}))
            navigation.navigate("RegisterScreen3" , values);
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

export default RegisterScreen;
