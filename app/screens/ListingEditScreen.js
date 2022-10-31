import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, Dimensions, Keyboard, TouchableWithoutFeedback } from "react-native";
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
  const [processInd, setProcessInd] = useState(false);
  const fullWidth = Dimensions.get('window').width;
  const fullHeight = Dimensions.get('window').height;
  let count = 0;
  function processImage(listing, { resetForm }){
    let array = [];
    array = listing.images.map((content)=>{
      let pathToFile = content.toString();
      let filename = pathToFile.substring(pathToFile.lastIndexOf('/')+1);
      
      let image = storage().ref(filename).putFile(pathToFile)
      image.on('state_changed',taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });
      image.then(async(data) => {
        count++;
        let url = await storage().ref(data.metadata.fullPath).getDownloadURL();
        console.log('File: '+data.metadata.name+' uploaded to the bucket!');
        array.push({path: data.metadata.fullPath,type: data.metadata.contentType,url: url});
        
        if(data.state == "success" && listing.images.length == count){
          count = 0;
          array.splice(0,listing.images.length);
          if(array.length > 0){
              const postCreate = await firestore().collection('Posts').doc();
              postCreate.set({
                contents: array,
                caption: listing.description,
                userID: user.phoneNumber,
               });
              resetForm();
              navigation.navigate("HomeScreen");
            }else{
              return false;
            }
          //console.log(array);
        }
      });

    });
  }
  useEffect(()=>{
    
  },[])

  const handleSubmit = async(listing, { resetForm }) => {
    Keyboard.dismiss();
    setProcessInd(true);
    //console.log(listing.images[0]);
    processImage(listing, { resetForm });

    }
  // async (listing, { resetForm }) => {
  //   const result = await listingsApi.addListing({ ...listing });

  //   if (!result.ok) {
  //     return alert("Could not save the listing");
  //   }
  //   resetForm();
  // };

  return (
    <Screen style={styles.container}>
      {processInd && <ActivityIndicator style={{alignSelf:"center",height: fullHeight, width: fullWidth, justifyContent: "center"}} size={100} color="white"/>}
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
