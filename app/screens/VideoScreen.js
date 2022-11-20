import { Image, ScrollView, StyleSheet, View, TouchableOpacity, Dimensions, ActivityIndicator} from "react-native";
import React from "react";

import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Text from "../components/Text";
import { Icon } from "@rneui/base";
import { useUserAuth } from "../context/UserAuthContext";
import Video from "react-native-video";
import { useVideoData } from "../context/VideoDataContext";
import AppText from "../components/Text";
import TouchableIcon from "../components/TouchableIcon";

const fullWidth = Dimensions.get('window').width;

const VideoScreen = ({ navigation }) => {
  const {user, setUser} = useUserAuth();
  const {videoData, setVideoData} = useVideoData();
  console.log(videoData);
  return (
    <Screen style={{backgroundColor: colors.white}}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 20, paddingHorizontal: 10, backgroundColor: "#20194D"}}>
            <TouchableIcon
              name="arrow-left"
              size={30}
              onPress={() => {
                navigation.navigate("ReelsScreen");
              }}
            />
            <View style={{ flexDirection: "column",alignSelf: "center" }}>
              <AppText style={{ fontSize: 25, fontWeight: "700",
              marginLeft: 15,
              fontWeight: "500",
              color: "white", 
              alignItems: "center",
              }}>{videoData.title}</AppText>
            </View>
      </View>
      <View style={{ marginTop: 0, width: fullWidth }}>
        <ActivityIndicator style={{alignSelf:"center",height: fullWidth, width: fullWidth, justifyContent: "center"}} size={100} color="#20194D"/>
        <Video source={{uri: videoData.videoUrl}}   // Can be a URL or a local file.
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
    <View style={{ width: fullWidth, height: 'auto', backgroundColor: colors.white, paddingHorizontal: 10, paddingTop: 5,}}>
        <Text style={{color: colors.black, fontWeight: "500", fontSize: 20,paddingVertical: 10,}}>
            Description:
        </Text>
    </View>
    <ScrollView>
        <View style={{ width: fullWidth, height: '100%', backgroundColor: colors.white, paddingHorizontal: 20, paddingVertical: 5, marginBottom: 70, }}>
            <Text style={{color: colors.black, fontWeight: "400", fontSize: 16,}}>
            {videoData.description}
            </Text>
        </View>
    </ScrollView>
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