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
import { FlatList } from "react-native-gesture-handler";

const HomeScreen = ({ routes, navigation }) => {
  const {user, setUser} = useUserAuth();
  const [posts, setPosts] = useState([]);
  //const [postsID, setPostID] = useState([]);
  // console.log(user);
  useEffect(() => {
    //if(routes){
      function onResult(QuerySnapshot) {
        //console.log('I got called!');
        if(!posts.length) {
          //console.log(QuerySnapshot._docs.data);
          let postsArray = QuerySnapshot._docs.map((data)=>{
            if(data._data.userID){
              //console.log(data._ref._documentPath._parts[1]);
              let post = data._data;
              let userID = post.userID;
              let id = data._ref._documentPath._parts[1];
              //console.log([post, id, post.userID]);
              //setPosts([post, id, userID]);
              return [post, id, userID];
            }
          })

          setPosts(postsArray);
        } else {
            let newPosts = [...posts];
            QuerySnapshot.docChanges().forEach((change)=> {
              //console.log(data._nativeData.doc.data);
              id = change.doc.id;
              let _postIndex = newPosts.findIndex((_post) => _post[1] === id);
              if(change.type === "removed") {
                newPosts.splice(_postIndex, 1);
                return;
              }
              // if(data._data.userID){
              //   //console.log(data._ref._documentPath._parts[1]);
              let postData = change.doc.data();
              let post = {caption: postData.caption,imageURL: postData.imageURL,userID: postData.userID};
              if(_postIndex !== -1) {
                newPosts.splice(_postIndex, 1, [post,id,post.userID]);
              } else {
                newPosts.unshift([post,id,post.userID]);
              }
              //   let id = data._ref._documentPath._parts[1];
              //   setPosts([post, id, post.userID]);
              //   //return [post, id, post.userID];
              // }
            })
            // let latestPost = postsArray.map((post, index)=>{
            //   <Post post={post[0]} postID={post[1]} postUser={post[2]} key={index} user={user} />    
            // });
            setPosts(newPosts);
            //setNewPosts(latesPost);
          //postsArray.
        }
      }
  
      function onError(error) {
        console.error(error);
      }
  
      firestore().collection('Posts').onSnapshot(onResult, onError);
    //}
  }, []);

  return (
    <Screen>
      <Header navigation={navigation} />
      <ScrollView style={{ marginBottom: 40 }}>
        <FlatList
          data={posts}
          keyExtractor={(post) => post[1]}
          renderItem={(item) => {
            const {item: post} = item
            return <Post post={post[0]} postID={post[1]} postUser={post[2]} user={user} />
          }} />
      </ScrollView>
      <BottomTabs navigation={navigation} />
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
