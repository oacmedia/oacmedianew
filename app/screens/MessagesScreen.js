import React, { useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
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


function MessagesScreen({ navigation, route }) {
  const [messages, setMessages] = useState('');
  const {sharedData, setSharedData} = useDataSharing();
  const {user, setUser} = useUserAuth();
  
  const [isLoading, setIsLoading] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const [lastDocRef, setLastDocRef] = useState(null)
  let pageSize = 20;

  const loadPosts = useCallback(() => {
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
            let userData = await firestore().collection('Users').doc(data.friend).get();
            let rdata = userData.data();
            post.push({id: id,title: rdata.title,firstName: rdata.firstName,lastName: rdata.lastName,profile: rdata.profile, phoneNumber: rdata.phoneNumber});
        }
        if(snapshot.docs.length < pageSize) {
          setIsFinished(true);
        }
        if(snapshot.docs.length) {
          setLastDocRef(snapshot.docs[snapshot.docs.length-1]);
        }
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
    loadPosts();
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
          let userInfo = await firestore().collection('Users').doc(data.friend).get();
          let userData = userInfo.data();

          let _postIndex = newPosts.findIndex((_post) => _post.id === id);
          if(change.type === "removed") {
            newPosts.splice(_postIndex, 1);
            return;
          }
          let post = {id: id,title: userData.title,firstName: userData.firstName,lastName: userData.lastName,profile: userData.profile, phoneNumber: userData.phoneNumber};
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

  const handleDelete = (message) => {
    // Delete the message from messages
    //setMessages(messages.filter((m) => m.id !== message.id));
  };

  return (
    <Screen>
      <TouchableOpacity
        style={{
            borderWidth:5,
            borderColor:'#20194D',
            alignItems:'center',
            justifyContent:'center',
            width:75,
            height:75,
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
        <Icon name={"add"}  size={40} color="#20194D" />
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
            onPress={async() => {
              let getChat = await firestore().collection('Chats').doc(item.id).get();
              setSharedData({chatid: getChat.data().chatid});
              console.log(getChat);
              if(!getChat.empty){
                navigation.navigate("ChatScreen");
              }
            }}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
          />
        }}
        ItemSeparatorComponent={ListItemSeparator}
        onEndReachedThreshold={0.2}
        onEndReached={fetchMoreData}
      />
      <BottomTabs navigation={navigation} />
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default MessagesScreen;
