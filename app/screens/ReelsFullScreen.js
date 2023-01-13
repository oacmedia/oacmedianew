import React from "react";
import { StyleSheet, View, Dimensions, StatusBar, PixelRatio, TouchableWithoutFeedback } from "react-native";
import { useEffect, useState } from "react";
import Screen from "../components/Screen";
import Text from "../components/Text";
import Button from "../components/Button";
import Video from 'react-native-video';
import { useVideoData } from "../context/VideoDataContext";
import ProgressBar from 'react-native-progress/Bar';
import Icon from "react-native-vector-icons/FontAwesome";

import Orientation from 'react-native-orientation-locker';
import { hrtime } from "process";
var {height, width} = Dimensions.get('window');
const statusBarSize = 25;

function ReelsFullScreen({ navigation }) {
    const {videoData, setVideoData} = useVideoData();
    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    
    const handleFullScreen = () => {
        navigation.navigate("VideoScreen");
      }

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
        const progress = (position / (height-200)) * duration;
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
        Orientation.lockToPortrait();
    },[])
  return (
    <Screen 
    //style={styles.container}
    >
     <View
        style={{flex: 1, backgroundColor: "black"}}>
        <StatusBar hidden={true} />
        <View style={styles.topViewStyle}>
          <Video
            ref={(ref) => {
              Video.player = ref
            }}
            paused={paused}
            onLoad={handleLoad}
            onProgress={handleProgress}
            onEnd={handleEnd}
            //repeat={true}
            //paused={this.state.paused}
            //muted={this.state.muted}
            resizeMode={"contain"}
            source={{uri:videoData.videoUrl}}
            style={styles.videoStyle}
            //onLoad={this.onVideoLoaded.bind(this)}
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
                    width={height-200}
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
                onPress={handleFullScreen}>
                <Icon
                style={{marginLeft: 10,}}
                    name={"arrows-alt"}
                    size={20} color="#FFF"
                />
                </TouchableWithoutFeedback>
            </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  videoStyle: {
    height: width + statusBarSize,
    alignSelf: "stretch",
  },
  topViewStyle: {
    flex: 1,
    transform: [
      { rotateZ: '90deg'},
      { translateY: ((PixelRatio.getPixelSizeForLayoutSize(height)-
        PixelRatio.getPixelSizeForLayoutSize(width))/
        PixelRatio.get()) - statusBarSize },
    ],
    height: width,
    width: height,
  },
  container: {
    padding: 10,
    paddingTop: "40%",
  },
  h1: {
    alignSelf: "center",
    fontWeight: "800",
    marginBottom: 10,
  },
  text: {
    alignSelf: "center",
    fontSize: 14,
    marginBottom: 40,
  },
  controls: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: 48,
    left: 0,
    bottom: width,
    right: 0,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  }
});

export default ReelsFullScreen;


// import React, { Component } from 'react';
// import { AppRegistry, View, Dimensions, StatusBar, PixelRatio } from 'react-native';
// import Video from 'react-native-video';

// import Orientation from 'react-native-orientation-locker';

// var {height, width} = Dimensions.get('window');
// const statusBarSize = 25;

// export default class FullScreenVideo extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       videoStyle: {
//         height: width + statusBarSize,
//         alignSelf: "stretch",
//       },
//       topViewStyle: {
//         flex: 1,
//         transform: [
//           { rotateZ: '90deg'},
//           { translateY: ((PixelRatio.getPixelSizeForLayoutSize(height)-
//             PixelRatio.getPixelSizeForLayoutSize(width))/
//             PixelRatio.get()) - statusBarSize },
//         ],
//         height: width,
//         width: height,
//       },
//       paused: true,
//       muted: true,
//       sourceFile: "https://firebasestorage.googleapis.com/v0/b/oacmedia-app-8464c.appspot.com/o/3982f88f-9ddc-4b34-8e63-42bf5137a093.mp4?alt=media&token=5c07c64b-3fda-4fc5-ab0f-e7296ce455c3",
//       resizeMode: "cover"
//     }
//   }

//   onVideoLoaded() {
//     this.player.seek(1);
//   }

//   componentDidMount() {
//     Orientation.lockToPortrait();
//     this.setState({
//       paused: false,
//       muted: false,
//     });
//   }

//   componentWillUnmount() {
//     Orientation.lockToPortrait();
//   }

//   render() {
//     return (
//       <View
//         style={{flex: 1, backgroundColor: "black"}}>
//         <StatusBar hidden={true} />
//         <View style={this.state.topViewStyle}>
//           <Video
//             ref={(ref) => {
//               this.player = ref
//             }}
//             repeat={true}
//             paused={this.state.paused}
//             muted={this.state.muted}
//             resizeMode={this.state.resizeMode}
//             source={{uri:"https://firebasestorage.googleapis.com/v0/b/oacmedia-app-8464c.appspot.com/o/3982f88f-9ddc-4b34-8e63-42bf5137a093.mp4?alt=media&token=5c07c64b-3fda-4fc5-ab0f-e7296ce455c3"}}
//             style={this.state.videoStyle}
//             onLoad={this.onVideoLoaded.bind(this)}
//           />
//         </View>
//       </View>
//     );
//   }
// }