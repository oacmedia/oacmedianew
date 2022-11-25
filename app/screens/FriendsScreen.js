import React, { useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet, View, Text, ActivityIndicator, Dimensions,   } from "react-native";
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
import { useUserAuth } from "../context/UserAuthContext";


function FriendsScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const {user, setUser} = useUserAuth();
  const [processInd, setProcessInd] = useState(false);
  const [loading, setLoading] = useState(true);
  const fullWidth = Dimensions.get('window').width;
  const fullHeight = Dimensions.get('window').height;
  let id = 0;
  const loadPosts = useCallback(() => {
    setProcessInd(true);
    if(loading){
      let query = firestore().collection('Friends').doc(user.id)
      query.get()
        .then(async(snapshot) => {
          let data = snapshot.data();
          let post = [];
          for( let user of data.friends ){
            id++;
            let currentUser = user.user;
            let userData = await firestore().collection('Users').doc(currentUser).get();
            let rdata = userData.data();
            post.push({id: id,title: rdata.title,firstName: rdata.firstName,lastName: rdata.lastName,profile: rdata.profile, phoneNumber: rdata.phoneNumber});
            if(data.friends.length == id){
              setProcessInd(false);
              setLoading(false);
              id = 0;
            }
          }
          setMessages((prevRequests) => {
              return [...prevRequests, ...post]
          });
        });
    }
    
  }, [setMessages])

  useEffect(() => {
    loadPosts();
  }, []);


  const handleDelete = (request) => {
    firestore().collection('Friends').doc(user.id).update({
      friends: firestore.FieldValue.arrayRemove({user: request}),
    }).then(()=>{
      console.log('Deleted First!');  
    })
    firestore().collection('Friends').doc(request).update({
      friends: firestore.FieldValue.arrayRemove({user: user.id}),
    }).then(()=>{
      console.log('Deleted Second!');
      setMessages([]);
      setLoading(true);
      loadPosts();
    })
  };

  return (
    <Screen>
      {processInd && <ActivityIndicator style={{alignSelf:"center",height: fullHeight, width: fullWidth, justifyContent: "center"}} size={100} color="white"/>}
      <View style={{ alignSelf: "center", marginVertical: 20 }}>
        <AppText style={{ fontSize: 25, fontWeight: "700" }}>Friends</AppText>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <ListItem
            title={item.title+" "+item.firstName+" "+item.lastName}
            image={item.profile}
            renderRightActions={() => (
                <ListItemDeleteAction onPress={() => handleDelete(item.phoneNumber)} />
            )}
          />
        }}
        ItemSeparatorComponent={ListItemSeparator}
      />
      <BottomTabs navigation={navigation} />
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default FriendsScreen;
