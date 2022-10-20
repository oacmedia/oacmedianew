// import React, {useRef, useState, useEffect} from 'react';
// import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
// import {PermissionsAndroid, Platform} from 'react-native';
// import {
// ClientRoleType,
// createAgoraRtcEngine,
// IRtcEngine,
// ChannelProfileType,
// } from 'react-native-agora';

// const appId = '13bea7c294da4c63ad950318e73b495a';
// const channelName = 'test';
// const token = '007eJxTYHAVtvxnUnor0l2rYb70pU1y52WdDi05smd9pehF00/ypswKDIbGSamJ5slGliYpiSbJZsaJKZamBsaGFqnmxkkmlqaJXT/tk7m9HZOXpoWwMjJAIIjPwlCSWlzCwAAA68Eemw==';
// const uid = 0;

// const CallScreen = ({ navigation }) => {
//     //const agoraEngineRef = useRef<IRtcEngine>(); // Agora engine instance
//     const agoraEngineRef = useRef(IRtcEngine);
//     const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
//     const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
//     const [message, setMessage] = useState(''); // Message to the user

//     const join = async () => {
//         if (isJoined) {
//             return;
//         }
//         try {
//             agoraEngineRef.current?.setChannelProfile(
//                 ChannelProfileType.ChannelProfileCommunication,
//             );
//             agoraEngineRef.current?.joinChannel(token, channelName, uid, {
//                 clientRoleType: ClientRoleType.ClientRoleBroadcaster,
//             });
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     const leave = () => {
//         try {
//             agoraEngineRef.current?.leaveChannel();
//             setRemoteUid(0);
//             setIsJoined(false);
//             showMessage('You left the channel');
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     useEffect(() => {
//        // Initialize Agora engine when the app starts
//        setupVoiceSDKEngine();
//     });

//     const setupVoiceSDKEngine = async () => {
//        try {
//        // use the helper function to get permissions
//        await getPermission();
//        agoraEngineRef.current = createAgoraRtcEngine();
//        const agoraEngine = agoraEngineRef.current;
//        agoraEngine.registerEventHandler({
//            onJoinChannelSuccess: () => {
//                showMessage('Successfully joined the channel ' + channelName);
//                setIsJoined(true);
//            },
//            onUserJoined: (_connection, Uid) => {
//                showMessage('Remote user joined with uid ' + Uid);
//                setRemoteUid(Uid);
//            },
//            onUserOffline: (_connection, Uid) => {
//                showMessage('Remote user left the channel. uid: ' + Uid);
//                setRemoteUid(0);
//            },
//        });
//        agoraEngine.initialize({
//            appId: appId,
//        });
//        } catch (e) {
//            console.log(e);
//        }
//     };

//     return (
//         <SafeAreaView style={styles.main}>
//           <Text style={styles.head}>Agora Video Calling Quickstart</Text>
//           <View style={styles.btnContainer}>
//             <Text onPress={join} style={styles.button}>
//               Join
//             </Text>
//             <Text onPress={leave} style={styles.button}>
//               Leave
//             </Text>
//           </View>
//           <ScrollView
//             style={styles.scroll}
//             contentContainerStyle={styles.scrollContainer}>
//             {isJoined ? (
//               <Text>Local user uid: {uid}</Text>
//             ) : (
//               <Text>Join a channel</Text>
//             )}
//             {isJoined && remoteUid !== 0 ? (
//               <Text>Remote user uid: {remoteUid}</Text>
//             ) : (
//               <Text>Waiting for a remote user to join</Text>
//             )}
//             <Text>{message}</Text>
//           </ScrollView>
//         </SafeAreaView>
//     );

//     function showMessage(msg) {
//         setMessage(msg); 
//     }
// };

// const styles = StyleSheet.create({
//     button: {
//         paddingHorizontal: 25,
//         paddingVertical: 4,
//         fontWeight: 'bold',
//         color: '#ffffff',
//         backgroundColor: '#0055cc',
//         margin: 5,
//     },
//     main: {flex: 1, alignItems: 'center'},
//     scroll: {flex: 1, backgroundColor: '#ddeeff', width: '100%'},
//     scrollContainer: {alignItems: 'center'},
//     videoView: {width: '90%', height: 200},
//     btnContainer: {flexDirection: 'row', justifyContent: 'center'},
//     head: {fontSize: 20},
// });




// const getPermission = async () => {
//     if (Platform.OS === 'android') {
//         await PermissionsAndroid.requestMultiple([
//             PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         ]);
//     }
// };

// export default CallScreen;









import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Screen from "../components/Screen";
import Text from "../components/Text";
import TouchableIcon from "../components/TouchableIcon";
import colors from "../config/colors";

const Timer = () => {
  return (
    <View style={styles.timer}>
      <Text style={styles.digits}>04:</Text>
      <Text style={styles.digits}>23</Text>
    </View>
  );
};

const CallScreen = ({ navigation }) => {
  const [mute, setMute] = useState("microphone-off");
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.text}>Bro Jay</Text>
        <Timer />
      </View>
      <View style={styles.footer}>
        {mute === "microphone-off" ? (
          <TouchableIcon
            name={mute}
            size={35}
            onPress={() => {
              setMute("microphone");
            }}
          />
        ) : (
          <TouchableIcon
            name={mute}
            size={35}
            onPress={() => {
              setMute("microphone-off");
            }}
          />
        )}
        <TouchableIcon
          name="phone-hangup"
          size={35}
          onPress={() => {
            navigation.push("ChatScreen");
          }}
        />
      </View>
    </Screen>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green,
    paddingTop: "35%",
    alignItems: "center",
  },
  text: {
    fontSize: 35,
  },
  timer: {
    margin: 10,
    width: "100%",
    height: "12%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  digits: {
    fontSize: 20,
    color: "#f5f5f5",
  },
  digitsMili: {
    fontSize: 20,
    color: "#e42a2a",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    marginBottom: "25%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: colors.darkGreen,
    width: "100%",
  },
});
