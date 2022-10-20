import { Image, StyleSheet, View } from "react-native";
import React from "react";
import Screen from "../components/Screen";
import Text from "../components/Text";
import TouchableIcon from "../components/TouchableIcon";
import TextInput from "../components/TextInput";
import colors from "../config/colors";
import AppText from "../components/Text";
import { POSTS } from "../data/posts";

const ChatScreen = ({ navigation }) => {
  const handleCall = () => {
    navigation.push("CallScreen");
  };
  return (
    <Screen>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableIcon
            name="arrow-left"
            size={25}
            onPress={() => {
              navigation.push("MessagesScreen");
            }}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: POSTS[0].profile_picture }}
              style={styles.head_image}
            />
            <AppText style={[styles.head_title, {}]}>{POSTS[0].user}</AppText>
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
