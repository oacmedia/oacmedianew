import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import { Form, FormField, SubmitButton } from "../components/forms";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import { POSTS } from "../data/posts";

const validationSchema = Yup.object().shape({
  description: Yup.string().label("Description"),
  images: Yup.array().min(1, "Please select at least one image."),
});

function ListingEditScreen({ navigation }) {
  // const [posts, setPosts] = useState([]);

  // useEffect(() => {
  //   setPosts(POSTS);
  // }, []);

  const handleSubmit = (listing, { resetForm }) => {
    console.log(listing);
    resetForm();
    navigation.push("HomeScreen");
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
