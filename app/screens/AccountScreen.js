import React, {useEffect} from "react";
import { FlatList, StyleSheet, View } from "react-native";

import AccountIcon from "../components/AccountIcon";
import BottomTabs from "../components/home/BottomTabs";
import ListItem from "../components/lists/ListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import Screen from "../components/Screen";
import colors from "../config/colors";
import storage from "../components/storage/storage";
import { useUserAuth } from "../context/UserAuthContext";
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import RNRestart from 'react-native-restart';

const menuItems = [
  {
    screen: "ProfileChange",
    title: "Update Profile Picture",
    icon: {
      name: "camera",
      backgroundColor: colors.green,
    },
  },
  {
    screen: "PostsScreen",
    title: "My Posts",
    icon: {
      name: "post",
      backgroundColor: colors.primary,
    },
  },
  {
    screen: "RequestsScreen",
    title: "Friend Requests",
    icon: {
      name: "account-clock",
      backgroundColor: colors.secondary,
    },
  },
  {
    screen: "FriendsScreen",
    title: "My Friends",
    icon: {
      name: "account-group",
      backgroundColor: colors.secondary,
    },
  },
];
function AccountScreen({ navigation }) {
  const {user, setUser} = useUserAuth();

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={user.title+" "+user.firstName+" "+user.lastName}
          subTitle={user.phoneNumber}
          image={
            user.profile
          }
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => navigation.navigate(item.screen)}
              title={item.title}
              IconComponent={
                <AccountIcon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
            />
          )}
        />
      </View>
      <ListItem
        title="Log Out"
        IconComponent={<AccountIcon name="logout" backgroundColor="grey" />}
        onPress={() => {
          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              auth()
              .signOut()
              .then(() => {
                setUser([]);
                storage.remove({
                  key: 'loginState'
                });
                //navigation.navigate("LoginScreen");
                RNRestart.Restart();
              }).catch((error)=>{
                console.log(error);
              });
            } else {
              setUser([]);
              storage.remove({
                key: 'loginState'
              });
              //navigation.navigate("LoginScreen");
              RNRestart.Restart();
            }
                
        })
      }}
      />
      <BottomTabs navigation={navigation} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  container: {
    //marginVertical: 20,
  },
});
export default AccountScreen;
