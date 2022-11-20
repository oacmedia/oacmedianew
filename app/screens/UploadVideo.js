import { Image, ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator, Dimensions, Keyboard } from "react-native";
import React from "react";

import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Text from "../components/Text";
import AppText from "../components/Text";
import { Icon } from "@rneui/base";
import { useUserAuth } from "../context/UserAuthContext";
import VideoInput from "../components/VideoInput";
import Button from "../components/Button";
import { useDataSharing } from "../context/DataSharingContext";
import storage from '@react-native-firebase/storage';
import { useState } from "react";

const UploadVideo = ({ navigation }) => {
  const {user, setUser} = useUserAuth();
  const {sharedData, setSharedData} = useDataSharing();
  const [processInd, setProcessInd] = useState(false);
  const fullWidth = Dimensions.get('window').width;
  const fullHeight = Dimensions.get('window').height;
  let count = 0;
  
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
          setSharedData({path: data.metadata.fullPath,type: data.metadata.contentType,url: url});
          
          if(data.state == "success" && count == 1){
            setProcessInd(false);
            count = 0;
            navigation.navigate("SelectThumbnail");
            //console.log(array);
          }
        })
        .catch((e)=>{
            setProcessInd(false);
            console.log(e)
        })
        // setSharedData({url: 'https://firebasestorage.googleapis.com/v0/b/oacmedia-app-8464c.appspot.com/o/ce1dfc18-4f3b-41f0-88c8-9748c5a18a00.mp4?alt=media&token=190cf62a-cf50-4317-a534-28c88c2816b2'});
        // navigation.navigate("SelectThumbnail");
    }

  return (
    <Screen>
        {processInd && <ActivityIndicator style={{alignSelf:"center",height: fullHeight, width: fullWidth, justifyContent: "center"}} size={100} color="white"/>}
      <View style={{ alignSelf: "center", marginVertical: 20 }}>
        <AppText style={{ fontSize: 25, fontWeight: "700" }}>Upload Video</AppText>
      </View>
      <View style={styles.container}>
        <VideoInput onChangeImage={(uri) => uploadVideo(uri)} />
      </View>
      <View style={styles.btnCont}>
        <Button
            title={"Add Category"}
            onPress={() => navigation.navigate("AddCategory")}
            backgroundColor="light"
            color="dark"
        />
        <Button
            title={"Delete Category"}
            onPress={() => navigation.navigate("DeleteCategory")}
            backgroundColor="light"
            color="dark"
        />
      </View>
      <BottomTabs navigation={navigation}/>
    </Screen>
  );
};

export default UploadVideo;

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
  }
});