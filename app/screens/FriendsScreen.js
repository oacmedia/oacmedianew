import React, { useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet, View, Text  } from "react-native";
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

const initialMessages = [
  {
    id: 1,
    title: "Jay Parker",
    description: "Hey! Is this item still available?",
    image:
      "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg",
  },
  {
    id: 2,
    title: "Natalia",
    description:
      "I'm interested in this item. When will you be able to post it?",
    image:
      "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg",
  },
];

function FriendsScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const {user, setUser} = useUserAuth();
  const [loading, setLoading] = useState(true);

  let id = 0;

  const loadPosts = useCallback(() => {
    if(loading){
      let query = firestore().collection('Friends').doc(user.id)
    
      query.get()
        .then((snapshot) => {
          let data = snapshot.data();
          data.friends.map((friend)=>{
              let user = friend.user;
              firestore().collection('Users').doc(user).get()
              .then((user)=>{
                  let rdata = user.data();   
                  let obj = {id: id,title: rdata.title,firstName: rdata.firstName,lastName: rdata.lastName,profile: rdata.profile, phoneNumber: rdata.phoneNumber};
                  setMessages((prevRequests) => {
                      return [...prevRequests, obj]
                  });
                  if(data.friends.length != id+1){
                    id++;
                  }else{
                    setLoading(false)
                    id = 0;
                  }
              })
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
    // .delete().then(()=>{
    //     console.log('request removed!');
    // })
  };

  return (
    <Screen>
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
