import { Image, ScrollView, StyleSheet, View, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import React from "react";

import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Text from "../components/Text";
import { Icon } from "@rneui/base";
import { useUserAuth } from "../context/UserAuthContext";
import Video from "react-native-video";

const fullWidth = Dimensions.get('window').width;

const VideoScreen = ({ navigation }) => {
  const {user, setUser} = useUserAuth();
  return (
    <Screen style={{backgroundColor: colors.white}}>
      <View style={{ marginTop: 0, width: fullWidth }}>
        <ActivityIndicator style={{alignSelf:"center",height: fullWidth, width: fullWidth, justifyContent: "center"}} size={100} color="#20194D"/>
        <Video source={{uri: 'https://firebasestorage.googleapis.com/v0/b/oacmedia-app-8464c.appspot.com/o/d5fa8c8f-ad46-4224-8549-950d36468ce0.mp4?alt=media&token=272269a5-d184-4fb9-8038-ad6704c38735'}}   // Can be a URL or a local file.
            ref={(ref) => {
            Video.player = ref
            }}
            controls
            resizeMode={"cover"}
            onBuffer={Video.onBuffer}                // Callback when remote video is buffering
            onError={Video.videoError}               // Callback when video cannot be loaded
            style={styles.backgroundVideo}
        />
    </View>
    <View style={{ marginTop: 0, width: fullWidth, height: 'auto', backgroundColor: colors.white, paddingHorizontal: 10, paddingTop: 10, }}>
        <Text style={{color: colors.black, fontWeight: "600", fontSize: 24,}}>
            This is Video Title
        </Text>
    </View>
    <View style={{ width: fullWidth, height: 'auto', backgroundColor: colors.white, paddingHorizontal: 10, paddingTop: 5,}}>
        <Text style={{color: colors.black, fontWeight: "500", fontSize: 20,}}>
            Description:
        </Text>
    </View>
    <ScrollView>
        <View style={{ width: fullWidth, height: '100%', backgroundColor: colors.white, paddingHorizontal: 20, paddingVertical: 5, marginBottom: 70, }}>
            <Text style={{color: colors.black, fontWeight: "400", fontSize: 16,}}>
            Its Video's Description. Just wrote to check how description looks on videos page. if it looks fine i will go with or i have change its styling Its Video's Description.
            </Text>
        </View>
    </ScrollView>
      <BottomTabs navigation={navigation}/>
    </Screen>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
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
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: fullWidth,
    width: fullWidth,
    backgroundColor: "transparent",
  },
});