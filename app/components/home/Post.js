import React, { useMemo, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Modal,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  Pressable,
  ImageBackground
} from "react-native";
import { Dimensions } from "react-native";
import { Divider } from "@rneui/themed";
import * as Yup from "yup";

import AppText from "../Text";
import TouchableIcon from "../TouchableIcon";
import colors from "../../config/colors";
import { Form, FormField, SubmitButton } from "../forms";
import { useEffect } from "react";
import firestore from '@react-native-firebase/firestore';
//import { useUserAuth } from "../../context/UserAuthContext";
import { isEmptyArray } from "formik";
//import { FlatList } from "react-native-gesture-handler";
import Video from "react-native-video";
import storage from "@react-native-firebase/storage";
import Icon from 'react-native-vector-icons/FontAwesome';
import ProgressBar from 'react-native-progress/Bar';
import { useVideoData } from "../../context/VideoDataContext";
import { useCommentsSharing } from "../../context/CommentsSharingContext";
import moment from "moment/moment";

const PostHeader = ({ post, postUser, postID, DeleteButton, LoginnedUser, userData, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [frStatus, setFrStatus] = useState(false);
  const [me,setMe] = useState(false);
  const [requestStatus, setReqStatus] = useState(false);
  const [frRequestStatus, setFrReqStatus] = useState(false);
  function getFrStatus(id){
    firestore().collection('Friends').doc(LoginnedUser.id).get().then((snapshot)=>{
      //  console.log();
      let data = snapshot.data();
      data.friends.map((friend)=>{
        if(friend.user == id){
          setFrStatus(true);
        }
      })
    })
  }
  function getReqStatus(user,id){
    firestore().collection('Requests').where('sender','==',user.id).where('receiver','==',id).get().then((snapshot)=>{
      //  console.log();
        if(snapshot._docs.length > 0){
          setReqStatus(true);
        }
        else{
          setReqStatus(false);
          }
      })
  }
  function getFrReqStatus(user, id){
    firestore().collection('Requests').where('sender','==',id).where('receiver','==',user.id).get().then((snapshot)=>{
      if(snapshot._docs.length > 0){
        setFrReqStatus(true);
      }else{
        setFrReqStatus(false);
      }
    })
  }
  function addFriend(id, user){
    //console.log("Friend Req Sent To User ",id," By User ",user.id);
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
            firestore().collection('Notifications').doc()
            .set({
              sentBy: user.id,
                  sentTo: id,
                  messageType: "request",
                  text: "Requested You to Be Friends",
                  profile: user.profile,
                  name: user.title+" "+user.firstName+" "+user.lastName,
            })
            setReqStatus(true);
          }
        })
        }
      })
    }
  function deleteCalled(){
    firestore().collection('Likes').where("postID", "==", postID).get()
    .then((snapshot)=>{
      // console.log(snapshot.docs);
      let likes = 0;
      snapshot.docs.map((doc)=>{
        let id = doc.id;
        firestore().collection('Likes').doc(id).delete()
        .then(()=>{
          likes++;
          console.log(likes,"Likes Deleted!");
        })
      })
    })
    firestore().collection('Comments').where("postID", "==", postID).get()
    .then((snapshot)=>{
      let comments = 0;
      // console.log(snapshot.docs);
      snapshot.docs.map((doc)=>{
        let id = doc.id;
        firestore().collection('Comments').doc(id).delete()
        .then(()=>{
          comments++;
          console.log(comments,"Comments Deleted!");
        })
      })
    })
    firestore().collection('Posts').doc(postID).get()
    .then((data)=>{
      let files = [];
      let post = data.data();
      // console.log(snapshot.docs);
      if(post.contents){
        if(post.contents[0].type != "text"){
          post.contents.map((content)=>{
            let file = content.path;
            files.push(file);
          })
        }
      }
      if(files){
        files.map((file)=>{
          storage().ref(file).delete()
          .then(()=>{
            console.log("deleted something");
          });
        })
      }
    })
    firestore().collection('Posts').doc(postID).delete()
    .then(()=>{
      console.log("Deleted!");
    })

    //console.log("Delete Called!", postID);
  }
  return(
  <View style={styles.head_container}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          //Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}
        >
          <View style={styles.modalView}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={{ uri: userData.profile }} style={styles.head_image_new} />
              <AppText style={styles.head_title_new}>{userData.title+" "+userData.firstName+" "+userData.lastName}</AppText>
            </View>
            <View>
            {me?<Text style={styles.modalText}
            >It's Me!</Text>:(frStatus?
              <Pressable
              style={[styles.buttonNew, styles.buttonClose]}
              onPress={
                () => { setModalVisible(!modalVisible)
                  navigation.navigate("MessagesScreen")} 
                //setModalVisible(!modalVisible)
                }>
              <Text style={styles.textStyle}>Message</Text>
            </Pressable>
            : requestStatus? 
            <Text style={styles.modalText}
            >Request Sent!</Text>
            :
            frRequestStatus? 
            <Text style={styles.modalText}
            >Already Sent You Req!</Text>
            :
            <Pressable
              style={[styles.buttonNew, styles.buttonClose]}
              onPress={
                () => {addFriend(userData.phoneNumber, LoginnedUser)} 
                //setModalVisible(!modalVisible)
                }>
              <Text style={styles.textStyle}>Add Friend</Text>
            </Pressable>
            )}</View>
            <Pressable
               style={[styles.button, styles.buttonClose_New]}
              onPress={() => setModalVisible(!modalVisible)}>
                <Icon
                    name={"close"}
                    size={24} color={colors.white}
                  />
              {/* <Text style={styles.textStyle}
              >X</Text> */}
            </Pressable>
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={()=>{ setModalVisible(!modalVisible);
      if(LoginnedUser.id == userData.phoneNumber){
        setMe(true);
      }
        getReqStatus(LoginnedUser,userData.phoneNumber);
        getFrReqStatus(LoginnedUser, userData.phoneNumber);
        getFrStatus(userData.phoneNumber);
        //alert("You Opened "+userData.title+" "+userData.firstName+" "+userData.lastName+"'s profile with phone number "+userData.phoneNumber)
        }}>
        <Image source={{ uri: userData.profile }} style={styles.head_image} />
        <AppText style={styles.head_title}>{userData.title+" "+userData.firstName+" "+userData.lastName}</AppText>
      </TouchableOpacity>
    </View>
    <TouchableOpacity hitSlop={10}>
      {!DeleteButton ? (
        <TouchableIcon name={"alert-circle"} iconColor={colors.medium} size={35} onPress={()=>{Alert.alert("Is Something Wrong?","Tell us at: report@myoacmedia.co.za\nCall us at: +27-67987-1850")}} />
      ) : (
        <View></View>
      )}
      {DeleteButton ? (
        <TouchableIcon name={"delete"} iconColor={colors.danger} size={25} onPress={()=>{deleteCalled()}} />
      ) : (
        // <AppText style={{ fontWeight: "900", color: colors.bottom }}>
        //   {/* ... */}
        // </AppText>
        <View></View>
      )}
    </TouchableOpacity>
  </View>)
};

