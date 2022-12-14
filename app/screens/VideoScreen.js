import { Image, ScrollView, StyleSheet, View, TouchableOpacity, Dimensions, ActivityIndicator, TouchableWithoutFeedback} from "react-native";
import React, { useState } from "react";

import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Text from "../components/Text";
//import { Icon } from "@rneui/base";
import { useUserAuth } from "../context/UserAuthContext";
import Video from "react-native-video";
import { useVideoData } from "../context/VideoDataContext";
import AppText from "../components/Text";
import TouchableIcon from "../components/TouchableIcon";
import ProgressBar from 'react-native-progress/Bar';
import Icon from "react-native-vector-icons/FontAwesome";

const fullWidth = Dimensions.get('window').width;

const VideoScreen = ({ navigation }) => {
  const {user, setUser} = useUserAuth();
  const {videoData, setVideoData} = useVideoData();
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const handleMainButtonTouch = () => {
    if(progress > 1){
      Video.player.seek(0);
    }
    setPaused(!paused);
  }
  function secondToTime(time){
    return ~~(time / 60)+ ":" + (time % 60 < 10 ? "0" : "") + time % 60;
  }
  const handleProgressPress = (e) =>{
    const position = e.nativeEvent.locationX;
    const progress = (position / 250) * duration;
    Video.player.seek(progress);
  }
  const handleEnd = () =>{
    setPaused(true);
  }
  const handleProgress = (progress) =>{
    setProgress(progress.currentTime / duration);
  }
  const handleLoad = (meta) =>{
    setDuration(meta.duration);
  }
  // const {width} = Dimensions.get("window");
  // const height = width * .5625;
  // var date = new Date(0);
  // date.setSeconds(45); // specify value for SECONDS here
  // var timeString = date.toISOString().substring(11, 19);
  // console.log(timeString);
  return (
    <Screen style={{backgroundColor: "#563df4"}}>
      {/* <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 20, paddingHorizontal: 10, backgroundColor: "#563df4"}}>
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
      </View> */}
      <View style={{ marginTop: 0, width: fullWidth }}>
        <ActivityIndicator style={{alignSelf:"center",height: fullWidth, width: fullWidth, justifyContent: "center"}} size={100} color="#FFF"/>
        <Video source={{uri: videoData.videoUrl}}   // Can be a URL or a local file.
            paused={paused}
            onLoad={handleLoad}
            onProgress={handleProgress}
            onEnd={handleEnd}
            ref={(ref) => {
            Video.player = ref
            }}
            poster={'https://firebasestorage.googleapis.com/v0/b/oacmedia-app-8464c.appspot.com/o/thumbnail.jpg?alt=media&token=1d69f50c-8546-4cbe-9fcc-a42f170ff31d'}
            posterResizeMode={"cover"}
            // controls
            resizeMode={"cover"}
            // onBuffer={Video.onBuffer}                // Callback when remote video is buffering
            // onError={Video.videoError}               // Callback when video cannot be loaded
            style={styles.backgroundVideo}
        />
        <View style={styles.controls}>
            <TouchableWithoutFeedback 
            onPress={handleMainButtonTouch}>
              <Icon
                name={!paused ? "pause" : "play"}
                size={30} color="#FFF"
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={handleProgressPress}
            >
              <View>
                <ProgressBar 
                  progress={progress}
                  color="#FFF"
                  unfilledColor="rgba(255,255,255,.5)"
                  borderColor="#FFF"
                  width={250}
                  height={20}
                />
              </View>
            </TouchableWithoutFeedback>
            <Text 
              style={styles.duration}
            >
              {secondToTime(Math.floor(progress * duration))}
            </Text>
            
        </View>
    </View>
    <View style={{ width: fullWidth, height: 'auto', backgroundColor: "#563df4", paddingHorizontal: 10, paddingTop: 5,}}>
        <Text style={{color: "#FFF", fontWeight: "500", fontSize: 20,paddingVertical: 10, alignSelf: "center"}}>
            About
        </Text>
    </View>
    <View style={{backgroundColor:"#FFF", width: "95%",padding: 1, alignSelf: "center"}}>
    </View>
    <View style={{ flexDirection: "column",alignSelf: "center" }}>
      <AppText style={{ fontSize: 25, fontWeight: "700",
      marginTop: 15,
      fontWeight: "500",
      color: "white", 
      alignItems: "center",
      }}>{videoData.title}</AppText>
    </View>
    <ScrollView>
        <View style={{ width: fullWidth, height: '100%', backgroundColor: "#563df4", paddingHorizontal: 20, paddingVertical: 15, marginBottom: 70, }}>
            <Text style={{color: "#FFF", fontWeight: "400", fontSize: 16,}}>
            {videoData.description}
            </Text>
        </View>
    </ScrollView>
    <BottomTabs navigation={navigation} scrName={"ReelsScreen"}/>
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
  duration: {
    color: "#FFF",
    marginLeft: 15,
  },
  mainButton: {
    marginRight: 15,
  },
  controls: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: 48,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  }
});