import React, { useEffect, useState } from "react";
import { TouchableHighlight } from "react-native";
import { StyleSheet, View, FlatList, SafeAreaView, Image, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../../config/colors";
import TouchableIcon from "../TouchableIcon";
import Text from "../Text";
import { useUserAuth } from "../../context/UserAuthContext";
//import { FirebaseStorageTypes } from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";

// definition of the Item, which will be rendered in the FlatList
const Item = ({ name, image, id, user }) => {
  const [requestStatus, setReqStatus] = useState(false);
  const [friendtStatus, setFriendStatus] = useState(false);
  function addFriend(id, user){
    console.log("Friend Req Sent To User ",id," By User ",user.id);
    firestore().collection('Requests').where('sender','==',user.id).where('receiver','==',id).get().then((snapshot)=>{
    //  console.log();
      if(snapshot._docs.length > 0){
        console.log("Already Sent Req");
      }
      else{
        firestore().collection('Requests').where('sender','==',id).where('receiver','==',user.id).get().then((snapshot)=>{
          if(snapshot._docs.length > 0){
            Alert.alert("Friend Request Failed!","User Already Sent You A Friend Req!");
          }else{
            firestore().collection('Requests').doc()
            .set({
              sender: user.id,
              receiver: id,
            })
            setReqStatus(true);
          }
        })
        }
      })
    }
  

  useEffect(()=>{
    firestore().collection('Requests').where('sender','==',user.id).where('receiver','==',id).get().then((snapshot)=>{
      //  console.log();
        if(snapshot._docs.length > 0){
          setReqStatus(true);
        }
        else{
          setReqStatus(false);
          }
      })
      firestore().collection('Friends').doc(user.id).get().then((snapshot)=>{
        //  console.log();
        let data = snapshot.data();
        data.friends.map((friend)=>{
          if(friend.user == id){
            setFriendStatus(true);
          }
        })
      })  
  },[])
return(
  <View style={styles.container}>
    {image && <Image style={styles.image} source={{ uri: image }} />}
    <View style={styles.detailsContainer}>
      <Text style={styles.title} numberOfLines={1}>
        {name}
      </Text>
    </View>
    <TouchableIcon name={friendtStatus ? "account-multiple":(requestStatus?"account-check":"account-plus")} iconColor={colors.black} onPress={()=>{
      if(!friendtStatus){
        addFriend(id, user)}}
      }
      />
  </View>
)};

// the filter
const List = ({ searchPhrase, data }) => {
  const {user, setUser} = useUserAuth();
  const renderItem = ({ item }) => {
    // when no input, show none
    if (searchPhrase === "") {
      return;
    }
    // filter of the Name
    if (
      item.firstName
        .toUpperCase()
        .includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))
    ) {
      return <Item id={item.id} name={item.firstName+" "+item.lastName} image={item.profile} user={user}/>;
    }
  };

  return (
    <SafeAreaView style={styles.list__container}>
      <View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default List;

const styles = StyleSheet.create({
  list__container: {
    margin: 10,
    height: "85%",
    width: "80%",
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    borderRadius: 50,
    padding: 15,
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderBottomWidth: 2,
  },
  detailsContainer: {
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 35,
  },

  title: {
    fontSize: 25,
    fontWeight: "500",
    color: colors.black,
  },
});