const PostVideo = ({ imageUrl, index, length, navigation,thumb }) => {
  const fullWidth = Dimensions.get('window').width;
  const [mute, setMute] = useState(false);
  const [paused, setPaused] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const {videoData, setVideoData} = useVideoData();
  const handleFullScreen = () => {
    setPaused(true);
    setVideoData({url: imageUrl});
    navigation.navigate("PostsFullScreen");
  }
  function secondToTime(time){
    return ~~(time / 60)+ ":" + (time % 60 < 10 ? "0" : "") + time % 60;
  }
  const handleMainButtonTouch = () => {
    if(progress > 1){
      Video.player.seek(0);
    }
    setPaused(!paused);
  }
  const handleMuteButtonTouch = () => {
    setMute(!mute);
  }
  const handleProgressPress = (e) =>{
    const position = e.nativeEvent.locationX;
    const progress = (position / (fullWidth-160)) * duration;
    Video.player.seek(progress);
  }
  const handleEnd = () =>{
    setPaused(true);
  }
  const handleProgress = (progress) =>{
    setProgress(progress.currentTime / duration);
  }
  const handleLoad = (meta) =>{
    setDuration(meta.duration);
  }
return (
  <View style={{ marginTop: 0, width: fullWidth }}>
    {!paused && <ActivityIndicator style={{alignSelf:"center",height: "100%", width: fullWidth, justifyContent: "center"}} size={100} color="white"/>} 
      <Video source={{uri: imageUrl}}   // Can be a URL or a local file.
          paused={paused}
          onLoad={handleLoad}
          onProgress={handleProgress}
          onEnd={handleEnd}
          muted={mute}
          ref={(ref) => {
            Video.player = ref
          }}    
          resizeMode={"cover"}
          poster={thumb}
          posterResizeMode={"cover"}
          // controls                                // Store reference
          // paused
          // onBuffer={Video.onBuffer}                // Callback when remote video is buffering
          // onError={Video.videoError}               // Callback when video cannot be loaded
          style={styles.backgroundVideo}
      />
      <Text style={styles.page}>{(index+1)+"/"+length}</Text>
      {paused && <Image
        style={{height: "100%",
        width: "100%",position: "absolute",zIndex: 1,resizeMode: 'cover',}}
        source={{uri: thumb}}
      />} 
      <View style={{
        backgroundColor: !paused ? "transparent" : "rgba(0, 0, 0, 0.5)",
        height: 48,
        width: 48,
        borderRadius: 24,
        top: fullWidth/2,
        left: (fullWidth/2)-24,
        bottom: 0,
        right: 0,
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 10,
        zIndex: 3,
      }}>
        <TouchableWithoutFeedback 
          onPress={handleMainButtonTouch}>
            <Icon
              name={!paused ? "pause" : "play"}
              size={20} color={!paused ? "transparent" : "#FFF"}
            />
        </TouchableWithoutFeedback>
      </View>
      {!paused && <View style={styles.controls}>
              <TouchableWithoutFeedback 
              onPress={handleMainButtonTouch}>
                <Icon
                  name={!paused ? "pause" : "play"}
                  size={20} color="#FFF"
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={handleProgressPress}
              >
                <View>
                  <ProgressBar 
                    progress={progress}
                    color="#FFF"
                    unfilledColor="rgba(255,255,255,.5)"
                    borderColor="#FFF"
                    width={fullWidth-160}
                    height={2}
                  />
                </View>
              </TouchableWithoutFeedback>
              <Text 
                style={styles.duration}
              >
                {secondToTime(Math.floor(progress * duration))}
              </Text>
              <TouchableWithoutFeedback 
              onPress={handleMuteButtonTouch}>
                <Icon
                  name={!mute ? "volume-down" : "volume-off"}
                  size={20} color="#FFF"
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={handleFullScreen}
                >
                <Icon
                //style={{marginLeft: 10,}}
                  name={"arrows-alt"}
                  size={20} color="#FFF"
                />
              </TouchableWithoutFeedback>
        </View>}
  </View>
)};
const PostImage = ({ imageUrl, index, length, navigation }) => {
  const fullWidth = Dimensions.get('window').width;
  const {videoData, setVideoData} = useVideoData();
  const handleFullScreen = () => {
    setVideoData({url: imageUrl});
    navigation.navigate("ImageFullScreen");
  }
  return (
    <View style={{ marginTop: 0 }}>
      <TouchableOpacity onPress={handleFullScreen}>
        <Image source={{ uri: imageUrl, width: fullWidth }}
          style={{ height: "100%", resizeMode: "cover" }}></Image>
      </TouchableOpacity>
      <Text style={styles.page}>{(index+1)+"/"+length}</Text>
    </View>
  )};

