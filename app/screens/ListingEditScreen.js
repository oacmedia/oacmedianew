import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import { Form, FormField, SubmitButton } from "../components/forms";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import { POSTS } from "../data/posts";

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useUserAuth } from "../context/UserAuthContext";


const validationSchema = Yup.object().shape({
  description: Yup.string().label("Description"),
  images: Yup.array().min(1, "Please select at least one image."),
});

function ListingEditScreen({ navigation }) {
  const {user, setUser} = useUserAuth();

  const handleSubmit = async(listing, { resetForm }) => {
    //console.log(listing.images[0]);

    // path to existing file on filesystem
    const pathToFile = (listing.images[0]).toString();
    let filename = pathToFile.substring(pathToFile.lastIndexOf('/')+1);

    //console.log(filename);

    const image = await storage().ref(filename).putFile(pathToFile);
    //console.log(listing.description);
    const url = await storage().ref(image.metadata.fullPath).getDownloadURL();
    if(url){
      const postCreate = await firestore().collection('Posts').doc();
      postCreate.set({
        imageURL: url,
        caption: listing.description,
        userID: user.phoneNumber,
       })
      // navigation.navigate("HomeScreen", {imageURL: url,
      //   caption: listing.description,
      //   userID: user.phoneNumber,});
      resetForm();
      navigation.navigate("HomeScreen", {posted: true});
    }
  };
  // async (listing, { resetForm }) => {
  //   const result = await listingsApi.addListing({ ...listing });

  //   if (!result.ok) {
  //     return alert("Could not save the listing");
  //   }
  //   resetForm();
  // };

  return (
    <Screen style={styles.container}>
      <Form
        initialValues={{
          description: "",
          images: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <FormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Description"
        />
        <SubmitButton title="Post" />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
export default ListingEditScreen;
