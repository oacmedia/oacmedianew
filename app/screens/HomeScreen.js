import { ScrollView, StyleSheet, FlatList, View, TouchableOpacity, Text,StatusBar } from "react-native";
import React, { useCallback, useEffect, useState, useRef } from "react";

import BottomTabs from "../components/home/BottomTabs";
import Header from "../components/home/Header";
import Screen from "../components/Screen";
import Post from "../components/home/Post";
//import { POSTS } from "../data/posts";
import { useUserAuth } from "../context/UserAuthContext";
import firestore from '@react-native-firebase/firestore';
import storage from "@react-native-firebase/storage";
//import { FlatList } from "react-native-gesture-handler";
import { useDataSharing } from "../context/DataSharingContext";
import * as Notifications from 'expo-notifications';
//import Constants from 'expo-constants';
import AStorage from "@react-native-async-storage/async-storage";
import { useCallDataSharing } from "../context/CallDataSharingContext";

const HomeScreen = ({ routes, navigation }) => {
  const {user, setUser} = useUserAuth();
  const [posts, setPosts] = useState([]);
  const {sharedData, setSharedData} = useDataSharing();
  const {callSharedData, setCallSharedData} = useCallDataSharing();
  const [isLoading, setIsLoading] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const [lastDocRef, setLastDocRef] = useState(null)
  let pageSize = 3;

  const loadPosts = useCallback(() => {
    setIsLoading(true);
    let query = firestore().collection('Posts');
    if(lastDocRef) {
      query = query.startAfter(lastDocRef)
    }
    query = query.limit(pageSize)
    query.get()
      .then((snapshot) => {
        let newPosts = snapshot.docs.map((post) => {
          let postData = post.data();
          return [postData, post.id, postData.userID];
        })
        if(snapshot.docs.length < pageSize) {
          setIsFinished(true);
        }
        if(snapshot.docs.length) {
          setLastDocRef(snapshot.docs[snapshot.docs.length-1]);
        }
        setIsLoading(false);
        setPosts((prevPosts) => {
          return [...prevPosts, ...newPosts]
        });
      });
  }, [setIsLoading, setIsFinished, setPosts, lastDocRef, setLastDocRef])

  //const [postsID, setPostID] = useState([]);
  // console.log(user);
  const fetchMoreData = useCallback(() => {
    if(isLoading || isFinished) return;
    loadPosts();
  }, [isFinished, isLoading])

  useEffect(() => {
    setSharedData({});
    loadPosts();
    firestore().collection('Busy').where('user','==',user.id).where('joined','==',false).onSnapshot((snapshot)=>{
      snapshot.docChanges().forEach((change)=>{
        if(change.type === "added"){
          let data = change.doc.data();
          let str = user.id;
          let uid = str.slice(-5);
          onClick(data.friendName);
          setCallSharedData({uid: uid,token: data.token,channelName: data.channel, secJoin: true,friend: data.friend, friendName: data.friendName,chatid: data.chatid});
          navigation.navigate("IncomingCall");
        }
      })
    })

    let query = firestore().collection('Posts');
    let unsubscribe = query.onSnapshot((snapshot) => {
      setPosts((prevPosts) => {
        // don't load posts on reload
        if(prevPosts.length === 0)
          return prevPosts;
        let newPosts = [...prevPosts];
        snapshot.docChanges().forEach((change)=> {
          let id = change.doc.id;
          let _postIndex = newPosts.findIndex((_post) => _post[1] === id);
          if(change.type === "removed") {
            newPosts.splice(_postIndex, 1);
            return;
          }
          console.log(change, "change")
          let postData = change.doc.data();
          let post = {caption: postData.caption,contents: postData.contents ,userID: postData.userID};
          if(_postIndex !== -1) {
            newPosts.splice(_postIndex, 1, [post,id,post.userID]);
          } else {
            newPosts.unshift([post,id,post.userID]);
          }
        })
        return newPosts;
      })
    })
    return () => {
      unsubscribe();
    }
    
  }, []);

  const onClick = async (title) => {
    //navigation.navigate("IncomingCall");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: "is Calling You!",
        data: { data: "Tap To Open Call in APP!" }
      },
      trigger: {
        //hour: 0,
        //minute: 0,
        seconds: 1,
        //repeats: true
      }
    });
  }
  // useEffect(() =>
  //       navigation.addListener('beforeRemove', (e) => {
  //           e.preventDefault();
  //           return
  //       }),
  //       [navigation]
  //   );

  return (
    <Screen>
      <View style={styles.container}>
      {/* <TouchableOpacity onPress={onClick}>
        <Text style={{backgroundColor: 'red', padding: 10, color: 'white'}}>Click me to send a push notification</Text>
      </TouchableOpacity> */}
        <StatusBar style="auto" />
      </View>
      <Header navigation={navigation} />
      {/* <ScrollView style={{ marginBottom: 40 }}> */}
        <FlatList style={{ marginBottom: 40 }}
          data={posts}
          keyExtractor={(post) => post[1]}
          renderItem={(item) => {
            const {item: post} = item
            return <Post post={post[0]} postID={post[1]} postUser={post[2]} user={user} navigation={navigation} />
          }}
          onEndReachedThreshold={0.2}
          onEndReached={fetchMoreData}
          />
      {/* </ScrollView> */}
      <BottomTabs navigation={navigation} scrName={"HomeScreen"}/>
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
