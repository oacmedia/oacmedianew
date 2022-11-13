import { Image, StyleSheet, View, ImageBackground, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import Screen from "../components/Screen";
import Text from "../components/Text";
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import TouchableIcon from "../components/TouchableIcon";
import TextInput from "../components/TextInput";
import colors from "../config/colors";
import AppText from "../components/Text";
import { POSTS } from "../data/posts";
import { useDataSharing } from "../context/DataSharingContext";
import { useUserAuth } from "../context/UserAuthContext";
import {
  Actions,
  Bubble,
  GiftedChat,
  InputToolbar,
} from "react-native-gifted-chat";
import ImageView from "react-native-image-viewing";

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const {sharedData, setSharedData} = useDataSharing();
  const {user, setUser} = useUserAuth();
  const [userData, setUserData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageView, setSeletedImageView] = useState("");

  // const [isLoading, setIsLoading] = useState(true)
  // const [isFinished, setIsFinished] = useState(false)
  // const [lastDocRef, setLastDocRef] = useState(null)
  // let pageSize = 20;

  // const loadPosts = useCallback(() => {
  //   setIsLoading(true);
  //   let query = firestore().collection('ChatRoom/'+sharedData.chatid)
  //   if(lastDocRef) {
  //     query = query.startAfter(lastDocRef)
  //   }
  //   query = query.limit(pageSize)
  //   query.get()
  //     .then(async (snapshot) => {
  //       let post = [];
  //       for( let chat of snapshot.docs ){
  //           let data = chat.data();
  //           let id = chat.id;
  //           let userData = await firestore().collection('Users').doc(data.sender).get();
  //           let rdata = userData.data();
  //           post.push({id: id,title: rdata.title,firstName: rdata.firstName,lastName: rdata.lastName,profile: rdata.profile, phoneNumber: rdata.phoneNumber});
  //       }
  //       if(snapshot.docs.length < pageSize) {
  //         setIsFinished(true);
  //       }
  //       if(snapshot.docs.length) {
  //         setLastDocRef(snapshot.docs[snapshot.docs.length-1]);
  //       }
  //       setIsLoading(false);
  //       setMessages((prevPosts) => {
  //         let objs = post.map((obj)=>{
  //           return obj;
  //         });
  //         return [...prevPosts, ...objs];
  //       });
  //     });
  // }, [setIsLoading, setIsFinished, setMessages, lastDocRef, setLastDocRef])

  // const fetchMoreData = useCallback(() => {
  //   if(isLoading || isFinished) return;
  //   loadPosts();
  // }, [isFinished, isLoading])

  useEffect(() => {
    if(sharedData){
      let chatid = sharedData.chatid;
      firestore().collection('Chats').where('chatid','==',chatid).where('user','==',user.id).get().then((snapshot)=>{
        snapshot.docs.map((result)=>{
          let data = result.data();
          firestore().collection('Users').doc(data.friend).get().then((snapshot)=>{
            //console.log(snapshot.data());
              let data = snapshot.data();
              setUserData(data);
          })
        })
      })
    }


  //   loadPosts();



  //   let query = firestore().collection('ChatRoom/'+sharedData.chatid)
  //   let unsubscribe = query.onSnapshot((snapshot) => {
  //     setMessages((prevPosts) => {
  //       // don't load posts on reload
  //       if(prevPosts.length === 0)
  //         return prevPosts;
  //       let newPosts = [...prevPosts];
  //       snapshot.docChanges().forEach(async(change)=> {
  //         let data = change.doc.data();
  //         let id = change.doc.id;
  //         let userInfo = await firestore().collection('Users').doc(data.sender).get();
  //         let userData = userInfo.data();

  //         let _postIndex = newPosts.findIndex((_post) => _post.id === id);
  //         if(change.type === "removed") {
  //           newPosts.splice(_postIndex, 1);
  //           return;
  //         }
  //         let post = {id: id,title: userData.title,firstName: userData.firstName,lastName: userData.lastName,profile: userData.profile, phoneNumber: userData.phoneNumber};
  //         if(_postIndex !== -1) {
  //           newPosts.splice(_postIndex, 1, ...post);
  //         } else {
  //           newPosts.unshift(...post);
  //         }
  //       })
  //       return newPosts;
  //     })
  //   })
  //   return () => {
  //     unsubscribe();
  //   }
  }, []);

  const handleCall = () => {
    navigation.navigate("CallScreen");
  };
  return (
    <Screen>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableIcon
            name="arrow-left"
            size={25}
            onPress={() => {
              setSharedData({});
              setUserData([]);
              navigation.navigate("MessagesScreen");
            }}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: userData && userData.profile }}
              style={styles.head_image}
            />
            <AppText style={[styles.head_title, {}]}>{userData && userData.title+" "+userData.firstName+" "+userData.lastName}</AppText>
          </View>
        </View>
        <TouchableIcon name="phone" size={25} onPress={handleCall} />
      </View>
      <View style={styles.body}>
        {/* Incoming */}

        <View style={{ alignItems: "baseline" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: POSTS[0].profile_picture }}
              style={styles.msg_image}
            />
            <View style={styles.incoming}>
              <AppText>HELLO</AppText>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: POSTS[0].profile_picture }}
              style={styles.msg_image}
            />
            <View style={styles.incoming}>
              <AppText>Thererer er e r e</AppText>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: POSTS[0].profile_picture }}
              style={styles.msg_image}
            />
            <View style={styles.incoming}>
              <AppText>HELLO</AppText>
            </View>
          </View>
        </View>

        {/* Outgoing */}

        <View style={{ alignItems: "flex-end" }}>
          <View style={styles.outgoing}>
            <AppText>HELLO</AppText>
          </View>
          <View style={styles.outgoing}>
            <AppText>Thererer er e r e</AppText>
          </View>
          <View style={styles.outgoing}>
            <AppText>HELLO</AppText>
          </View>
        </View>
      </View>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.black,
            borderTopWidth: 2,
            borderTopColor: colors.darkGrey,
          },
        ]}
      >
        <TouchableIcon name="camera" size={25} />
        <TouchableIcon name="image-multiple" size={25} />
        <TouchableIcon name="microphone" size={25} />
        <TextInput placeholder="Message" padding={8} width={"60%"} />
        <TouchableIcon name="send" size={25} />
      </View>
    </Screen>
  );

  // const appendMessages = useCallback(
  //   (messages) => {
  //     setMessages((previousMessages) =>
  //       GiftedChat.append(previousMessages, messages)
  //     );
  //   },
  //   [messages]
  // );

  // async function onSend(messages = []) {
  //   const writes = messages.map((m) => addDoc(roomMessagesRef, m));
  //   const lastMessage = messages[messages.length - 1];
  //   writes.push(updateDoc(roomRef, { lastMessage }));
  //   await Promise.all(writes);
  // }

  // async function sendImage(uri, roomPath) {
  //   const { url, fileName } = await uploadImage(
  //     uri,
  //     `images/rooms/${roomPath || roomHash}`
  //   );
  //   const message = {
  //     _id: fileName,
  //     text: "",
  //     createdAt: new Date(),
  //     user: senderUser,
  //     image: url,
  //   };
  //   const lastMessage = { ...message, text: "Image" };
  //   await Promise.all([
  //     addDoc(roomMessagesRef, message),
  //     updateDoc(roomRef, { lastMessage }),
  //   ]);
  // }

  // async function handlePhotoPicker() {
  //   const result = await pickImage();
  //   if (!result.cancelled) {
  //     await sendImage(result.uri);
  //   }
  // }

  // return (
  //   <ImageBackground
  //     resizeMode="cover"
  //     source={require("../assets/chatbg.png")}
  //     style={{ flex: 1 }}
  //   >
  //     <GiftedChat
  //       onSend={onSend}
  //       messages={messages}
  //       user={senderUser}
  //       renderAvatar={null}
  //       renderActions={(props) => (
  //         <Actions
  //           {...props}
  //           containerStyle={{
  //             position: "absolute",
  //             right: 50,
  //             bottom: 5,
  //             zIndex: 9999,
  //           }}
  //           onPressActionButton={handlePhotoPicker}
  //           icon={() => (
  //             <Ionicons name="camera" size={30} color={colors.iconGray} />
  //           )}
  //         />
  //       )}
  //       timeTextStyle={{ right: { color: colors.iconGray } }}
  //       renderSend={(props) => {
  //         const { text, messageIdGenerator, user, onSend } = props;
  //         return (
  //           <TouchableOpacity
  //             style={{
  //               height: 40,
  //               width: 40,
  //               borderRadius: 40,
  //               backgroundColor: colors.primary,
  //               alignItems: "center",
  //               justifyContent: "center",
  //               marginBottom: 5,
  //             }}
  //             onPress={() => {
  //               if (text && onSend) {
  //                 onSend(
  //                   {
  //                     text: text.trim(),
  //                     user,
  //                     _id: messageIdGenerator(),
  //                   },
  //                   true
  //                 );
  //               }
  //             }}
  //           >
  //             <Ionicons name="send" size={20} color={colors.white} />
  //           </TouchableOpacity>
  //         );
  //       }}
  //       renderInputToolbar={(props) => (
  //         <InputToolbar
  //           {...props}
  //           containerStyle={{
  //             marginLeft: 10,
  //             marginRight: 10,
  //             marginBottom: 2,
  //             borderRadius: 20,
  //             paddingTop: 5,
  //           }}
  //         />
  //       )}
  //       renderBubble={(props) => (
  //         <Bubble
  //           {...props}
  //           textStyle={{ right: { color: colors.text } }}
  //           wrapperStyle={{
  //             left: {
  //               backgroundColor: colors.white,
  //             },
  //             right: {
  //               backgroundColor: colors.tertiary,
  //             },
  //           }}
  //         />
  //       )}
  //       renderMessageImage={(props) => {
  //         return (
  //           <View style={{ borderRadius: 15, padding: 2 }}>
  //             <TouchableOpacity
  //               onPress={() => {
  //                 setModalVisible(true);
  //                 setSeletedImageView(props.currentMessage.image);
  //               }}
  //             >
  //               <Image
  //                 resizeMode="contain"
  //                 style={{
  //                   width: 200,
  //                   height: 200,
  //                   padding: 6,
  //                   borderRadius: 15,
  //                   resizeMode: "cover",
  //                 }}
  //                 source={{ uri: props.currentMessage.image }}
  //               />
  //               {selectedImageView ? (
  //                 <ImageView
  //                   imageIndex={0}
  //                   visible={modalVisible}
  //                   onRequestClose={() => setModalVisible(false)}
  //                   images={[{ uri: selectedImageView }]}
  //                 />
  //               ) : null}
  //             </TouchableOpacity>
  //           </View>
  //         );
  //       }}
  //     />
  //   </ImageBackground>
  // );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: '2%',
    backgroundColor: colors.darkGreen,
    width: "100%",
  },
  text: {
    fontSize: 25,
  },
  body: {
    flex: 1,
    backgroundColor: colors.black,
    paddingVertical: 10,
  },
  incoming: {
    borderRadius: 50,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: colors.darkGrey,
    marginVertical: 1,
    marginLeft: 10,
  },
  outgoing: {
    borderRadius: 50,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: colors.darkGreen,
    marginVertical: 1,
    marginRight: 20,
  },
  head_image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    borderRadius: 40,
    marginLeft: 15,
    borderWidth: 1.6,
    borderColor: "#FF8501",
  },
  head_title: {
    fontSize: 18,
    marginLeft: 15,
    fontWeight: "500",
    color: colors.white,
  },

  msg_image: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    borderRadius: 50,
    marginLeft: 15,
    borderWidth: 1.6,
    borderColor: "#FF8501",
  },
});
