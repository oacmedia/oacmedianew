// const appId = '41b0ec4aaeb544dab76572e085446106';
// const channelName = '+923067678919friend+923214064027';
// const token = '00641b0ec4aaeb544dab76572e085446106QAA2YmE0YjhhMzQ0YTQwZTA5OGY1NDE3NmZiNmEwODkzZThjYzE5ZDQ4ZWY1OTA2MDkxODQzZTIyODM1NTk1OGI4iXsgu8J++RAiALf3whv/8nNjBAABAP/yc2MCAP/yc2MDAP/yc2MEAP/yc2M=';
// const uid = 0;

// import React, {useRef, useState, useEffect} from 'react';
// import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
// import {PermissionsAndroid, Platform} from 'react-native';
// import {
// ClientRoleType,
// createAgoraRtcEngine,
// IRtcEngine,
// ChannelProfileType,
// } from 'react-native-agora';
// import {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} from 'agora-access-token';

// const appId = '41b0ec4aaeb544dab76572e085446106';
// const channelName = '+923067678919friend+923214064027';
// let token = '007eJxTYJCZabZj8SUdEd7f5dqb1RRb53KXb3y/YlX25mTnoGf/pwQpMJgYJhmkJpskJqYmmZqYpCQmmZuZmhulGlgAeWaGBmZHTxUlNwQyMqz+up6FkQECQXwFBm1LI2MDM3MzcwtLQ8u0oszUvBSQkJGhiYGZiYGROQMDAC92Jm4=';
// const appCertificate = '80977caed4b14c768ae6d13f63c3753c';
// const uid = 0;

// // const appId = '13bea7c294da4c63ad950318e73b495a';
// // const channelName = 'test';
// // const token = '007eJxTYHAVtvxnUnor0l2rYb70pU1y52WdDi05smd9pehF00/ypswKDIbGSamJ5slGliYpiSbJZsaJKZamBsaGFqnmxkkmlqaJXT/tk7m9HZOXpoWwMjJAIIjPwlCSWlzCwAAA68Eemw==';
// // const uid = 0;

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
//       const role = RtcRole.PUBLISHER;
//       const expirationTimeInSeconds = 3600
//       const currentTimestamp = Math.floor(Date.now() / 1000)
//       const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
//       // Build token with uid
//       const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);
//       // token = tokenA;
//       console.log(tokenA);
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
























import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Screen from "../components/Screen";
import Text from "../components/Text";
import TouchableIcon from "../components/TouchableIcon";
import colors from "../config/colors";
import { useDataSharing } from "../context/DataSharingContext";
import { useUserAuth } from "../context/UserAuthContext";
import {PermissionsAndroid, Platform} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
} from 'react-native-agora';

import {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} from 'agora-access-token';

const Timer = () => {
  return (
    <View style={styles.timer}>
      <Text style={styles.digits}>04:</Text>
      <Text style={styles.digits}>23</Text>
    </View>
  );
};

