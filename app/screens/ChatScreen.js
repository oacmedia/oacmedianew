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
import { Ionicons } from "@expo/vector-icons";
import {
  Actions,
  Bubble,
  GiftedChat,
  InputToolbar,
} from "react-native-gifted-chat";
import ImageView from "react-native-image-viewing";
import * as ImagePicker from "expo-image-picker";
import storage from '@react-native-firebase/storage';

export async function pickImage() {
  let result = ImagePicker.launchCameraAsync();
  return result;
}
export async function pickGalleryImage() {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.5,
  });
  return result;
}

export async function askForPermission() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status;
}

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const {sharedData, setSharedData} = useDataSharing();
  const {user, setUser} = useUserAuth();
  const [secondUser, setSecondUser] = useState([]);
  const [userData, setUserData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageView, setSeletedImageView] = useState("");

     const getAllMessages = async ()=>{
        const docid  = sharedData.chatid;
        const querySnap = await firestore().collection('Chatrooms')
        .doc(docid)
        .collection('messages')
        .orderBy('createdAt',"desc")
        .get()
       const allmsg = querySnap.docs.map(docSnap=>{
            return {
                ...docSnap.data(),
                createdAt:docSnap.data().createdAt.toDate()
            }
        })
        setMessages(allmsg)
     }
     const getSecondUser = async()=>{
      const snapshot = await firestore().collection('Chats').where('chatid','==',sharedData.chatid).where('user','==',user.id).get()
      let su;
      snapshot.docs.map((result)=>{
        let data = result.data();
        su = data.friend;
      })
      const friendSnapshot = await firestore().collection('Users').doc(su).get()
      let data = friendSnapshot.data();
      setSecondUser({secondUser: data.id, profile: data.profile});
     }
     const handleCall = () => {
      navigation.navigate("CallScreen");
    };

    async function handlePhotoPicker() {
      const result = await pickImage();
      if (!result.cancelled) {
        await sendImage(result.uri);
      }
    }
    async function handleGalleryPhotoPicker() {
      const result = await pickGalleryImage();
      if (!result.cancelled) {
        await sendImage(result.uri);
      }
    }

    useEffect(() => {
      if(sharedData){
        let chatid = sharedData.chatid;
        firestore().collection('Chats').where('chatid','==',chatid).where('user','==',user.id).get().then((snapshot)=>{
          snapshot.docs.map((result)=>{
            let data = result.data();
            firestore().collection('Users').doc(data.friend).get().then((snapshot)=>{
                let data = snapshot.data();
                setUserData(data);
            })
          })
        })
      }

      getSecondUser();
      getAllMessages();

      const docid  = sharedData.chatid;
        const messageRef = firestore().collection('Chatrooms')
        .doc(docid)
        .collection('messages')
        .orderBy('createdAt',"desc")

      const unSubscribe =  messageRef.onSnapshot((querySnap)=>{
            const allmsg =   querySnap.docs.map(docSnap=>{
             const data = docSnap.data()
             if(data.createdAt){
                 return {
                    ...docSnap.data(),
                    createdAt:docSnap.data().createdAt.toDate()
                }
             }else {
                return {
                    ...docSnap.data(),
                    createdAt:new Date()
                }
             }
                
            })
            setMessages(allmsg)
        })


        return ()=>{
          unSubscribe()
        }

        
      }, [])

      async function sendImage(uri){
        let url;
        let pathToFile = uri.toString();
        let filename = pathToFile.substring(pathToFile.lastIndexOf('/')+1);
        
        let image = storage().ref(filename).putFile(pathToFile)
        image.on('state_changed',taskSnapshot => {
          console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
        });
        image.then(async(data) => {
          url = await storage().ref(data.metadata.fullPath).getDownloadURL();
          
          if(data.state == "success"){
            const message = {
              _id: filename,
              text: "",
              createdAt: firestore.FieldValue.serverTimestamp(),
              user: {_id: user.id},
              sentBy:user.id,
              sentTo:secondUser.secondUser,
              image: url,
            };
            const lastMessage = { ...message, text: "Image" };    
            setMessages(previousMessages => GiftedChat.append(previousMessages,lastMessage))
            const docid  = sharedData.chatid;
      
            await firestore().collection('Chatrooms')
            .doc(docid)
            .collection('messages')
            .add({...lastMessage,createdAt:firestore.FieldValue.serverTimestamp()})

          }
        })
        .catch((e)=>{
            console.log(e)
        })
      }

      const onSend =(messageArray) => {
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            sentBy:user.id,
            sentTo:secondUser.secondUser,
            createdAt:new Date()
        }
       setMessages(previousMessages => GiftedChat.append(previousMessages,mymsg))
       const docid  = sharedData.chatid;
 
       firestore().collection('Chatrooms')
       .doc(docid)
       .collection('messages')
       .add({...mymsg,createdAt:firestore.FieldValue.serverTimestamp()})


      }
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
              <GiftedChat
                messages={messages}
                onSend={text => onSend(text)}
                user={{
                    _id: user.id,
                }}

                renderAvatar={null}
                renderActions={(props) => (
                  <>
                    <Actions
                      {...props}
                      containerStyle={{
                        position: "absolute",
                        left: -45,
                        bottom: 5,
                        zIndex: 9999,
                      }}
                      onPressActionButton={handlePhotoPicker}
                      icon={() => (
                        <Ionicons name="camera" size={30} color={colors.white} />
                      )}
                    />
                    <Actions
                      {...props}
                      containerStyle={{
                        position: "absolute",
                        left: -80,
                        bottom: 5,
                        zIndex: 9999,
                      }}
                      onPressActionButton={handleGalleryPhotoPicker}
                      icon={() => (
                        <Ionicons name="image" size={30} color={colors.white} />
                      )}
                    />
                  </>
                )}                        

                timeTextStyle={{ right: { color: colors.darkGrey } }}

                renderBubble={(props)=>{
                    return <Bubble
                    {...props}
                    wrapperStyle={{
                      right: {
                        backgroundColor:colors.darkGreen,

                      }
                      
                    }}
                  />
                }}

                renderInputToolbar={(props)=>{
                    return <InputToolbar {...props}
                     containerStyle={{
                      //borderTopWidth: 1.5, borderTopColor: colors.darkGreen
                        marginLeft: 80,
                        marginRight: 10,
                        marginBottom: 0,
                        borderRadius: 50,
                    }} 
                     textInputStyle={{ color: "black", }}
                     />
                }}
                
                renderMessageImage={(props) => {
                  return (
                    <View style={{ borderRadius: 15, padding: 2 }}>
                      <TouchableOpacity
                        onPress={() => {
                          setModalVisible(true);
                          setSeletedImageView(props.currentMessage.image);
                        }}
                      >
                        <Image
                          resizeMode="contain"
                          style={{
                            width: 200,
                            height: 200,
                            padding: 6,
                            borderRadius: 15,
                            resizeMode: "cover",
                          }}
                          source={{ uri: props.currentMessage.image }}
                        />
                        {selectedImageView ? (
                          <ImageView
                            imageIndex={0}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)}
                            images={[{ uri: selectedImageView }]}
                          />
                        ) : null}
                      </TouchableOpacity>
                    </View>
                  );
                }}

                renderSend={(props) => {
                  const { text, messageIdGenerator, user, onSend } = props;
                  return (
                    <TouchableOpacity
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 40,
                        backgroundColor: colors.darkGreen,
                        alignItems: "center",
                        justifyContent: "center",
                        marginVertical: 5,
                        marginRight: 5,
                      }}
                      onPress={() => {
                        if (text && onSend) {
                          onSend(
                            {
                              text: text.trim(),
                              user,
                              _id: messageIdGenerator(),
                            },
                            true
                          );
                        }
                      }}
                    >
                      <Ionicons name="send" size={20} color={colors.white} />
                    </TouchableOpacity>
                  );
                }}
              />
          </View>
        </Screen>
    )
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
