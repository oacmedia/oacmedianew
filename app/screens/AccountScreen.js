import React, {useEffect, useState} from "react";
import { FlatList, StyleSheet, View, Modal, Pressable, Text } from "react-native";

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
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

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
    screen: "ChangeName",
    title: "Change Your Name",
    icon: {
      name: "text",
      backgroundColor: "orange",
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
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Screen style={styles.screen}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          //Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}
        >
          <View style={styles.modalView}
          >
            {/* <Text style={styles.modalText_New}>Deleting Account</Text> */}
            <Text style={styles.modalText}
            >{"Your delete account request will be processed within 2 weeks.\nYou can re-login to cancel delete request!"}</Text>
            <Pressable
               style={[styles.button, styles.buttonClose_New]}
              onPress={() => {
                setModalVisible(!modalVisible)
                firestore().collection('DeleteAccount').doc(user.id).set({
                  time: firestore.FieldValue.serverTimestamp(),
                  loggined: false,
                  user: user.id,
                }).then(()=>{
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
                })
                }}>
                {/* <Icon
                    name={"close"}
                    size={24} color={colors.white}
                  /> */}
              <Text style={styles.textStyle}
              >Delete Account</Text>
            </Pressable>
            <Pressable
               style={[styles.buttonNew, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
                {/* <Icon
                    name={"close"}
                    size={24} color={colors.white}
                  /> */}
              <Text style={styles.textStyle}
              >Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
        title="Delete Account"
        IconComponent={<AccountIcon name="delete" backgroundColor="red" />}
        onPress={() => {
          setModalVisible(!modalVisible);
      }}
      />
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
      <BottomTabs navigation={navigation} scrName={"AccountScreen"}/>
    </Screen>
  );
}
const styles = StyleSheet.create({
  screen: {
    //backgroundColor: colors.background,
  },
  container: {
    //marginVertical: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 40,
    paddingVertical: 6,
    paddingHorizontal:15,
    elevation: 2,
  },
  buttonNew: {
    borderRadius: 40,
    paddingVertical: 8,
    paddingHorizontal:15,
    elevation: 2,
    marginTop: 10,
  },
  buttonNew2: {
    borderRadius: 40,
    paddingVertical: 8,
    paddingHorizontal:15,
    elevation: 2,
    marginTop: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    //backgroundColor: '#2196F3',
    backgroundColor: 'grey',
  },
  buttonClose_New: {
    //backgroundColor: '#2196F3',
    backgroundColor: 'red',
  },
  textStyle: {
    color: 'white',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 18,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '900',
    backgroundColor: '#2196F3',
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 10,
  },
  modalText_New: {
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
    backgroundColor: 'red',
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 10,
  },
});
export default AccountScreen;
