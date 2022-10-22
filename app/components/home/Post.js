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

const PostHeader = ({ post, DeleteButton, userData }) => {
  return(
  <View style={styles.head_container}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image source={{ uri: post.imageURL }} style={styles.head_image} />
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

const PostCommentsSection = ({ post, CommentSection }) => {
  const [showComments, setShowComments] = useState(0);
  const [commentsArr, setCommentsArr] = useState([]);
  useEffect(() => {
    if(post.comments){
      setCommentsArr(post.comments);
    }else{
      setCommentsArr([]);
    }
    
    //console.log(commentsArr);
  }, []);
  return (
    <View style={{ marginTop: 5 }}>
      {commentsArr.length != 0 && (
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
              <AppText style={{ color: "gray" }}>View 1 comment</AppText>
              <PostSingleComment post={commentsArr} />
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
            setCommentsArr([
              //...commentsArr,
              { comment: values.comment, user: "Anonymous" },
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
    return comment.comment;
  }else{
    return 'No Comments';
  }
}
function commentUser(comment, user){
  if(comment){
    return comment.user;
  }else{
    return '';
  }
}

const PostComments = ({ post }) => (
  <>
    {post.map((comment, index) => (
      <View key={index} style={{ flexDirection: "row", marginTop: 5 }}>
        <AppText style={{ fontWeight: "600" }}>{commentUser(comment)}</AppText>
        <AppText> {commentChecker(comment)}
        </AppText>
      </View>
    ))}
  </>
);

const PostSingleComment = ({ post }) => (
  <View style={{ flexDirection: "row", marginTop: 5 }}>
    <AppText style={{ fontWeight: "600" }}>{commentUser(comment)}</AppText>
    <AppText> {commentChecker(comment)}</AppText>
  </View>
);

const Post = ({
  post,
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
  useEffect(()=>{
    firestore().collection('Users').doc(post.userID).get()
    .then((data)=>{
      let mainData = data._data;
      console.log(mainData);
      setUserData(mainData);
    })
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
        {withLikes && <PostLikes post={post} />}
        {withComments && <PostCaption userData={userData} post={post} />}
        <PostCommentsSection post={post} CommentSection={withCommentSection} />
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
