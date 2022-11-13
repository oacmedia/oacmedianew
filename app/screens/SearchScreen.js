import React, { useState, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Screen from "../components/Screen";
import List from "../components/search/List";
import SearchBar from "../components/search/SearchBar";
import colors from "../config/colors";
import BottomTabs from "../components/home/BottomTabs";
import { useUserAuth } from "../context/UserAuthContext";
import firestore from '@react-native-firebase/firestore';


const SearchScreen = ({ navigation }) => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const {user, setUser} = useUserAuth();
  const [usersList, setUsersList] = useState([]);
  const array = [];
  useEffect(() => {
    firestore().collection('Users').where("id","!=",user.id).get().then((snapshot)=>{
      snapshot.docs.map((user)=>{
        let data = user.data();
        array.push(data);
      })
      setUsersList(array);
    })
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
        data={usersList}
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
