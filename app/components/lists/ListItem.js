import React from "react";
import { View, StyleSheet, Image, TouchableHighlight } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

import Text from "../Text";
import colors from "../../config/colors";

function ListItem({
  title,
  subTitle,
  image,
  IconComponent,
  onPress,
  notification,
  message,
  comment,
  renderRightActions,
}) {
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableHighlight underlayColor={colors.light} onPress={onPress}>
        <View style={styles.container}>
          {IconComponent}
          {image && <Image style={styles.image} source={{ uri: image }} />}
          <View style={styles.detailsContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subTitle && (
              <Text style={styles.subTitle} numberOfLines={2}>
                {subTitle}
              </Text>
            )}
            {comment && (
              <Text style={styles.commentStyle} numberOfLines={1}>
                {"Commented: "+'"'+comment+'"'+" 9 Jan"}
              </Text>
            )}
            {message && (
              <Text style={styles.msgStyle} numberOfLines={1}>
                {message == 'Sent a Photo'? message : 'Sent you a message: '+'"'+message+'"'}
              </Text>
            )}
            {notification>0 && (
              <Text style={styles.notfStyle} numberOfLines={1}>
                {notification>99?"99+":notification}
              </Text>
            )}
          </View>
          {/* <View>
            {notification && (<Text>{notification}</Text>)}
          </View> */}
            {renderRightActions && <MaterialCommunityIcons
              color={colors.medium}
              name="chevron-left"
              size={25}
            />}
        </View>
      </TouchableHighlight>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    backgroundColor: colors.white,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 35,
  },
  subTitle: {
    color: colors.medium,
  },
  notfStyle: {
    color: "white",
    position: "absolute",
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: "red",
    fontSize: 18,
    borderRadius: 48,
    right: 10,
  },
  msgStyle: {
    fontSize: 18,
    color: colors.green,
    fontWeight: "700",
  },
  commentStyle: {
    fontSize: 18,
    color: colors.green,
    fontWeight: "700",
  },
  title: {
    fontWeight: "500",
    color: colors.black,
  },
});

export default ListItem;
