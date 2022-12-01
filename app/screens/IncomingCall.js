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
import {request, PERMISSIONS} from 'react-native-permissions';
import { useCallDataSharing } from "../context/CallDataSharingContext";


const IncomingCall = ({ navigation }) => {
  const {sharedData, setSharedData} = useDataSharing();
  const {user, setUser} = useUserAuth();
  const {callSharedData, setCallSharedData} = useCallDataSharing();

  const getPermission = async () => {
      if (Platform.OS === 'android') {
        console.log('i m here!');
        request(PERMISSIONS.ANDROID.RECORD_AUDIO).then((result)=>{
          console.log(result, "permission");
        })
        }
      };
      
    useEffect(()=>{
        (async()=>{
            if (Platform.OS === 'android') { await getPermission()};
        })();
    
      firestore().collection('Calls').where('chatid','==',callSharedData.chatid).onSnapshot((snapshot)=>{
        snapshot.docChanges().forEach((change)=>{
          if(change.type === "removed"){
            navigation.navigate("HomeScreen");
          }
        })
      })

    },[])
      
      return (
        <Screen>
      <View style={styles.container}>
        <Text style={styles.text}>{callSharedData.friendName}</Text>
        <Text style={{fontSize: 20}}>is Calling You!</Text>
      </View>
      <View style={styles.footer}>
        <TouchableIcon
          name="phone"
          size={35}
          style={styles.accept}
          onPress={() => {
              console.log("hello")
                navigation.navigate("CallScreen");
            }
          }
        />
        <TouchableIcon
          name="phone-hangup"
          size={35}
          style={styles.decline}
          onPress={() => {
            setCallSharedData({});
            firestore().collection('Calls').where('chatid','==',callSharedData.chatid).get().then((snapshot)=>{
                if(!snapshot.empty){
                  snapshot.docs.map((doc)=>{
                    let id = doc.id;
                    firestore().collection('Calls').doc(id).delete().then(()=>{
                      console.log('deleted!');
                    })
                  })
                }
              })
              firestore().collection('Busy').where('user','==',user.id).get().then((snapshot)=>{
                if(!snapshot.empty){
                  snapshot.docs.map((doc)=>{
                    let id = doc.id;
                    firestore().collection('Busy').doc(id).delete().then(()=>{
                      firestore().collection('Busy').where('friend','==',user.id).get().then((snapshot)=>{
                        if(!snapshot.empty){
                          snapshot.docs.map((doc)=>{
                            let id = doc.id;
                            firestore().collection('Busy').doc(id).delete().then(()=>{
                              console.log('deleted!');
                            })
                          })
                        }
                      })
                    })
                  })
                }
              })
              navigation.navigate("HomeScreen");
          }}
        />
      </View>
    </Screen>
  );
};

export default IncomingCall;

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
    width: "100%",
  },
  accept: {
    height: 90,
    width: 90,
    borderRadius: 50,
    backgroundColor: "#00c04b",
    position: "absolute",
    left: 30,
    bottom: 30,
  },
  decline: {
    height: 90,
    width: 90,
    borderRadius: 50,
    backgroundColor: "red",
    position: "absolute",
    right: 30,
    bottom: 30,
  }
});