const CallScreen = ({ navigation }) => {
  const {sharedData, setSharedData} = useDataSharing();
  const [mute, setMute] = useState("microphone-off");
  const {user, setUser} = useUserAuth();
  const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [message, setMessage] = useState(''); // Message to the user
  
  const appId = '41b0ec4aaeb544dab76572e085446106';
  const appCertificate = '80977caed4b14c768ae6d13f63c3753c';
  let account;
  let token;
  let channelName;
  const agoraEngineRef = useRef(IRtcEngine);


  let fetchUrl = 'https://us-central1-oacmedia-app-8464c.cloudfunctions.net/generateToken';
  

const join = async () => {
  if (isJoined) {
      return;
  }
  try {
      agoraEngineRef.current?.setChannelProfile(
          ChannelProfileType.ChannelProfileCommunication,
      );
      agoraEngineRef.current?.joinChannel(token, channelName, account, {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
  } catch (e) {
      console.log(e);
  }
};

const leave = () => {
    try {
        agoraEngineRef.current?.leaveChannel();
        setRemoteUid(account);
        setIsJoined(false);
        showMessage('You left the channel');
    } catch (e) {
        console.log(e);
    }
};
  
  const getPermission = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);
        }
      };

      
    const setupVoiceSDKEngine = async () => {
       try {
       // use the helper function to get permissions
       await getPermission();
       agoraEngineRef.current = createAgoraRtcEngine();
       const agoraEngine = agoraEngineRef.current;
       agoraEngine.registerEventHandler({
           onJoinChannelSuccess: () => {
               showMessage('Successfully joined the channel ' + channelName);
               setIsJoined(true);
           },
           onUserJoined: (_connection, Uid) => {
               showMessage('Remote user joined with uid ' + Uid);
               setRemoteUid(Uid);
           },
           onUserOffline: (_connection, Uid) => {
               showMessage('Remote user left the channel. uid: ' + Uid);
               setRemoteUid(0);
           },
       });
       agoraEngine.initialize({
           appId: appId,
       });
       } catch (e) {
           console.log(e);
       }
    };
  
  function setCall(friend){

    
    firestore().collection('Calls').where('user','==',user.id).where('friend','==',friend).get().then((snapshot)=>{
      if(!snapshot.empty){
        snapshot.docs.map((result)=>{
          let data = result.data();
          channelName = data.channel;
          let str = user.id;
          account = str.slice(-5);
          token = data.token;
          // Initialize Agora engine when the app starts
          setupVoiceSDKEngine();
          join();
          // firestore().collection('Calls').where('user','==',user.id).where('friend','==',friend).get().then(()=>{
                  
            // })
            
                
            
            // .update({
                  //   joined: true,
                  // }).then(()=>{
                    //   console.log("Joined!");
                    // })
                  })
                }else{
                  channelName = (user.title+user.firstName+user.lastName).toString();
                  let str = user.id;
                  account = str.slice(-5);
                  const data = {
                          appID: appId,
                          appCertificate: appCertificate,
                          role: '1',
                          channelName: (user.title+user.firstName+user.lastName).toString(),
                          account: account,
                      };
                    
                    (async () => {
                        const request = await fetch('https://us-central1-oacmedia-app-8464c.cloudfunctions.net/generateToken', {
                            method: 'POST', // or 'PUT'
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(data),
                    });
                    const response = await request.json();
                    token = response.token;
                    setupVoiceSDKEngine();
                    firestore().collection('Calls').doc().set({
                      user: user.id,
                      friend: friend,
                      chatid: sharedData.chatid,
                      token: token,
                      channel: channelName,
                      joined: true,
                    }).then(()=>{
                      let str = friend;
                      let frAccount = str.slice(-5);
                      const data = {
                              appID: appId,
                              appCertificate: appCertificate,
                              role: '2',
                              channelName: (user.title+user.firstName+user.lastName).toString(),
                              account: frAccount,
                          };
                        
                        (async () => {
                            const request = await fetch('https://us-central1-oacmedia-app-8464c.cloudfunctions.net/generateToken', {
                                method: 'POST', // or 'PUT'
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(data),
                        });
                        const frResponse = await request.json();
                        let secToken = frResponse.token;
                      firestore().collection('Calls').doc().set({
                        user: friend,
                        friend: user.id,
                        chatid: sharedData.chatid,
                        token: secToken,
                        channel: channelName,
                        joined: false,
                      }).then(()=>{
                        join();
                      })
                    })()
                    })
                  })()
        }
      });
    }
    
    useEffect(()=>{
      
      firestore().collection('Chats').where('user','==',user.id).where('chatid','==',sharedData.chatid)
      .get().then((snapshot)=>{
          if(!snapshot.empty){
            snapshot.docs.map((result)=>{
              let data = result.data();
              setCall(data.friend);
            })
          }
        })
      },[])
      
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
            navigation.navigate("ChatScreen");
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
