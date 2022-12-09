import React, { useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet, View, Text, ActivityIndicator, Dimensions  } from "react-native";
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import AppText from "../components/Text";
import { useUserAuth } from "../context/UserAuthContext";
import { useDataSharing } from "../context/DataSharingContext";
import TouchableIcon from "../components/TouchableIcon";


function FriendsSelect({ navigation }) {
  const [messages, setMessages] = useState([]);
  const {user, setUser} = useUserAuth();
  const [loading, setLoading] = useState(true);
  const {sharedData, setSharedData} = useDataSharing();
  const [processInd, setProcessInd] = useState(false);
  const fullWidth = Dimensions.get('window').width;
  const fullHeight = Dimensions.get('window').height;

  function setChat(friend){

    firestore().collection('Chats').where('user','==',user.id).where('friend','==',friend).get().then((snapshot)=>{
        if(!snapshot.empty){
            snapshot.docs.map((result)=>{
                let data = result.data();
                setSharedData({chatid: data.chatid});
                firestore().collection('Chats').where("chatid",'==',data.chatid).get().then((snapshot)=>{
                    if(!snapshot.empty){
                        navigation.navigate("ChatScreen");
                    }
                })
            })
        }else{
            setSharedData({chatid: user.id+"friend"+friend});
            firestore().collection('Chats').doc().set({
                user: user.id,
                friend: friend,
                chatid: user.id+"friend"+friend,
            }).then(()=>{
                firestore().collection('Chats').doc().set({
                    user: friend,
                    friend: user.id,
                    chatid: user.id+"friend"+friend,
                }).then(()=>{
                    navigation.navigate("ChatScreen");
                })
            })   
        }
    });
  }

  let id = 0;

  const loadPosts = useCallback(() => {
    setProcessInd(true);
    if(loading){
      let query = firestore().collection('Friends').doc(user.id)
      query.get()
        .then(async(snapshot) => {
          let data = snapshot.data();
          let post = [];
          for( let user of data.friends ){
            id++;
            let currentUser = user.user;
            let userData = await firestore().collection('Users').doc(currentUser).get();
            let rdata = userData.data();
            post.push({id: id,title: rdata.title,firstName: rdata.firstName,lastName: rdata.lastName,profile: rdata.profile, phoneNumber: rdata.phoneNumber});
            if(data.friends.length == id){
              setProcessInd(false);
              setLoading(false);
              id = 0;
            }
          }
          setMessages((prevRequests) => {
              return [...prevRequests, ...post]
          });
        });
    }
    
  }, [setMessages])

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <Screen>
      {processInd && <ActivityIndicator style={{alignSelf:"center",height: fullHeight, width: fullWidth, justifyContent: "center"}} size={100} color="white"/>}
        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20, marginHorizontal: 10 }}>
          <TouchableIcon
            name="arrow-left"
            size={30}
            onPress={() => {
              setSharedData({});
              navigation.navigate("MessagesScreen");
            }}
          />
          <View style={{ flexDirection: "column",alignSelf: "center" }}>
            <AppText style={{ fontSize: 25, fontWeight: "700",
            marginLeft: 15,
            fontWeight: "500",
            color: "white", 
            alignItems: "center",
            }}>Select Contact</AppText>
          </View>
        </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <ListItem
            title={item.title+" "+item.firstName+" "+item.lastName}
            image={item.profile}
            onPress={()=>{setChat(item.phoneNumber);
        }}
          />
        }}
        ItemSeparatorComponent={ListItemSeparator}
      />
      <BottomTabs navigation={navigation} scrName={"MessagesScreen"}/>
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default FriendsSelect;
