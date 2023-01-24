import { Image, ScrollView, StyleSheet, View, TouchableOpacity, FlatList, Dimensions, Keyboard } from "react-native";
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
import { useCommentsSharing } from "../context/CommentsSharingContext";
import {Form, FormField, SubmitButton} from "../components/forms";
import * as Yup from "yup";
import moment from "moment/moment";

import {
    ListItem,
    ListItemDeleteAction,
    ListItemSeparator,
  } from "../components/lists";


const CommentsScreen = ({ navigation }) => {
  const {user, setUser} = useUserAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const [lastDocRef, setLastDocRef] = useState(null)
  const {commentsData, setCommentsData} = useCommentsSharing();
  let pageSize = 20;
  var {height, width} = Dimensions.get('window');
  const loadPosts = useCallback(() => {
    setIsLoading(true);
    let query = firestore().collection('Comments').where('postID', '==', commentsData.postID)
    if(lastDocRef) {
      query = query.startAfter(lastDocRef)
    }
    // query = query.orderBy("time")
    query = query.limit(pageSize)
    query.get()
      .then(async (snapshot) => {
        let post = [];
        for( let cat of snapshot.docs ){
            let data = cat.data();
            let id = cat.id;
            post.push({id: id,postID: data.postID,comment: data.comment,name: data.user,time: (data.time? data.time : "few days ago")});
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
  
  // const handleDelete = (request) => {
  //   firestore().collection('Notifications').doc(request).delete().then(()=>{
  //       console.log('Notification removed!');
  //   })
  // };
  const handlePost = (values, {resetForm})=>{
    Keyboard.dismiss();
    //let postID = commentsData.postID;
    firestore().collection('Comments').doc().set({
      //postID: postID,
      user: (user.title+" "+user.firstName).toString(),
      comment: values.comment,
      postID: commentsData.postID,
      time: firestore.FieldValue.serverTimestamp()
    }).then(()=>{
      resetForm();
    })
  }

  useEffect(()=>{
    // firestore().collection('Categories').get().then((snapshot)=>{
    //     snapshot.docs.map((request)=>{
    //         console.log(request.data());
    //     })
    // })
    loadPosts();
    let query = firestore().collection('Comments').where('postID', '==', commentsData.postID)
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
          let post = [{id: id,postID: data.postID,comment: data.comment,name: data.user,time: (data.time? data.time : "few days ago")}];
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
      {messages.length <= 0 && <View style={{position:"absolute", top: (height/2)-25,left: (width/2)-160,}}>
          <AppText style={{ fontSize: 25, fontWeight: "700",
            marginLeft: 15,
            fontWeight: "500",
            color: "white", 
            
            }}>No Comments to Show!</AppText>
        </View>}
      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20, marginHorizontal: 10 }}>
          <TouchableIcon
            name="arrow-left"
            size={30}
            onPress={() => {
              navigation.navigate("HomeScreen");
            }}
          />
          <View style={{ flexDirection: "column",alignSelf: "center" }}>
            <AppText style={{ fontSize: 25, fontWeight: "700",
            marginLeft: 15,
            fontWeight: "500",
            color: "white", 
            alignItems: "center",
            }}>All Comments</AppText>
          </View>
        </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <View style={{alignSelf: 'flex-start',paddingVertical:5,paddingHorizontal:10}}>
            <View style={{backgroundColor:"rgba(220,220,220,0.2)",borderRadius:30,paddingVertical:15,paddingLeft: 5, paddingRight: 20,}}>
              <Text style={{ fontSize: 18, fontWeight: "700",
              marginLeft: 15,
              color: "white",
              width:"auto"
              }}>{item.name+"  "}</Text>
              <Text style={{ fontSize: 14, fontWeight: "600",
              marginLeft: 15,
              color: "white",
              width:"auto"
              }}>{item.comment}</Text>
            </View>
            <Text style={{marginLeft: 20,}}>{item.time == "few days ago" ? item.time : moment.utc(item.time.toDate()).local().startOf('seconds').fromNow()}</Text>
          </View>
          // return <ListItem
          //   title={item.name}
          //   //image={item.profile}
          //   comment={item.comment}
          //   // renderRightActions={() => (
          //   //   <View style={{height: "100%", backgroundColor: "white"}}>
          //   //     <ListItemDeleteAction onPress={() => handleDelete(item.id)} />
          //   //   </View>
          //   // )}
          // />
        }}
        //ItemSeparatorComponent={ListItemSeparator}
        onEndReachedThreshold={0.2}
        onEndReached={fetchMoreData}
      />
      <Form
              initialValues={{ comment: "" }}
              validationSchema={Yup.object().shape({
                comment: Yup.string(),
              })}
              onSubmit={(values, { resetForm }) => {
                //console.log(commentsData.postID);
                //console.log(postID,postUser);
                handlePost(values, { resetForm });
                // const commentStore = firestore().collection('Comments').doc()
                // commentStore.set({
                //   postID: commentsData.postID,
                //   user: (user.title+" "+user.firstName).toString(),
                //   comment: values.comment,
                // })
                // .then((sent)=>{
                //   //console.log(sent);
                // })
                
                // setCommentsArr([
                //   ...commentsArr,
                //   { comment: values.comment, user: (user.title+" "+user.firstName).toString() },
                // ]);
                // resetForm();
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  alignSelf:"center",
                  width: "90%",
                }}
              >
                <FormField
                  name="comment"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  padding={10}
                  placeholder="Add a comment..."
                  width="100%"
                  paddingRight={40}
                />
                <SubmitButton
                  title={<Icon
                    name={"send"}
                    size={25} color={colors.background}
                  />}
                  style={{ padding: 0,height: 50, width: 60, backgroundColor: "transparent", position: "absolute", right: -5, zIndex: 1, fontSize: 12}}
                />
              </View>
            </Form>
    </Screen>
  );
};

export default CommentsScreen;

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