import { Image, ScrollView, StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import React from "react";

import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Text from "../components/Text";
import { Icon } from "@rneui/base";
import { useUserAuth } from "../context/UserAuthContext";
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import AppText from "../components/Text";
import TouchableIcon from "../components/TouchableIcon";

import {
    ListItem,
    ListItemDeleteAction,
    ListItemSeparator,
  } from "../components/lists";


const DeleteVideo = ({ navigation }) => {
  const {user, setUser} = useUserAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const [lastDocRef, setLastDocRef] = useState(null)
  let pageSize = 20;

  const loadPosts = useCallback(() => {
    setIsLoading(true);
    let query = firestore().collection('Videos')
    if(lastDocRef) {
      query = query.startAfter(lastDocRef)
    }
    query = query.limit(pageSize)
    query.get()
      .then(async (snapshot) => {
        let post = [];
        for( let cat of snapshot.docs ){
            let data = cat.data();
            let id = cat.id;
            post.push({id: id,title: data.title});
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
  
  const handleDelete = (request) => {
    firestore().collection('Videos').doc(request).delete().then(()=>{
        console.log('Videos removed!');
    })
  };

  useEffect(()=>{
    // firestore().collection('Categories').get().then((snapshot)=>{
    //     snapshot.docs.map((request)=>{
    //         console.log(request.data());
    //     })
    // })
    loadPosts();
    let query = firestore().collection('Videos')
    let unsubscribe = query.onSnapshot((snapshot) => {
      setMessages((prevPosts) => {
        // don't load posts on reload
        if(prevPosts.length === 0)
          return prevPosts;
        let newPosts = [...prevPosts];
        snapshot.docChanges().forEach(async(change)=> {
          let data = change.doc.data();
          let id = change.doc.id;

          let _postIndex = newPosts.findIndex((_post) => _post.id === id);
          if(change.type === "removed") {
            newPosts.splice(_postIndex, 1);
            return;
          }
          let post = {id: id,title: data.title};
          if(_postIndex !== -1) {
            newPosts.splice(_postIndex, 1, ...post);
          } else {
            newPosts.unshift(...post);
          }
        })
        return newPosts;
      })
    })
    return () => {
      unsubscribe();
    }
  },[]);

  return (
    <Screen>
      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20, marginHorizontal: 10 }}>
          <TouchableIcon
            name="arrow-left"
            size={30}
            onPress={() => {
              navigation.navigate("ReelsScreen");
            }}
          />
          <View style={{ flexDirection: "column",alignSelf: "center" }}>
            <AppText style={{ fontSize: 25, fontWeight: "700",
            marginLeft: 15,
            fontWeight: "500",
            color: "white", 
            alignItems: "center",
            }}>Delete Videos</AppText>
          </View>
        </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <ListItem
            title={item.title}
            //image={item.profile}
            renderRightActions={() => (
              <View style={{height: "100%", backgroundColor: "white"}}>
                <ListItemDeleteAction onPress={() => handleDelete(item.id)} />
              </View>
            )}
          />
        }}
        ItemSeparatorComponent={ListItemSeparator}
        onEndReachedThreshold={0.2}
        onEndReached={fetchMoreData}
      />
    </Screen>
  );
};

export default DeleteVideo;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  contText: {
    marginLeft: 20,
    fontSize: 16,
    fontWeight: "600",
  },
  thumbContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
  video: {
    marginRight: 10,
    width: 250,
    height: 150,
    resizeMode: "cover",
  },
});