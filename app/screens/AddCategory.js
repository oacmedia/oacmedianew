import { Image, ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator, Dimensions, Keyboard } from "react-native";
import React from "react";

import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Text from "../components/Text";
import { Icon } from "@rneui/base";
import { useUserAuth } from "../context/UserAuthContext";
import * as Yup from "yup";
import { Form, FormField, SubmitButton } from "../components/forms";
import AppText from "../components/Text";
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import { useState } from "react";

const validationSchema = Yup.object().shape({
    category: Yup.string().required().label("Category Name"),
  });

const AddCategory = ({ navigation }) => {
  const {user, setUser} = useUserAuth();
  const [processInd, setProcessInd] = useState(false);
  const fullWidth = Dimensions.get('window').width;
  const fullHeight = Dimensions.get('window').height;
  return (
    <Screen>
        {processInd && <ActivityIndicator style={{alignSelf:"center",height: fullHeight, width: fullWidth, justifyContent: "center"}} size={100} color="white"/>}
        <View style={styles.container}>
          <View style={{ alignSelf: "center", marginVertical: 20 }}>
            <AppText style={{ fontSize: 25, fontWeight: "700" }}>Add Category</AppText>
          </View>
          <Form
            initialValues={{ category: "" }}
            onSubmit={(values) => {
                Keyboard.dismiss();
                setProcessInd(true);
              console.log(values);
              firestore().collection('Categories').doc().set(values).then(()=>{
                setProcessInd(false);
                console.log("Category Added!");
                navigation.navigate("UploadVideo");
              })
            }}
            validationSchema={validationSchema}
          >
            <FormField
              autoCapitalize="none"
              autoCorrect={false}
              icon="plus"
              name="category"
              placeholder="Type Category Name"
            />
            <SubmitButton title="Add Category" />
          </Form>
        </View>
    </Screen>
  );
};

export default AddCategory;

const styles = StyleSheet.create({
  container: {
   //paddingTop: 30,
   paddingHorizontal: 10,
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