const PostContent = ({ post, navigation }) => {

  //const [video, setVideo] = useState(true);
  const [postsLength, setPostsLength] = useState(0);
  useEffect(()=>{
    if(post.contents){
      setPostsLength(post.contents.length);
    }else if(post.imageURL){
      setPostsLength(1);
    }
  },[]);

  const imageUrls = useMemo(() => {
    if(post.hasOwnProperty("imageUrl")) return [post.imageUrl];
    if(post.hasOwnProperty("contents")) return post.contents.map((content) => content
    )
    return [];
  }, [post])
  

  return (
    
  <View style={{ width: "100%",
  height: imageUrls[0].type == "text" ? "auto" : 450,
  backgroundColor: imageUrls[0].type == "text" ? colors.light : "transparent",
  padding: imageUrls[0].type == "text" ? 20 : 0,
  
  }}>
    {
      imageUrls[0].type == "text" ? <Text style={styles.textPost}>{imageUrls[0].text}</Text> : post.hasOwnProperty("imageURL") ? <Image
      source={{ uri: post.imageURL}}
      style={{ height: "100%", resizeMode: "cover" }}
    />
    :
    <FlatList
      data={imageUrls}
      style={{ flex: 1 }}
      renderItem={(item) => {
        //const {item: post} = item
        let imageUrl = item.item;
        let index = item.index;
        //console.log(imageUrl[0]);
        return imageUrl.type == "video/mp4" ?
          <PostVideo imageUrl={imageUrl.url} thumb={imageUrl.thumbnail?imageUrl.thumbnail:"https://firebasestorage.googleapis.com/v0/b/oacmedia-app-8464c.appspot.com/o/thumbnail.jpg?alt=media&token=1d69f50c-8546-4cbe-9fcc-a42f170ff31d"} index={index} length={postsLength} navigation={navigation}/>
          :
          <PostImage imageUrl={imageUrl.url} index={index} length={postsLength} navigation={navigation}/>
      }} 
      pagingEnabled
      horizontal
      showsHorizontalScrollIndicator={false}
    />
    }
  </View>
)};

