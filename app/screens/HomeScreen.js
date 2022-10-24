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
  //const [postsID, setPostID] = useState([]);
  // console.log(user);
  useEffect(() => {
    console.log(user);
    firestore().collection('Posts').get()
    //storage().ref('8def2c6f-8258-41e5-ab9f-be3f81167078.jpeg').getDownloadURL()
    .then((url)=>{
      let postsArray = url._docs.map((post)=>{
        //console.log(post._data.userID);
        return [post._data, post.id, post._data.userID];
      })
      //console.log(postsID);
      setPosts(postsArray);
    })
    
  }, []);
  return (
    <Screen>
      <Header navigation={navigation} />
      <ScrollView style={{ marginBottom: 40 }}>
        {posts.map((post, index) => (
          <Post post={post[0]} postID={post[1]} postUser={post[2]} key={index} />
        ))}
      </ScrollView>
      <BottomTabs navigation={navigation} />
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
