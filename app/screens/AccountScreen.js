import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import AccountIcon from "../components/AccountIcon";
import BottomTabs from "../components/home/BottomTabs";
import ListItem from "../components/lists/ListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import Screen from "../components/Screen";
import colors from "../config/colors";
const menuItems = [
  {
    screen: "PostsScreen",
    title: "My Posts",
    icon: {
      name: "post",
      backgroundColor: colors.primary,
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
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title="Ukasha Tariq Javed"
          subTitle="ukashatariq1@gmail.com"
          image={
            "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg"
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
              onPress={() => navigation.push(item.screen)}
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
        onPress={() => navigation.push("LoginScreen")}
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
    marginVertical: 20,
  },
});
export default AccountScreen;
