// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";
// import HomeScreen from "./app/screens/HomeScreen";
// import LoginScreen from "./app/screens/LoginScreen";
// import RegisterScreen1 from "./app/screens/RegisterScreen1";
// import RegisterScreen2 from "./app/screens/RegisterScreen2";
// import RegisterScreen3 from "./app/screens/RegisterScreen3";
// import ListingEditScreen from "./app/screens/ListingEditScreen";
// import RegisterScreen4 from "./app/screens/RegisterScreen4";
// import MessagesScreen from "./app/screens/MessagesScreen";
// import AccountScreen from "./app/screens/AccountScreen";
// import SearchScreen from "./app/screens/SearchScreen";
// import ReelsScreen from "./app/screens/ReelsScreen";
// import ChatScreen from "./app/screens/ChatScreen";
// import CallScreen from "./app/screens/CallScreen";
// import FriendsScreen from "./app/screens/FriendsScreen";
// import PostsScreen from "./app/screens/PostsScreen";

// const Stack = createStackNavigator();

// const screenOptions = {
//   headerShown: false,
// };

// const SignedInStack = () => (
//   <NavigationContainer>
//     <Stack.Navigator
//       initialRouteName="LoginScreen"
//       screenOptions={screenOptions}
//     >
//       <Stack.Screen name="AccountScreen" component={AccountScreen} />
//       <Stack.Screen name="CallScreen" component={CallScreen} />
//       <Stack.Screen name="ChatScreen" component={ChatScreen} />
//       <Stack.Screen name="FriendsScreen" component={FriendsScreen} />
//       <Stack.Screen name="HomeScreen" component={HomeScreen} />
//       <Stack.Screen name="ListingEditScreen" component={ListingEditScreen} />
//       <Stack.Screen name="LoginScreen" component={LoginScreen} />
//       <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
//       <Stack.Screen name="PostsScreen" component={PostsScreen} />
//       <Stack.Screen name="ReelsScreen" component={ReelsScreen} />
//       <Stack.Screen name="RegisterScreen1" component={RegisterScreen1} />
//       <Stack.Screen name="RegisterScreen2" component={RegisterScreen2} />
//       <Stack.Screen name="RegisterScreen3" component={RegisterScreen3} />
//       <Stack.Screen name="RegisterScreen4" component={RegisterScreen4} />
//       <Stack.Screen name="SearchScreen" component={SearchScreen} />
//     </Stack.Navigator>
//   </NavigationContainer>
// );

// export default SignedInStack;

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./app/screens/HomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import RegisterScreen1 from "./app/screens/RegisterScreen1";
import RegisterScreen2 from "./app/screens/RegisterScreen2";
import RegisterScreen3 from "./app/screens/RegisterScreen3";
import ListingEditScreen from "./app/screens/ListingEditScreen";
import RegisterScreen4 from "./app/screens/RegisterScreen4";
import RegisterScreen5 from "./app/screens/RegisterScreen5";
import MessagesScreen from "./app/screens/MessagesScreen";
import AccountScreen from "./app/screens/AccountScreen";
import SearchScreen from "./app/screens/SearchScreen";
import ReelsScreen from "./app/screens/ReelsScreen";
import ChatScreen from "./app/screens/ChatScreen";
import CallScreen from "./app/screens/CallScreen";
import FriendsScreen from "./app/screens/FriendsScreen";
import PostsScreen from "./app/screens/PostsScreen";
import {UserAuthContextProvider} from './app/context/UserAuthContext';
import LoginOTP from "./app/screens/LoginOTP";
import RequestsScreen from "./app/screens/RequestsScreen";
import { DataSharingContextProvider } from "./app/context/DataSharingContext";
import FriendsSelect from "./app/screens/FriendsSelect";
import UploadVideo from "./app/screens/UploadVideo";
import AddCategory from "./app/screens/AddCategory";
import SelectThumbnail from "./app/screens/SelectThumbnail";
import AddVideoData from "./app/screens/AddVideoData";
import VideoScreen from "./app/screens/VideoScreen";
import DeleteCategory from "./app/screens/DeleteCategory";

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

const SignedInStack = () => (
  <UserAuthContextProvider>
    <DataSharingContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LoginScreen"
          screenOptions={screenOptions}
        >
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="LoginOTP" component={LoginOTP} />
          <Stack.Screen name="RegisterScreen1" component={RegisterScreen1} />
          <Stack.Screen name="RegisterScreen2" component={RegisterScreen2} />
          <Stack.Screen name="RegisterScreen3" component={RegisterScreen3} />
          <Stack.Screen name="RegisterScreen4" component={RegisterScreen4} />
          <Stack.Screen name="RegisterScreen5" component={RegisterScreen5} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="ListingEditScreen" component={ListingEditScreen} />
          <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
          <Stack.Screen name="FriendsSelect" component={FriendsSelect} />
          <Stack.Screen name="AccountScreen" component={AccountScreen} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="PostsScreen" component={PostsScreen} />
          <Stack.Screen name="ReelsScreen" component={ReelsScreen} />
          <Stack.Screen name="UploadVideo" component={UploadVideo} />
          <Stack.Screen name="AddCategory" component={AddCategory} />
          <Stack.Screen name="DeleteCategory" component={DeleteCategory} />
          <Stack.Screen name="SelectThumbnail" component={SelectThumbnail} />
          <Stack.Screen name="AddVideoData" component={AddVideoData} />
          <Stack.Screen name="VideoScreen" component={VideoScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="CallScreen" component={CallScreen} />
          <Stack.Screen name="RequestsScreen" component={RequestsScreen} />
          <Stack.Screen name="FriendsScreen" component={FriendsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DataSharingContextProvider>
  </UserAuthContextProvider>
);

export default SignedInStack;
