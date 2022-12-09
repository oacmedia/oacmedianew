import React, { useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import AppText from "../components/Text";
import ListItemAcceptAction from "../components/lists/ListItemAcceptAction";
import { useUserAuth } from "../context/UserAuthContext";


function RequestsScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const {user, setUser} = useUserAuth();

  const [isLoading, setIsLoading] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const [lastDocRef, setLastDocRef] = useState(null)
  let pageSize = 20;

  function returnToFriends(navigation){
    navigation.navigate("FriendsScreen");
  }

  const loadPosts = useCallback(() => {
    setIsLoading(true);
    let query = firestore().collection('Requests').where('receiver','==',user.id);
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
            let userData = await firestore().collection('Users').doc(data.sender).get();
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
    let query = firestore().collection('Requests').where('receiver','==',user.id);
    let unsubscribe = query.onSnapshot((snapshot) => {
      setMessages((prevPosts) => {
        // don't load posts on reload
        if(prevPosts.length === 0)
          return prevPosts;
        let newPosts = [...prevPosts];
        snapshot.docChanges().forEach(async(change)=> {
          let data = change.doc.data();
          let id = change.doc.id;
          let userInfo = await firestore().collection('Users').doc(data.sender).get();
          let userData = userInfo.data();

          let _postIndex = newPosts.findIndex((_post) => _post.id === id);
          if(change.type === "removed") {
            newPosts.splice(_postIndex, 1);
            return;
          }
          let post = {id: id,title: userData.title,firstName: userData.firstName,lastName: userData.lastName,profile: userData.profile, phoneNumber: userData.phoneNumber};
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
  }, []);

//   const loadPosts = useCallback(() => {
//     setIsLoading(true);
//     let query = firestore().collection('Requests').where('receiver','==',user.id);
//     if(lastDocRef) {
//       query = query.startAfter(lastDocRef)
//     }
//     query = query.limit(pageSize)
//     query.get()
//       .then((snapshot) => {
//         let newRequests = snapshot.docs.map((request)=>{
//             let id = request.id;
//             let data = request.data();
//             firestore().collection('Users').doc(data.sender).get()
//             .then((user)=>{
//                  let rdata = user.data();   
//                  let obj = {id: id,title: rdata.title,firstName: rdata.firstName,lastName: rdata.lastName,profile: rdata.profile};
//                  setMessages((prevRequests) => {
//                     return [...prevRequests, obj]
//                 });
//             })
//         });
//         if(snapshot.docs.length < pageSize) {
//           setIsFinished(true);
//         }
//         if(snapshot.docs.length) {
//           setLastDocRef(snapshot.docs[snapshot.docs.length-1]);
//         }
//         setIsLoading(false);
//       });
//   }, [setIsLoading, setIsFinished, setMessages, lastDocRef, setLastDocRef])

//   const fetchMoreData = useCallback(() => {
//     if(isLoading || isFinished) return;
//     loadPosts();
//   }, [isFinished, isLoading])

//   useEffect(() => {
//     loadPosts();
//     let query = firestore().collection('Requests').where('receiver','==',user.id);
//     let unsubscribe = query.onSnapshot((snapshot) => {
//         setMessages((prevRequests) => {
//         // don't load posts on reload
//         if(prevRequests.length === 0)
//           return prevRequests;
//         let newRequests = [...prevRequests];
//         snapshot.docChanges().forEach(async(change)=> {
//             let postData = change.doc.data();
//             let id = change.doc.id;
//             let userInfo = await firestore().collection('Users').doc(postData.sender).get()
            
//             let rdata = userInfo.data();   
//             let userData = {id: id,title: rdata.title,firstName: rdata.firstName,lastName: rdata.lastName,profile: rdata.profile};
            
//           let _postIndex = newRequests.findIndex((_post) => _post.id === id);
//           if(change.type === "removed") {
//             newRequests.splice(_postIndex, 1);
//             return;
//           }
//           if(_postIndex !== -1) {
//             newRequests.splice(_postIndex, 1, [userData]);
//           } else {
//             newRequests.unshift(
//                 [userData]
//             );
//           }
//         })
//         return newRequests;
//       })
//     })
//     return () => {
//       unsubscribe();
//     }
//   }, []);


  const handleDelete = (request) => {
    firestore().collection('Requests').doc(request).delete().then(()=>{
        console.log('request removed!');
    })
  };

  const handleAccept = (request) => {
    let count = 0;
    firestore().collection('Requests').doc(request).get()
    .then((snapshot)=>{
        let data = snapshot.data();
        console.log(data);
        firestore().collection('Friends').doc(data.receiver).get().then((snapshot)=>{
            if(snapshot.exists){
                console.log('I have to update');
                firestore().collection('Friends').doc(data.receiver).update({
                    friends: firestore.FieldValue.arrayUnion({user: data.sender}),
                }).then(()=>{
                    count++;
                    console.log("Friend added in my list!");
                })
            }else{
                console.log('I have to create a new doc');
                firestore().collection('Friends').doc(data.receiver).set({
                    friends: [{user: data.sender}],
                }).then(()=>{
                    count++;
                    console.log("Friend added in my list!");
                })
            }
        })
        firestore().collection('Friends').doc(data.sender).get().then((snapshot)=>{
            if(snapshot.exists){
                console.log('I have to update');
                firestore().collection('Friends').doc(data.sender).update({
                    friends: firestore.FieldValue.arrayUnion({user: data.receiver}),
                }).then(()=>{
                    count++;
                    console.log("Friend added in my list!");
                    if(count == 2){
                        count = 0;
                        firestore().collection('Requests').doc(request).delete().then(()=>{
                            console.log('request removed!');
                        })
                    }
                })
            }else{
                console.log('I have to create a new doc');
                firestore().collection('Friends').doc(data.sender).set({
                    friends: [{user: data.receiver}],
                }).then(()=>{
                    count++
                    console.log("I am added in my friend's friends list!");
                    if(count == 2){
                        count = 0;
                        firestore().collection('Requests').doc(request).delete().then(()=>{
                            console.log('request removed!');
                            returnToFriends(navigation);
                        })
                    }
                })
            }
        })
    })
  };

  return (
    <Screen>
      <View style={{ alignSelf: "center", marginVertical: 20 }}>
        <AppText style={{ fontSize: 25, fontWeight: "700" }}>Friend Requests</AppText>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <ListItem
            title={item.title+" "+item.firstName+" "+item.lastName}
            image={item.profile}
            renderRightActions={() => (
              <View style={{height: "100%", backgroundColor: "white"}}>
                <ListItemAcceptAction onPress={() => handleAccept(item.id)} />
                <ListItemDeleteAction cross={"cancel"} onPress={() => handleDelete(item.id)} />
              </View>
            )}
          />
        }}
        ItemSeparatorComponent={ListItemSeparator}
        onEndReachedThreshold={0.2}
        onEndReached={fetchMoreData}
      />
      <BottomTabs navigation={navigation} scrName={"AccountScreen"}/>
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default RequestsScreen;
