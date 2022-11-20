import { Image, ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator, Dimensions, Keyboard } from "react-native";
import React from "react";
import * as Yup from "yup";
import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Text from "../components/Text";
import AppText from "../components/Text";
import { Form, FormField, SubmitButton } from "../components/forms";
import AppPicker from "../components/Picker";
import { Icon } from "@rneui/base";
import { useUserAuth } from "../context/UserAuthContext";
import { useState } from "react";
import { useEffect } from "react";
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import { useDataSharing } from "../context/DataSharingContext";

// const categories = [
//   { label: "Bro", value: 1 },
//   { label: "Sis", value: 2 },
//   { label: "Underd", value: 3 },
//   { label: "Priest", value: 4 },
//   { label: "Elder", value: 5 },
//   { label: "Ov", value: 6 },
//   { label: "Ever", value: 7 },
//   { label: "Apostle", value: 8 },
// ];

const validationSchema = Yup.object().shape({
  title: Yup.string().required().label("Title"),
  description: Yup.string().required().label("Description"),
});

const AddVideoData = ({ navigation }) => {
  const {user, setUser} = useUserAuth();
  const [category, setCategory] = useState('');
  const [catError, setCatError] = useState('');
  const [categories, setCategories] = useState('');
  const [title , setTitle] = useState('');
  const {sharedData, setSharedData} = useDataSharing();
  const [description, setDescription] = useState('');
  const [processInd, setProcessInd] = useState(false);
  const fullWidth = Dimensions.get('window').width;
  const fullHeight = Dimensions.get('window').height;

  let array = [];
  let count = 0;
  useEffect(()=>{
    firestore().collection('Categories').get().then((snapshot)=>{
        snapshot.docs.map((request)=>{
            count++;
            let data = request.data();
            //console.log(request.data());
            array.push({label: data.category, value: count})
            if(count == snapshot.docs.length){
                setCategories(array);
            }
        })
    })
  })

  return (
    <Screen>
        {processInd && <ActivityIndicator style={{alignSelf:"center",height: fullHeight, width: fullWidth, justifyContent: "center"}} size={100} color="white"/>}
        <View style={{ alignSelf: "center", marginVertical: 20 }}>
            <AppText style={{ fontSize: 25, fontWeight: "700" }}>Add Video Details</AppText>
        </View>
        <View style={styles.container}>
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
                initialValues={{title,description}}
                onSubmit={(values) => {
                Keyboard.dismiss();
                setProcessInd(true);
                if(!category){
                    setCatError("Select Category First!");
                    return false;
                }
                setCatError('');
                console.log(values);
                console.log(sharedData);
                firestore().collection('Videos').doc().set({
                    title: values.title,
                    description: values.description,
                    category: category,
                    videoUrl: sharedData.url,
                    videoPath: sharedData.path,
                    videoType: sharedData.type,
                    thumbUrl: sharedData.thumbUrl,
                    thumbPath: sharedData.thumbPath,
                    thumbType: sharedData.thumbType,
                }).then(()=>{
                    setProcessInd(false);
                    navigation.navigate("ReelsScreen");    
                }).catch((e)=>{
                    setProcessInd(false);
                    console.log(e);
                })
                //setUser((prev) => ({...prev , firstname: values.firstname , lastname : values.lastname , title:category.label}))
                //navigation.navigate("RegisterScreen3" , values);
                }}
                validationSchema={validationSchema}
            >
            <FormField
                autoCorrect={false}
                name="title"
                value={title}
                placeholder="Enter Your Video Title"
                onChange={(e)=> setTitle(e.target.value)}
            />
            <FormField
                maxLength={255}
                multiline
                name="description"
                numberOfLines={3}
                placeholder="Description"
            onChange={(e)=> setDescription(e.target.value)}
            />
            <SubmitButton title="Done" />
            </Form>
        </View>
    </Screen>
  );
};

export default AddVideoData;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 10,
  },
  contText: {
    marginLeft: 20,
    fontSize: 16,
    fontWeight: "600",
  },
  thumbContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
  video: {
    marginRight: 10,
    width: 250,
    height: 150,
    resizeMode: "cover",
  },
});