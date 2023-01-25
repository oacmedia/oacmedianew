import { Image, ScrollView, StyleSheet, View, TouchableOpacity, Dimensions, ActivityIndicator, TouchableWithoutFeedback, SafeAreaView} from "react-native";
import React, { useEffect, useState } from "react";

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
import Orientation from 'react-native-orientation-locker';

const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;

const VideoScreen = ({ navigation }) => {
  const {user, setUser} = useUserAuth();
  const {videoData, setVideoData} = useVideoData();
  const [paused, setPaused] = useState(false);
  const [mute, setMute] = useState(false);
  const [toggleFullScreen, setToggleFullScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fWidth, setFWidth] = useState(100);
  const [fHeight, setFHeight] = useState(100);
  
  const handleMainButtonTouch = () => {
    if(progress > 1){
      Video.player.seek(0);
    }
    setPaused(!paused);
  }
  const handleMuteButtonTouch = () => {
    setMute(!mute);
  }
  const handleFullScreen = () => {
    navigation.navigate("ReelsFullScreen");
  }
  function secondToTime(time){
    return ~~(time / 60)+ ":" + (time % 60 < 10 ? "0" : "") + time % 60;
  }
  const handleProgressPress = (e) =>{
    const position = e.nativeEvent.locationX;
    const progress = (position / (fullWidth-160)) * duration;
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

  useEffect(()=>{
    //Orientation.lockToPortrait();
    // console.log(Dimensions.get('window').width);
    setFWidth(Dimensions.get('window').width);
    setFHeight(Dimensions.get('window').height);
  },[])
  return (
    <Screen
    //style={{backgroundColor: "#563df4"}}
    >
      <View 
      //style={{ marginTop: 0, width: fullWidth }}
      >
        <ActivityIndicator style={{alignSelf:"center",height: fullWidth, width: fullWidth, justifyContent: "center"}} size={100} color="#FFF"/>
        <Video source={{uri: videoData.videoUrl}}   // Can be a URL or a local file.
            paused={paused}
            onLoad={handleLoad}
            onProgress={handleProgress}
            onEnd={handleEnd}
            muted={mute}
            ref={(ref) => {
            Video.player = ref
            }}
            poster={videoData.tUrl}
            posterResizeMode={"cover"}
            // controls
            resizeMode={"cover"}
            //fullscreen={true}
            fullscreen={toggleFullScreen}
            fullscreenAutorotate={true}
            fullscreenOrientation={"landscape"}
            // onBuffer={Video.onBuffer}                // Callback when remote video is buffering
            // onError={Video.videoError}               // Callback when video cannot be loaded
            style={styles.backgroundVideo}
        />
        <View style={styles.controls}>
            <TouchableWithoutFeedback 
            onPress={handleMainButtonTouch}>
              <Icon
                name={!paused ? "pause" : "play"}
                size={20} color="#FFF"
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
                  width={fullWidth-160}
                  height={2}
                />
              </View>
            </TouchableWithoutFeedback>
            <Text 
              style={styles.duration}
            >
              {secondToTime(Math.floor(progress * duration))}
            </Text>
            <TouchableWithoutFeedback 
            onPress={handleMuteButtonTouch}>
              <Icon
                name={!mute ? "volume-down" : "volume-off"}
                size={20} color="#FFF"
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={handleFullScreen}>
              <Icon
              //style={{marginLeft: 6,}}
                name={"arrows-alt"}
                size={20} color="#FFF"
              />
            </TouchableWithoutFeedback>
        </View>
    </View>
    <View style={{ width: fullWidth, height: 'auto',
    //backgroundColor: "#563df4",
    paddingHorizontal: 10, paddingTop: 5,}}>
        <Text style={{color: "#FFF", fontWeight: "500", fontSize: 20,paddingVertical: 10, alignSelf: "center"}}>
            About
        </Text>
    </View>
    <View style={{backgroundColor:"#FFF", width: "95%",padding: 1, alignSelf: "center"}}>
    </View>
    <View style={{ flexDirection: "column",alignSelf: "flex-start", marginLeft:10, }}>
      <AppText style={{ fontSize: 15, fontWeight: "700",
      marginTop: 15,
      fontWeight: "500",
      color: "white", 
      alignItems: "center",
      }}>{videoData.title}</AppText>
    </View>
    <View style={{ flexDirection: "column",alignSelf: "flex-start", marginLeft:10, }}>
      <AppText style={{ fontSize: 17, fontWeight: "700",
      marginTop: 15,
      fontWeight: "500",
      color: "white", 
      alignItems: "center",
      }}>{"Description"}</AppText>
    </View>
    <ScrollView style={{padding: 10}}>
        <View style={{ width: fullWidth-22, 
        //backgroundColor: "#563df4",
        paddingHorizontal: 20, paddingVertical: 15, marginBottom: 70, marginTop: 2,
        backgroundColor:"rgba(220,220,220,0.2)",borderRadius:30 }}>
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
    marginLeft: 5,
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

