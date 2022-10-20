import { ScrollView, StyleSheet } from "react-native";
import React from "react";

import BottomTabs from "../components/home/BottomTabs";
import Header from "../components/home/Header";
import Screen from "../components/Screen";
import Post from "../components/home/Post";
import { POSTS } from "../data/posts";

const HomeScreen = ({ navigation }) => {
  return (
    <Screen>
      <Header navigation={navigation} />
      <ScrollView style={{ marginBottom: 40 }}>
        {POSTS.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </ScrollView>
      <BottomTabs navigation={navigation} />
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