const PostFooter = ({user, post, postID, postUser, navigation}) => (
  <View
    style={{
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: colors.light,
      paddingLeft: 10,
      paddingVertical: 10,
    }}
  >
    <PostIconH name={"cards-heart-outline"} size={30} user={user} postID={postID}/>
    <PostIconC name={"comment-outline"} size={30} style={{ marginLeft: 10 }} postUser={postUser} postID={postID} navigation={navigation}/>
  </View>
);

const PostIconH = ({ name, user, size, style, postID }) => {
  const [clicked, setClicked] = useState(false);
  //const [likeID, setLikeID] = useState('');
  const [enable, setEnable] = useState(true);
  //const [tLikes, setTLikes] = useState(postAllLikes);
  function setLike(){
    setEnable(false);
    firestore().collection('Likes').where('userID', '==', user.phoneNumber).where('postID', '==', postID).get().then((snapshot)=>{
      if(!snapshot.empty){
        snapshot.docs.map((snapDoc)=>{
          let id = snapDoc.id;
          firestore().collection('Likes').doc(id).delete()
          .then((res)=>{
            console.log("Like Deleted!", res);
          })
          setClicked(false);
          setEnable(true);
        })
      }else if(snapshot.empty){
        firestore().collection('Likes').doc().set({
          userID: user.phoneNumber,
          postID: postID,
        })
        .then((res)=>{
          setClicked(true);
          setEnable(true);
      })
    }
    })
  }
  // function setLike(){
  //   if(clicked == true){
  //      firestore().collection('Likes').doc(likeID).delete()
  //      .then((res)=>{
  //        console.log("Like Deleted!", res);
  //      })
  //     setClicked(false);
  //   }else if(clicked == false){
  //     firestore().collection('Likes').doc().set({
  //       userID: user.phoneNumber,
  //       postID: postID,
  //       })
  //     .then((res)=>{
  //       console.log("Like Added!",res);
  //       firestore().collection('Likes').where('userID', '==', user.phoneNumber).where('postID', '==', postID).get()
  //       .then((data)=>{
  //         if(!data._docs.length == '0'){
  //           let likesData = data._docs[0]._data;
  //           if(likesData.postID == postID){
  //             setLikeID(data._docs[0]._ref._documentPath._parts[1]);
  //             //setClicked(true);
  //           }
  //         }   
  //       })
  //     })
  //     setClicked(true);
  //   }
  // }
  useEffect(()=>{
    //console.log(user);
    firestore().collection('Likes').where('userID', '==', user.phoneNumber).where('postID', '==', postID).get()
    .then((snapshot)=>{
      if(!snapshot.empty){
        setClicked(true);
      }
    });
  },[]);
  return (
    <TouchableIcon
      name={clicked ? "cards-heart" : name}
      size={size}
      iconColor={clicked ? colors.danger : colors.background}
      style={style}
      onPress={() => (enable ? setLike() : "")}
    />
  );
};
const PostIconC = ({ name, size, style, postUser, postID, navigation }) => {
  const {commentsData, setCommentsData} = useCommentsSharing();
  function redirect(){
    setCommentsData({postID: postID, postUser: postUser});
    navigation.navigate("CommentsScreen");
  }
  return (
    <TouchableIcon
      name={name}
      size={size}
      iconColor={colors.background}
      style={style}
      onPress={() => (redirect())}
    />
  );
};

