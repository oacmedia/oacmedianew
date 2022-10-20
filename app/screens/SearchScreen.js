import React, { useState, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Screen from "../components/Screen";
import List from "../components/search/List";
import SearchBar from "../components/search/SearchBar";
import colors from "../config/colors";
import BottomTabs from "../components/home/BottomTabs";

const users = [
  {
    id: 1,
    name: "Waleed",
    image:
      "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg",
  },
  {
    id: 2,
    name: "Ukasha",
    image:
      "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg",
  },
  {
    id: 3,
    name: "Babar",
    image:
      "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg",
  },
];

const SearchScreen = ({ navigation }) => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [fakeData, setFakeData] = useState();

  useEffect(() => {
    setFakeData(users);
  }, []);

  return (
    <Screen style={styles.root}>
      <Text style={styles.title}>Search Friends</Text>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
        setClicked={setClicked}
      />

      <List
        searchPhrase={searchPhrase}
        data={fakeData}
        setClicked={setClicked}
      />
      <BottomTabs navigation={navigation} />
    </Screen>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  root: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    width: "100%",
    marginTop: 20,
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: "10%",
    color: colors.white,
  },
});
