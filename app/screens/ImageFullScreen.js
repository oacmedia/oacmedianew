import React from "react";
import { Image, StyleSheet, View, Dimensions, StatusBar, PixelRatio, TouchableWithoutFeedback,TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import Screen from "../components/Screen";
import Text from "../components/Text";
import Button from "../components/Button";
import Pinchable from "react-native-pinchable";
import { useVideoData } from "../context/VideoDataContext";
var {height, width} = Dimensions.get('window');
import { Icon } from "@rneui/base";
const statusBarSize = 25;

function ImageFullScreen({ navigation }) {
    const {videoData, setVideoData} = useVideoData();
    
    useEffect(()=>{
        //Orientation.lockToPortrait();
    },[])
  return (
    <Screen 
    //style={styles.container}
    >
     <View
        style={{flex: 1, backgroundColor: "black"}}>
        <TouchableOpacity
        style={{
            borderWidth:5,
            borderColor:"transparent",
            alignItems:'center',
            justifyContent:'center',
            width:65,
            height:65,
            backgroundColor:'transparent',
            borderRadius:50,
            position: "absolute",
            zIndex: 1,
            top: 10,
            right: 10,
          }}
        onPress={() => {
            navigation.navigate("HomeScreen");
          }}
      >
        <Icon name={"close"}  size={35} color={"white"} />
      </TouchableOpacity>
        <View style={styles.topViewStyle}>
          <Pinchable>
            <Image source={{ uri: videoData.url, width: width }}
              style={{ 
                height: "100%", resizeMode: "contain"
                }}></Image>
          </Pinchable>
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
    // transform: [
    //   { rotateZ: '90deg'},
    //   { translateY: ((PixelRatio.getPixelSizeForLayoutSize(height)-
    //     PixelRatio.getPixelSizeForLayoutSize(width))/
    //     PixelRatio.get()) - statusBarSize },
    // ],
    height: height,
    width: width,
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

export default ImageFullScreen;


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