const PostLikes = ({ post, postID }) => {
  const [likes, setLikes] = useState('0');
  useEffect(()=>{
    firestore().collection('Likes').where('postID', '==', postID).onSnapshot((snapshot)=>{
        setLikes(snapshot.docs.length);
    })
  },[]);
return (
  <View style={{ flexDirection: "row", marginTop: 5 }}>
    <AppText style={{ fontWeight: "600" }}>
      {Platform.OS === "android"
        ? likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : likes.toLocaleString("en")}
    </AppText>
    <AppText> {likes > 1 ? 'likes' : 'like'}</AppText>
  </View>
);
};

const PostCaption = ({ post, userData}) => (
  <View style={{ marginTop: 5 }}>
    <AppText>
      <AppText style={{ fontWeight: "600" }}>{userData.title+" "+userData.firstName+" "+userData.lastName}</AppText>
      <AppText> {post.caption}</AppText>
    </AppText>
  </View>
);

const PostCommentsSection = ({ post, postUser, postID, user, CommentSection, navigation }) => {
  const [showComments, setShowComments] = useState(0);
  const [commentsArr, setCommentsArr] = useState([]);
  const {commentsData, setCommentsData} = useCommentsSharing();
  function redirect(){
    setCommentsData({postID: postID, postUser: postUser});
    navigation.navigate("CommentsScreen");
  }
  useEffect(() => {
    let pComments = [];
  //   firestore().collection('Comments').where('postID', '==', postID)
  // .get()
  // .then(querySnapshot => {
  //   //console.log(querySnapshot);
  //   querySnapshot.forEach(documentSnapshot => {
  //     //console.log(documentSnapshot._data);
  //     if(documentSnapshot._data.postID == postID && documentSnapshot._data.postID){
        
  //       let ds = documentSnapshot._data;
  //       pComments.push(ds);
  //     }
  //   });

    function onResult(QuerySnapshot) {
      //console.log('I got called!');
      //console.log(QuerySnapshot.docs);
      let count = 0;
      QuerySnapshot.docs.map((snapshot)=>{
        count++;
        //console.log(snapshot.data());
        let data = snapshot.data();
        let id = snapshot.id;
        pComments.push({id: id,postID: data.postID,comment: data.comment,name: data.user,time: (data.time? data.time : "few days ago")})
        if(!pComments.length == '0' && count == QuerySnapshot.docs.length){
          //console.log(pComments);
          setCommentsArr(pComments);
        }
      })
      // if(!QuerySnapshot._changes.length == '0'){
      //   QuerySnapshot._changes.map((data, index)=>{
      //     pComments.push(data._nativeData.doc.data);
      //   })
      // }
    // if(!QuerySnapshot._changes.length == '0'){
    //   console.log(QuerySnapshot._changes.length);
    //       setLikesCount(QuerySnapshot._changes.length);
    //     }else{
    //       setLikesCount(QuerySnapshot._changes.length);
    //     }
    }
  
    function onError(error) {
      console.error(error);
    }

    firestore().collection('Comments').where('postID', '==', postID).onSnapshot(onResult, onError);

  // });
  // function onResult(QuerySnapshot) {
  //   QuerySnapshot.forEach(documentSnapshot => {
  //     //console.log(documentSnapshot._data);
  //     if(documentSnapshot._data.postID == postID && documentSnapshot._data.postID){
        
  //       let ds = documentSnapshot._data;
  //       pComments.push(ds);
  //     }
  //   });
  //   if(!pComments.length == '0'){
  //     setCommentsArr(pComments);
  //   }
  // }
  
  // function onError(error) {
  //   console.error(error);
  // }
  
  // firestore().collection('Comments').onSnapshot(onResult, onError);
  }, []);

      return (
        <View style={{ marginTop: 5 }}>
          {!!commentsArr.length && (
            <View>
              {commentsArr.length > 1 ? (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      //showComments ?
                        redirect()
                       //: setShowComments(1);
                    }}
                  >
                    <AppText style={{ color: "white", textAlign:"left" }}>
                      {/* View all {commentsArr.length} comments */}
                      View all comments
                    </AppText>
                  </TouchableOpacity>
                  {showComments ? (
                    <PostComments post={commentsArr} length={commentsArr.length} />
                  ) : (
                    <PostSingleComment post={commentsArr} />
                  )}
                </>
              ) : (
                <>
                <TouchableOpacity
                    onPress={() => {
                        redirect()
                    }}
                  >
                    <AppText style={{ color: "white", textAlign:"left" }}>
                      {/* View all {commentsArr.length} comments */}
                      View all comments
                    </AppText>
                  </TouchableOpacity>
                  {showComments ? (
                    <PostComments post={commentsArr} length={commentsArr.length} />
                  ) : (
                    <PostSingleComment post={commentsArr} />
                  )}
                  {/* <PostSingleComment  post={commentsArr} /> */}
                    {/* <AppText style={{ color: "gray" }}>View 1 comment</AppText> */}
                </>
              )}
            </View>
          )}
          {CommentSection && (
            <Form
              initialValues={{ comment: "" }}
              validationSchema={Yup.object().shape({
                comment: Yup.string(),
              })}
              onSubmit={(values, { resetForm }) => {
                //console.log(user);
                //console.log(postID,postUser);
                const commentStore = firestore().collection('Comments').doc()
                commentStore.set({
                  postID: postID,
                  user: (user.title+" "+user.firstName).toString(),
                  comment: values.comment,
                  time: firestore.FieldValue.serverTimestamp()
                })
                .then((sent)=>{
                  //console.log(sent);
                })
                
                // setCommentsArr([
                //   ...commentsArr,
                //   { comment: values.comment, user: (user.title+" "+user.firstName).toString() },
                // ]);
                resetForm();
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
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
                    name={"share"}
                    size={25} color={colors.background}
                  />}
                  style={{ padding: 0,height: 50, width: 60, backgroundColor: "transparent", position: "absolute", right: -5, zIndex: 1, fontSize: 12}}
                />
              </View>
            </Form>
          )}
        </View>
      );
};

