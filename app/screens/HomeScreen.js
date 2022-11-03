import { ScrollView, StyleSheet, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";

import BottomTabs from "../components/home/BottomTabs";
import Header from "../components/home/Header";
import Screen from "../components/Screen";
import Post from "../components/home/Post";
//import { POSTS } from "../data/posts";
import { useUserAuth } from "../context/UserAuthContext";
import firestore from '@react-native-firebase/firestore';
import storage from "@react-native-firebase/storage";
//import { FlatList } from "react-native-gesture-handler";


const HomeScreen = ({ routes, navigation }) => {
  const {user, setUser} = useUserAuth();
  const [posts, setPosts] = useState([]);
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
    loadPosts();
    let query = firestore().collection('Posts');
    let unsubscribe = query.onSnapshot((snapshot) => {
      setPosts((prevPosts) => {
        // don't load posts on reload
        if(prevPosts.length === 0)
          return prevPosts;
        let newPosts = [...prevPosts];
        snapshot.docChanges().forEach((change)=> {
          id = change.doc.id;
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
  // useEffect(() =>
  //       navigation.addListener('beforeRemove', (e) => {
  //           e.preventDefault();
  //           return
  //       }),
  //       [navigation]
  //   );

  return (
    <Screen>
      <Header navigation={navigation} />
      {/* <ScrollView style={{ marginBottom: 40 }}> */}
        <FlatList style={{ marginBottom: 40 }}
          data={posts}
          keyExtractor={(post) => post[1]}
          renderItem={(item) => {
            const {item: post} = item
            return <Post post={post[0]} postID={post[1]} postUser={post[2]} user={user} />
          }}
          onEndReachedThreshold={0.2}
          onEndReached={fetchMoreData}
          />
      {/* </ScrollView> */}
      <BottomTabs navigation={navigation} />
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
