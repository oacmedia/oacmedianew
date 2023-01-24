import React, { useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View, ActivityIndicator, Dimensions  } from "react-native";
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import { useDataSharing } from "../context/DataSharingContext";
import { useUserAuth } from "../context/UserAuthContext";
import { Icon } from "@rneui/base";
import colors from "../config/colors";


function MessagesScreen({ navigation, route }) {
  const [messages, setMessages] = useState('');
  const {sharedData, setSharedData} = useDataSharing();
  const {user, setUser} = useUserAuth();
  const [notification, setNotification] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const [lastDocRef, setLastDocRef] = useState(null)
  const [processInd, setProcessInd] = useState(false);
  // const [friendsList, setFriendsList] = useState([]);
  const fullWidth = Dimensions.get('window').width;
  const fullHeight = Dimensions.get('window').height;
  let friendsList = [];
  let pageSize = 20;

  const loadPosts = useCallback(() => {
    setProcessInd(true);
    setIsLoading(true);
    let query = firestore().collection('Chats').where("user","==",user.id)
    if(lastDocRef) {
      query = query.startAfter(lastDocRef)
    }
    query = query.limit(pageSize)
    query.get()
      .then(async (snapshot) => {
        let post = [];
        for( let chat of snapshot.docs ){
            let data = chat.data();
            let id = chat.id;
            let notf = await firestore().collection('UnreadMessages').where("sentTo",'==',user.id).where("chatid",'==',data.chatid).get();
            let userData = await firestore().collection('Users').doc(data.friend).get();
            let rdata = userData.data();
            for(let list of friendsList){
              let thisfriend = list.user;
              if(thisfriend == rdata.phoneNumber){
                post.push({id: id,title: rdata.title,firstName: rdata.firstName,lastName: rdata.lastName,profile: rdata.profile, phoneNumber: rdata.phoneNumber, notification: notf.docs.length});
              }
            }
            //post.push({id: id,title: rdata.title,firstName: rdata.firstName,lastName: rdata.lastName,profile: rdata.profile, phoneNumber: rdata.phoneNumber});
        }
        if(snapshot.docs.length < pageSize) {
          setIsFinished(true);
        }
        if(snapshot.docs.length) {
          setLastDocRef(snapshot.docs[snapshot.docs.length-1]);
        }
        setProcessInd(false);
        setIsLoading(false);
        setMessages((prevPosts) => {
          let objs = post.map((obj)=>{
            return obj;
          });
          return [...prevPosts, ...objs];
        });
      });
  }, [setIsLoading, setIsFinished, setMessages, lastDocRef, setLastDocRef])

  const fetchMoreData = useCallback(() => {
    if(isLoading || isFinished) return;
    loadPosts();
  }, [isFinished, isLoading])

  useEffect(() => {
    firestore().collection('Friends').doc(user.id).get().then((snapshot)=>{
      let fdata = snapshot.data();
      friendsList = fdata.friends;
      loadPosts();
    });
    let query = firestore().collection('Chats').where("user","==",user.id)
    let unsubscribe = query.onSnapshot((snapshot) => {
      setMessages((prevPosts) => {
        // don't load posts on reload
        if(prevPosts.length === 0)
          return prevPosts;
        let newPosts = [...prevPosts];
        snapshot.docChanges().forEach(async(change)=> {
          let data = change.doc.data();
          let id = change.doc.id;
          let notf = await firestore().collection('UnreadMessages').where("sentTo",'==',user.id).where("chatid",'==',data.chatid).get();
          let userInfo = await firestore().collection('Users').doc(data.friend).get();
          let userData = userInfo.data();

          let _postIndex = newPosts.findIndex((_post) => _post.id === id);
          if(change.type === "removed") {
            newPosts.splice(_postIndex, 1);
            return;
          }
          let post = {id: id,title: userData.title,firstName: userData.firstName,lastName: userData.lastName,profile: userData.profile, phoneNumber: userData.phoneNumber, notification:notf.docs.length};
          if(_postIndex !== -1) {
            newPosts.splice(_postIndex, 1, post);
          } else {
            newPosts.unshift(post);
          }
        })
        return newPosts;
      })
    })
    return () => {
      unsubscribe();
    }
  }, []);
  useEffect(()=>{
    // firestore().collection('UnreadMessages').where("sentTo",'==',user.id).get().then((snapshot)=>{
    //   if(!snapshot.empty){
    //     // let id = snapshot.doc.id;
    //     // let data = snapshot.doc.data();
    //     // console.log(id+" and "+data);
    //     console.log(snapshot.docs.length);
    //   }
    // })
    // firestore().collection('UnreadMessages').where("sentTo",'==',user.id).onSnapshot((snapshot)=>{
    //   if(!snapshot.empty){
    //     //navigation.replace('MessagesScreen');
    //   }
    //       // setMessages((prevPosts) => {
    //       //   // don't load posts on reload
    //       //   if(prevPosts.length === 0)
    //       //     return prevPosts;
    //       //   let newPosts = [...prevPosts];
    //       //   snapshot.docChanges().forEach(async(change)=> {
    //       //     let data = change.doc.data();
    //       //     let id = change.doc.id;
    //       //     let notf = await firestore().collection('UnreadMessages').where("sentTo",'==',user.id).where("chatid",'==',data.chatid).get();
    //       //     let userInfo = await firestore().collection('Users').doc(data.sentBy).get();
    //       //     let userData = userInfo.data();
    
    //       //     let _postIndex = newPosts.findIndex((_post) => _post.id == data.mainid);
    //       //     if(change.type === "removed") {
    //       //       return;
    //       //     }
    //       //     let post = {id: id,title: userData.title,firstName: userData.firstName,lastName: userData.lastName,profile: userData.profile, phoneNumber: userData.phoneNumber, notification:notf.docs.length};
    //       //     if(_postIndex !== -1) {
    //       //       newPosts.splice(_postIndex, 1, post);
    //       //     }
    //       //   })
    //       //   return newPosts;
    //       // })
    // })
    firestore().collection('onChatScreen').where('CUser','==',user.id).get().then((snapshot)=>{
      if(!snapshot.empty){
        snapshot.docs.map((doc)=>{
          let id = doc.id;
          firestore().collection('onChatScreen').doc(id).delete();
        })
      }
    })
  },[])

  const handleDelete = (message) => {
    // Delete the message from messages
    //setMessages(messages.filter((m) => m.id !== message.id));
  };

  return (
    <Screen>
      {processInd && <ActivityIndicator style={{alignSelf:"center",height: fullHeight, width: fullWidth, justifyContent: "center"}} size={100} color="white"/>}
      <TouchableOpacity
        style={{
            borderWidth:5,
            borderColor:"transparent",
            alignItems:'center',
            justifyContent:'center',
            width:65,
            height:65,
            backgroundColor:'#fff',
            borderRadius:50,
            position: "absolute",
            zIndex: 1,
            bottom: 70,
            right: 10,
          }}
        onPress={() => {
            navigation.navigate("FriendsSelect");
          }}
      >
        <Icon name={"add"}  size={35} color={colors.background} />
      </TouchableOpacity>
      <View style={{ alignSelf: "center", marginVertical: 20 }}>
        <AppText style={{ fontSize: 25, fontWeight: "700" }}>Chats</AppText>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(message) => message.id}
        renderItem={({ item }) => {
          return <ListItem
            title={item.title+" "+item.firstName+" "+item.lastName}
            subTitle={item.description}
            image={item.profile}
            notification={item.notification}
            onPress={async() => {
              setProcessInd(true);
              let getChat = await firestore().collection('Chats').doc(item.id).get();
              setSharedData({chatid: getChat.data().chatid, mainid: item.id});
              if(!getChat.empty){
                firestore().collection('onChatScreen').doc().set({
                  CUser: user.id,
                  chatid: getChat.data().chatid,
                }).then(()=>{
                  setProcessInd(false);
                  navigation.replace("ChatScreen");
                })
              }
            }}
            // renderRightActions={() => (
            //   <ListItemDeleteAction onPress={() => handleDelete(item)} />
            // )}
          />
        }}
        ItemSeparatorComponent={ListItemSeparator}
        onEndReachedThreshold={0.2}
        onEndReached={fetchMoreData}
      />
      <BottomTabs navigation={navigation} scrName={"MessagesScreen"}/>
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default MessagesScreen;
