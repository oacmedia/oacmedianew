import { Image, ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator, Dimensions, Keyboard } from "react-native";
import React, { useState } from "react";

import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Text from "../components/Text";
import { Icon } from "@rneui/base";
import { useUserAuth } from "../context/UserAuthContext";
import { useDataSharing } from "../context/DataSharingContext";
import ThumbInput from "../components/ThumbInput";
import ProfileChangeUpload from "../components/ProfileChangeUpload";
import AppText from "../components/Text";
import storage from '@react-native-firebase/storage';
import firestore from "@react-native-firebase/firestore";

let count = 0;

const ProfileChange = ({ navigation }) => {
  const {user, setUser} = useUserAuth();
  const {sharedData, setSharedData} = useDataSharing();
  const [processInd, setProcessInd] = useState(false);
  const fullWidth = Dimensions.get('window').width;
  const fullHeight = Dimensions.get('window').height;

  function uploadVideo(uri){
    Keyboard.dismiss();
    setProcessInd(true);
    let pathToFile = uri.toString();
    let filename = pathToFile.substring(pathToFile.lastIndexOf('/')+1);
    
    let image = storage().ref(filename).putFile(pathToFile)
    image.on('state_changed',taskSnapshot => {
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
    });
    image.then(async(data) => {
      count++;
      let url = await storage().ref(data.metadata.fullPath).getDownloadURL();
      console.log('File: '+data.metadata.name+' uploaded to the bucket!');
      //setSharedData((prev) => ({...prev , thumbPath: data.metadata.fullPath,thumbType: data.metadata.contentType,thumbUrl: url}))
      firestore().collection('Users').doc(user.id).update({
        profile: url,
      }).then(()=>{
        console.log('updated');
        setProcessInd(false);
        navigation.navigate("AccountScreen");
      })
      
      if(data.state == "success" && count == 1){
        setProcessInd(false);
        count = 0;
        navigation.navigate("ProfileChange");
      }
    })
    .catch((e)=>{
        setProcessInd(false);
        console.log(e)
    })
}

  return (
    <Screen>
      {processInd && <ActivityIndicator style={{alignSelf:"center",height: fullHeight, width: fullWidth, justifyContent: "center"}} size={100} color="white"/>}
      <View style={{ alignSelf: "center", marginVertical: 20 }}>
        <AppText style={{ fontSize: 25, fontWeight: "700" }}>Change Your Profile Picture</AppText>
      </View>
      <Text style={styles.text}>
        Picture must be of Aspect Ratio "1:1"
      </Text>
      <View style={styles.container}>
        <ProfileChangeUpload onChangeImage={(uri) => uploadVideo(uri)} />
      </View>
    </Screen>
  );
};

export default ProfileChange;

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
      btnCont: {
        padding: 10,
        paddingTop: "10%",
      },
      text: {
        width: "90%",
        textAlign: "center",
        alignSelf: "center",
        fontSize: 24,
        marginTop: 40,
      },
});