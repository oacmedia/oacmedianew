import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import AppText from "../components/Text";

const initialMessages = [
  {
    id: 1,
    title: "Jay Parker",
    image:
      "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg",
  },
  {
    id: 2,
    title: "Natalia",
    image:
      "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg",
  },
  {
    id: 3,
    title: "Ukasha",
    image:
      "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg",
  },
  {
    id: 4,
    title: "Charles",
    image:
      "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg",
  },
];

function FriendsScreen({ navigation }) {
  const [messages, setMessages] = useState(initialMessages);
  const [refreshing, setRefreshing] = useState(false);

  const handleDelete = (message) => {
    // Delete the message from messages
    setMessages(messages.filter((m) => m.id !== message.id));
  };

  return (
    <Screen>
      <View style={{ alignSelf: "center", marginVertical: 20 }}>
        <AppText style={{ fontSize: 25, fontWeight: "700" }}>Friends</AppText>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(message) => message.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            image={item.image}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
        refreshing={refreshing}
        onRefresh={() => {
          setMessages([
            {
              id: 2,
              title: "Natalia",
              image:
                "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg",
            },
          ]);
        }}
      />
      <BottomTabs navigation={navigation} />
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default FriendsScreen;
