import React, { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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


const PostHeader = ({ post, postUser, postID, DeleteButton, LoginnedUser, userData }) => {
  
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
    firestore().collection('Posts').doc(postID).delete()
    .then(()=>{
      console.log("Deleted!");
    })

    //console.log("Delete Called!", postID);
  }
  return(
  <View style={styles.head_container}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image source={{ uri: userData.profile }} style={styles.head_image} />
      <AppText style={styles.head_title}>{userData.title+" "+userData.firstName+" "+userData.lastName}</AppText>
    </View>
    <TouchableOpacity hitSlop={10}>
      {DeleteButton ? (
        <TouchableIcon name={"delete"} iconColor={colors.danger} size={25} onPress={()=>{deleteCalled()}} />
      ) : (
        <AppText style={{ fontWeight: "900", color: colors.bottom }}>
          {/* ... */}
        </AppText>
      )}
    </TouchableOpacity>
  </View>)
};

const PostImage = ({ post }) => (
  <View style={{ width: "100%", height: 450 }}>
    <Image
      source={{ uri: post.imageURL }}
      style={{ height: "100%", resizeMode: "cover" }}
    />
  </View>
);

const PostFooter = ({user, post, postID}) => (
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
    <PostIconC name={"comment-outline"} size={30} style={{ marginLeft: 10 }} />
  </View>
);

const PostIconH = ({ name, user, size, style, postID }) => {
  const [clicked, setClicked] = useState(false);
  const [likeID, setLikeID] = useState('');
  //const [tLikes, setTLikes] = useState(postAllLikes);
  function setLike(){
    if(clicked == true){
       firestore().collection('Likes').doc(likeID).delete()
       .then((res)=>{
         console.log("Like Deleted!", res);
       })
      setClicked(false);
    }else if(clicked == false){
      firestore().collection('Likes').doc().set({
        userID: user.phoneNumber,
        postID: postID,
        })
      .then((res)=>{
        console.log("Like Added!",res);
        firestore().collection('Likes').where('userID', '==', user.phoneNumber).where('postID', '==', postID).get()
        .then((data)=>{
          if(!data._docs.length == '0'){
            let likesData = data._docs[0]._data;
            if(likesData.postID == postID){
              setLikeID(data._docs[0]._ref._documentPath._parts[1]);
              //setClicked(true);
            }
          }   
        })
      })
      setClicked(true);
    }
  }
  useEffect(()=>{
    //console.log(user);
    firestore().collection('Likes').where('userID', '==', user.phoneNumber).where('postID', '==', postID).get()
    .then((data)=>{
      if(!data._docs.length == '0'){
        let likesData = data._docs[0]._data;
      if(likesData.postID == postID){
        setLikeID(data._docs[0]._ref._documentPath._parts[1]);
        setClicked(true);
      }
    }
    })
  },[]);
  return (
    <TouchableIcon
      name={clicked ? "cards-heart" : name}
      size={size}
      iconColor={clicked ? colors.danger : colors.background}
      style={style}
      onPress={() => (setLike())}
    />
  );
};
const PostIconC = ({ name, size, style }) => {
  return (
    <TouchableIcon
      name={name}
      size={size}
      iconColor={colors.background}
      style={style}
    />
  );
};

const PostLikes = ({ post, postID }) => {
  // let likes = 0;
  // if(postAllLikes){
  //   likes = postAllLikes;
  // }else{
  //   likes = postAllLikes;
  // }
  const [likes, setLikes] = useState('0');
  useEffect(()=>{
    function onResult(QuerySnapshot) {
      //console.log('Starts From Here!', QuerySnapshot._docs.length);
    //console.log(QuerySnapshot._changes.length);
      if(!QuerySnapshot._changes.length == '0'){
        //console.log(QuerySnapshot._changes.length);
        setLikes(QuerySnapshot._docs.length);
      }else{
        setLikes(QuerySnapshot._docs.length);
      }
    }
  
    function onError(error) {
      console.error(error);
    }
  
    firestore().collection('Likes').where('postID','==',postID).onSnapshot(onResult, onError);
    //let likes = 0;
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

const PostCommentsSection = ({ post, postUser, postID, user, CommentSection }) => {
  const [showComments, setShowComments] = useState(0);
  const [commentsArr, setCommentsArr] = useState([]);
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
      if(!QuerySnapshot._changes.length == '0'){
        QuerySnapshot._changes.map((data, index)=>{
          pComments.push(data._nativeData.doc.data);
        })
      }
      if(!pComments.length == '0'){
        setCommentsArr(pComments);
      }
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
                      setShowComments(1);
                    }}
                  >
                    <AppText style={{ color: "gray" }}>
                      View all {commentsArr.length} comments
                    </AppText>
                  </TouchableOpacity>
                  {showComments ? (
                    <PostComments post={commentsArr} />
                  ) : (
                    <PostSingleComment post={commentsArr} />
                  )}
                </>
              ) : (
                <>
                  <PostSingleComment  post={commentsArr} />
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
                  width="70%"
                />
                <SubmitButton
                  title="POST"
                  style={{ width: "25%", backgroundColor: colors.primary }}
                />
              </View>
            </Form>
          )}
        </View>
      );
};

function commentChecker(comment){
  if(comment){
    if(comment.comment){
      return (comment.comment).length > 1 ? comment.comment[1] : comment.comment;
    }else{
      return comment[0].comment[1];
    }
  }else{
    return 'No Comments';
  }
}
function commentUser(comment){
  if(comment){
    if(comment.user){
      return (comment.user).length > 1 ? comment.user[1] : comment.user;
    }else{
      return comment[0].user[1];
    }
    
  }else{
    return '';
  }
}

const PostComments = ({ post }) => {
  //console.log(post, "pOsts data");
  return(
  <>
    {post.map((comment, index) => (
      <View key={index} style={{ flexDirection: "row", marginTop: 5 }}>
        <AppText style={{ fontWeight: "600" }}>{commentUser(comment)}</AppText>
        <AppText> {commentChecker(comment)}
        </AppText>
      </View>
    ))}
  </>
)};

const PostSingleComment = ({ post }) => (
  
  <View style={{ flexDirection: "row", marginTop: 5 }}>
    <AppText style={{ fontWeight: "600" }}>{commentUser(post)}</AppText>
    <AppText> {commentChecker(post)}</AppText>
  </View>
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
          DeleteButton={withDeleteButton}
          deletePost={deletePost}
          postID={postID} postUser={postUser}
        />
      )}
      {withImage && <PostImage post={post} />}
      {withFooter && <PostFooter user={user} post={post} postID={postID} />}
      <View style={{ marginHorizontal: 10, marginTop: 5 }}>
        {withLikes && <PostLikes post={post} postID={postID} />}
        {withComments && <PostCaption userData={userData} post={post} />}
        <PostCommentsSection user={user} post={post} postID={postID} postUser={postUser} CommentSection={withCommentSection} />
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
  head_image: {
    width: 35,
    height: 35,
    resizeMode: "contain",
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
});
