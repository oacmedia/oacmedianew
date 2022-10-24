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
import { useUserAuth } from "../../context/UserAuthContext";
import { isEmptyArray } from "formik";


const PostHeader = ({ post, DeleteButton, userData }) => {
  return(
  <View style={styles.head_container}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image source={{ uri: userData.profile }} style={styles.head_image} />
      <AppText style={styles.head_title}>{userData.title+" "+userData.firstName+" "+userData.lastName}</AppText>
    </View>
    <TouchableOpacity hitSlop={10}>
      {DeleteButton ? (
        <TouchableIcon name={"delete"} iconColor={colors.danger} size={25} />
      ) : (
        <AppText style={{ fontWeight: "900", color: colors.bottom }}>
          ...
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

const PostFooter = () => (
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
    <PostIconH name={"cards-heart-outline"} size={30} />
    <PostIconC name={"comment-outline"} size={30} style={{ marginLeft: 10 }} />
  </View>
);

const PostIconH = ({ name, size, style }) => {
  const [clicked, setClicked] = useState(false);
  return (
    <TouchableIcon
      name={clicked ? "cards-heart" : name}
      size={size}
      iconColor={clicked ? colors.danger : colors.background}
      style={style}
      onPress={() => (clicked ? setClicked(false) : setClicked(true))}
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

const likes = "3232";

const PostLikes = ({ post }) => (
  <View style={{ flexDirection: "row", marginTop: 5 }}>
    <AppText style={{ fontWeight: "600" }}>
      {Platform.OS === "android"
        ? likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : likes.toLocaleString("en")}
    </AppText>
    <AppText> likes</AppText>
  </View>
);

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
    firestore().collection('Comments').where('postID', '==', postID)
  .get()
  .then(querySnapshot => {
    //console.log(querySnapshot);
    querySnapshot.forEach(documentSnapshot => {
      //console.log(documentSnapshot._data);
      if(documentSnapshot._data.postID == postID && documentSnapshot._data.postID){
        
        let ds = documentSnapshot._data;
        pComments.push(ds);
      }
    });
    if(!pComments.length == '0'){
      setCommentsArr(pComments);
    }
  });
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
                
                setCommentsArr([
                  ...commentsArr,
                  { comment: values.comment, user: (user.title+" "+user.firstName).toString() },
                ]);
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
      return comment.comment;
    }else{
      return comment[0].comment;
    }
  }else{
    return 'No Comments';
  }
}
function commentUser(comment){
  if(comment){
    if(comment.user){
      return comment.user;
    }else{
      return comment[0].user;
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

const AddComment = ({commentsArr})=>{
  return <>
    {commentsArr}
  </>;
}

const Post = ({
  post,
  postID,
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
  const {user, setUser} = useUserAuth();
  
  //const [userWPostID, setUserWPostID] = useState([]);
  useEffect(()=>{
    //console.log(post.id);
    firestore().collection('Users').doc(post.userID).get()
    .then((data)=>{
      let mainData = data._data;
      console.log(mainData);
      setUserData(mainData);
    })
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
          post={post}
          DeleteButton={withDeleteButton}
          deletePost={deletePost}
        />
      )}
      {withImage && <PostImage post={post} />}
      {withFooter && <PostFooter post={post} />}
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
