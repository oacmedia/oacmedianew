import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Post from "../components/home/Post";

import Screen from "../components/Screen";
import AppText from "../components/Text";
//import { POSTS } from "../data/posts";
import { useUserAuth } from "../context/UserAuthContext";
import firestore from '@react-native-firebase/firestore';
import storage from "@react-native-firebase/storage";
import BottomTabs from "../components/home/BottomTabs";

function PostsScreen({ navigation }) {
  const {user, setUser} = useUserAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    //console.log(route.params);
  //console.log(user);
  firestore().collection('Posts').where('userID', '==', user.phoneNumber).get()
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
      <View style={{ alignSelf: "center", marginVertical: 20 }}>
        <AppText style={{ fontSize: 25, fontWeight: "700" }}>Posts</AppText>
      </View>
      <ScrollView style={{ marginBottom: 40 }}>
        {posts.map((post, index) => (
          <Post
            post={post[0]}
            postID={post[1]}
            postUser={post[2]}
            key={index}
            withFooter={false}
            withCommentSection={false}
            withDeleteButton={true}
          />
        ))}
      </ScrollView>
      <BottomTabs navigation={navigation} />
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default PostsScreen;
