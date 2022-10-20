import React from "react";
import { TouchableHighlight } from "react-native";
import { StyleSheet, View, FlatList, SafeAreaView, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../../config/colors";
import TouchableIcon from "../TouchableIcon";
import Text from "../Text";

// definition of the Item, which will be rendered in the FlatList
const Item = ({ name, image }) => (
  <View style={styles.container}>
    {image && <Image style={styles.image} source={{ uri: image }} />}
    <View style={styles.detailsContainer}>
      <Text style={styles.title} numberOfLines={1}>
        {name}
      </Text>
    </View>
    <TouchableIcon name={"account-plus"} iconColor={colors.black} />
  </View>
);

// the filter
const List = ({ searchPhrase, data }) => {
  const renderItem = ({ item }) => {
    // when no input, show none
    if (searchPhrase === "") {
      return;
    }
    // filter of the Name
    if (
      item.name
        .toUpperCase()
        .includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))
    ) {
      return <Item key={item.id} name={item.name} image={item.image} />;
    }
  };

  return (
    <SafeAreaView style={styles.list__container}>
      <View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default List;

const styles = StyleSheet.create({
  list__container: {
    margin: 10,
    height: "85%",
    width: "80%",
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    borderRadius: 50,
    padding: 15,
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderBottomWidth: 2,
  },
  detailsContainer: {
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 35,
  },

  title: {
    fontSize: 25,
    fontWeight: "500",
    color: colors.black,
  },
});