// function commentChecker(comment){
//   if(comment){
//     if(comment.comment){
//       return (comment.comment).length > 1 ? comment.comment[1] : comment.comment;
//     }else{
//       return comment[0].comment[1];
//     }
//   }else{
//     return 'No Comments';
//   }
// }
// function commentUser(comment){
//   //console.log(comment[0] ? comment[0] : "no time");
//   if(comment){
//     if(comment.user){
//       return (comment.user).length > 1 ? comment.user[1] : comment.user;
//     }else{
//       return comment[0].user[1];
//     }
    
//   }else{
//     return '';
//   }
// }

const PostComments = ({ post, length }) => {
  //console.log(post, "pOsts data");
  return(
  <>
    {length<=5 ? post.map((comment, index) => (
      <View key={index} style={{alignSelf: 'flex-start',
      paddingVertical:5,
      //paddingHorizontal:10
      }}>
        <View style={{backgroundColor:"rgba(220,220,220,0.2)",borderRadius:30,paddingVertical:15,paddingLeft: 5, paddingRight: 20,}}>
          <Text style={{ fontSize: 18, fontWeight: "700",
          marginLeft: 15,
          color: "white",
          width:"auto"
          }}>{comment.name+"  "}</Text>
          <Text style={{ fontSize: 14, fontWeight: "600",
          marginLeft: 15,
          color: "white",
          width:"auto"
          }}>{comment.comment}</Text>
        </View>
      <Text style={{marginLeft: 20,color:"white"}}>{comment.time == "few days ago" ? comment.time : moment.utc(console.log(post[0].time.toDate())).local().startOf('seconds').fromNow()}</Text>
      </View>
      // <View key={index} style={{ flexDirection: "row", marginTop: 5 }}>
      //   <AppText style={{ fontWeight: "600" }}>{commentUser(comment)}</AppText>
      //   <AppText> {commentChecker(comment)}
      //   </AppText>
      // </View>
    ))
  :
  post.slice(0,5).map((comment, index) => (
    <View key={index} style={{alignSelf: 'flex-start',
    paddingVertical:5,
    //paddingHorizontal:10
    }}>
      <View style={{backgroundColor:"rgba(220,220,220,0.2)",borderRadius:30,paddingVertical:15,paddingLeft: 5, paddingRight: 20,}}>
        <Text style={{ fontSize: 18, fontWeight: "700",
        marginLeft: 15,
        color: "white",
        width:"auto"
        }}>{comment.name+"  "}</Text>
        <Text style={{ fontSize: 14, fontWeight: "600",
        marginLeft: 15,
        color: "white",
        width:"auto"
        }}>{comment.comment}</Text>
      </View>
    <Text style={{marginLeft: 20,color:"white"}}>{comment.time == "few days ago" ? comment.time : moment.utc(console.log(post[0].time.toDate())).local().startOf('seconds').fromNow()}</Text>
    </View>
  ))}
  </>
)};

