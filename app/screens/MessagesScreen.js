import React, { useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";

const initialMessages = [
  {
    id: 1,
    title: "Jay Parker",
    description: "Hey! Is this item still available?",
    image:
      "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg",
  },
  {
    id: 2,
    title: "Natalia",
    description:
      "I'm interested in this item. When will you be able to post it?",
    image:
      "https://www.unigreet.com/wp-content/uploads/2020/04/Smiley-816x1024.jpg",
  },
];

function MessagesScreen({ navigation }) {
  const [messages, setMessages] = useState(initialMessages);
  const [refreshing, setRefreshing] = useState(false);

  const handleDelete = (message) => {
    // Delete the message from messages
    setMessages(messages.filter((m) => m.id !== message.id));
  };

  return (
    <Screen>
      <FlatList
        data={messages}
        keyExtractor={(message) => message.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subTitle={item.description}
            image={item.image}
            onPress={() => {
              navigation.push("ChatScreen");
              console.log("Message selected", item);
            }}
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
              description:
                "I'm interested in this item. When will you be able to post it?",
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

export default MessagesScreen;
