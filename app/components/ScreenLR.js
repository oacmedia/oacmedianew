import React from "react";
import Constants from "expo-constants";
import { ImageBackground, StyleSheet, SafeAreaView, View } from "react-native";
import colors from "../config/colors";

function Screen({ children, style }) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <ImageBackground source={require('../../assets/bg_login.jpg')} resizeMode="cover" style={styles.image}>
        <View style={[styles.view, style]}>{children}</View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    //paddingTop: Constants.statusBarHeight,
    flex: 1,
    //backgroundColor: colors.background,
  },
  view: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Screen;
