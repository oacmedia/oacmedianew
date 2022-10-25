import { ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";

import BottomTabs from "../components/home/BottomTabs";
import Header from "../components/home/Header";
import Screen from "../components/Screen";
import Post from "../components/home/Post";
//import { POSTS } from "../data/posts";
import { useUserAuth } from "../context/UserAuthContext";
import firestore from '@react-native-firebase/firestore';
import storage from "@react-native-firebase/storage";

const HomeScreen = ({ navigation }) => {
  const {user, setUser} = useUserAuth();
  const [posts, setPosts] = useState([]);
  //const [newPosts, setNewPosts] = useState([]);
  const [postedPost, setPostedPost] = useState('');
  //const [postsID, setPostID] = useState([]);
  // console.log(user);
  useEffect(() => {
      //console.log(route.params);
    //console.log(user);
    // firestore().collection('Posts').get()
    // //storage().ref('8def2c6f-8258-41e5-ab9f-be3f81167078.jpeg').getDownloadURL()
    // .then((url)=>{
    //   let postsArray = url._docs.map((post)=>{
    //     //console.log(post._data.userID);
    //     return [post._data, post.id, post._data.userID];
    //   })
    //   //console.log(postsID);
    //   setPosts(postsArray);
    // })
    
    function onResult(QuerySnapshot) {
      //console.log('I got called!');
      if(!QuerySnapshot._changes.length == '0'){
        //console.log(QuerySnapshot._changes);
        let postsArray = QuerySnapshot._changes.map((data,index)=>{
          //console.log(QuerySnapshot._docs[0]._ref._documentPath._parts[1]);
          let id = QuerySnapshot._docs[index]._ref._documentPath._parts[1];
          let post = data._nativeData.doc.data;
          return [post, id, post.userID[1]];
          //pComments.push(data._nativeData.doc.data);
        })
        setPosts(postsArray);
        //setNewPosts(postsArray);
        // let postIDArray = QuerySnapshot._docs.map((data)=>{
        //   console.log(data._ref._documentPath._parts[1]);
        // })
        // postsArray.map((each, index)=>{
        //   setNewPosts(...each, postIDArray[index]);
        // })
        //console.log(newPosts);
      }
    }

    function onError(error) {
      console.error(error);
    }

    firestore().collection('Posts').onSnapshot(onResult, onError);
    
  }, []);
  return (
    <Screen>
      <Header navigation={navigation} />
      <ScrollView style={{ marginBottom: 40 }}>
        {posts.map((post, index) => (
          <Post post={post[0]} postID={post[1]} postUser={post[2]} key={index} user={user} />
        ))}
      </ScrollView>
      <BottomTabs navigation={navigation} />
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
