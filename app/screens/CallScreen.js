import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Screen from "../components/Screen";
import Text from "../components/Text";
import TouchableIcon from "../components/TouchableIcon";
import colors from "../config/colors";
import { useDataSharing } from "../context/DataSharingContext";
import { useUserAuth } from "../context/UserAuthContext";
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import {PermissionsAndroid, Platform} from 'react-native';
import {
    ClientRoleType,
    createAgoraRtcEngine,
    IRtcEngine,
    RtcSurfaceView,
    ChannelProfileType,
} from 'react-native-agora';
import { useCallDataSharing } from "../context/CallDataSharingContext";

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
  const {callSharedData, setCallSharedData} = useCallDataSharing();
  const appId = '41b0ec4aaeb544dab76572e085446106';
  const appCertificate = '80977caed4b14c768ae6d13f63c3753c';
  let token;
  let channelName;
  let uid;

  const agoraEngineRef = useRef(IRtcEngine); // Agora engine instance
    const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
    const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
    const [message, setMessage] = useState(''); // Message to the user


    function showMessage(msg) {
        setMessage(msg);
    }


  const getPermission = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);
        }
      };
      
      const setupVideoSDKEngine = async () => {
        try {
        // use the helper function to get permissions
        if (Platform.OS === 'android') { await getPermission()};
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
            channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        });
        agoraEngine.enableVideo();
        join();
        } catch (e) {
            console.log(e);
        }
     };

     const join = async () => {
      if (isJoined) {
          return;
      }
      try {
          agoraEngineRef.current?.setChannelProfile(
              ChannelProfileType.ChannelProfileCommunication,
          );
          agoraEngineRef.current?.startPreview();
          agoraEngineRef.current?.joinChannel(token, channelName, uid, {
              clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          });
      } catch (e) {
          console.log(e);
      }
  };
  const leave = () => {
    try {
        agoraEngineRef.current?.leaveChannel();
        setRemoteUid(0);
        setIsJoined(false);
        showMessage('You left the channel');
    } catch (e) {
        console.log(e);
    }
};
      
    useEffect(()=>{
      token = callSharedData.token;
      channelName = callSharedData.channelName;
      uid = callSharedData.uid;
      setupVideoSDKEngine();
      // console.log(sharedData.chatid)
      firestore().collection('Calls').where('chatid','==',sharedData.chatid).onSnapshot((snapshot)=>{
        snapshot.docChanges().forEach((change)=>{
          if(change.type === "removed"){
            leave();
            navigation.navigate("ChatScreen");
          }
        })
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
            leave();
            firestore().collection('Calls').where('chatid','==',sharedData.chatid).get().then((snapshot)=>{
              if(!snapshot.empty){
                snapshot.docs.map((doc)=>{
                  let id = doc.id;
                  firestore().collection('Calls').doc(id).delete().then(()=>{
                    console.log('deleted!');
                  })
                })
              }
            })
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