const PostSingleComment = ({ post }) => (
  <View style={{alignSelf: 'flex-start',
      paddingVertical:5,
      //paddingHorizontal:10
      }}>
        <View style={{backgroundColor:"rgba(220,220,220,0.2)",borderRadius:30,paddingVertical:15,paddingLeft: 5, paddingRight: 20,}}>
          <Text style={{ fontSize: 18, fontWeight: "700",
          marginLeft: 15,
          color: "white",
          width:"auto"
          }}>{post[0].name+"  "}</Text>
          <Text style={{ fontSize: 14, fontWeight: "600",
          marginLeft: 15,
          color: "white",
          width:"auto"
          }}>{post[0].comment}</Text>
        </View>
      <Text style={{marginLeft: 20,color:"white"}}>{post[0].time == "few days ago" ? post[0].time : moment.utc(post[0].time).local().startOf('seconds').fromNow()}</Text>
      </View>
  // <View style={{ flexDirection: "row", marginTop: 5 }}>
  //   <AppText style={{ fontWeight: "600" }}>{post[0].name}</AppText>
  //   <AppText> {post[0].comment}</AppText>
  // </View>
);

// const AddComment = ({commentsArr})=>{
//   return <>
//     {commentsArr}
//   </>;
// }

const Post = ({
  post,
  postID,
  user,
  postUser,
  navigation,
  withHeader = true,
  withImage = true,
  withFooter = true,
  withLikes = true,
  withComments = true,
  withCommentSection = true,
  withDeleteButton = false,
  deletePost,
}) => {
  const [userData, setUserData] = useState('');
  let btnAccess = withDeleteButton ? withDeleteButton : user.isAdmin;
  //console.log(post);
  
  //const {user, setUser} = useUserAuth();
  
  //const [userWPostID, setUserWPostID] = useState([]);
  useEffect(()=>{
    //console.log(post.id);
    firestore().collection('Users').doc(post.userID).get()
    .then((data)=>{
      let mainData = data._data;
      //console.log(mainData);
      setUserData(mainData);
    })

    // firestore().collection('Likes').where('postID','==',postID).get()
    // .then((data)=>{
    //   if(!data._docs.length == '0'){
    //     setLikesCount(data._changes.length);
    //   }
      
    // })
    // firestore().collection('Comments').doc().get()
    // .then((comments)=>{
    //   if(comments._data){
    //     console.log(comments);
    //   }
    // })
  },[])
  return (
    <View style={{ marginBottom: 30 }}>
      <Divider width={1} orientation="vertical" />
      {withHeader && (
        <PostHeader userData={userData}
          LoginnedUser={user}
          post={post}
          DeleteButton={btnAccess}
          deletePost={deletePost}
          postID={postID} postUser={postUser}
          navigation={navigation}
        />
      )}
      {withImage && <PostContent post={post} navigation={navigation} />}
      {withFooter && <PostFooter user={user} post={post} postID={postID} postUser={postUser} navigation={navigation}/>}
      <View style={{ marginHorizontal: 10, marginTop: 5 }}>
        {withLikes && <PostLikes post={post} postID={postID} />}
        {withComments && <PostCaption userData={userData} post={post} />}
        <PostCommentsSection user={user} post={post} postID={postID} postUser={postUser} CommentSection={withCommentSection} navigation={navigation} />
      </View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  head_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    backgroundColor: colors.light,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
    zIndex: 2,
  },
  page:{
    position: "absolute",
    zIndex: 2,
    backgroundColor: "black",
    color: "white",
    fontWeight: "900",
    fontSize: 15,
    padding: 10,
    alignSelf: "flex-end",
    borderRadius: 100,
    margin: 10,
  },
  textPost:{
    fontWeight: "500",
  },
  head_image: {
    width: 35,
    height: 35,
    resizeMode: "cover",
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 1.6,
    borderColor: "#FF8501",
  },
  head_image_new: {
    width: 45,
    height: 45,
    resizeMode: "cover",
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 1.6,
    borderColor: "#FF8501",
  },
  head_title: {
    fontSize: 14,
    marginLeft: 5,
    fontWeight: "700",
    color: colors.bottom,
  },
  head_title_new: {
    fontSize: 18,
    marginLeft: 5,
    fontWeight: "700",
    color: colors.bottom,
  },
  duration: {
    color: "#FFF",
    marginLeft: 5,
  },
  mainButton: {
    marginRight: 15,
  },
  controls: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: 48,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    zIndex: 3,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 40,
    paddingVertical: 6,
    paddingHorizontal:10,
    elevation: 2,
    position: "absolute",
    top: -20,
    right: -20,
  },
  buttonNew: {
    borderRadius: 40,
    paddingVertical: 8,
    paddingHorizontal:15,
    elevation: 2,
    marginTop: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    //backgroundColor: 'grey',
  },
  buttonClose_New: {
    //backgroundColor: '#2196F3',
    backgroundColor: 'red',
  },
  textStyle: {
    color: 'white',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 18,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
    backgroundColor: '#2196F3',
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 10,
  },
});
