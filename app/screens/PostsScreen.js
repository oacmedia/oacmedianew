import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Post from "../components/home/Post";

import Screen from "../components/Screen";
import AppText from "../components/Text";
import { POSTS } from "../data/posts";

function PostsScreen({ navigation }) {
  return (
    <Screen>
      <View style={{ alignSelf: "center", marginVertical: 20 }}>
        <AppText style={{ fontSize: 25, fontWeight: "700" }}>Posts</AppText>
      </View>
      <ScrollView style={{ marginBottom: 40 }}>
        {POSTS.map((post, index) => (
          <Post
            post={post}
            key={index}
            withFooter={false}
            withCommentSection={false}
            withDeleteButton={true}
          />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default PostsScreen;
