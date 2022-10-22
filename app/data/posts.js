import { USERS } from "./users";
import storage from '@react-native-firebase/storage';

//const url = await storage().ref('8def2c6f-8258-41e5-ab9f-be3f81167078.jpeg').getDownloadURL();
let url = 'https://firebasestorage.googleapis.com/v0/b/oacmedia-app-8464c.appspot.com/o/8def2c6f-8258-41e5-ab9f-be3f81167078.jpeg?alt=media&token=838229c7-91b1-40c0-a3c9-65add90c4d81';
export const POSTS = [
  {
    imageurl:
      url,
    user: USERS[0].title + " " + USERS[0].user,
    likes: 7870,
    caption: "Sunset 🐱‍👓 ✌",
    profile_picture: USERS[0].image,
    comments: [
      {
        user: "haroon",
        comment: "Wow !",
      },
    ],
  },
  {
    imageurl:
      "https://i.pinimg.com/736x/2a/9c/c5/2a9cc5de93a52a8ed7a1084ab79e4578.jpg",
    user: USERS[1].title + " " + USERS[1].user,
    likes: 2500,
    caption: "Captured from space",
    profile_picture: USERS[1].image,
    comments: [
      {
        user: "haroon",
        comment: "Insaneeeee!!!",
      },
      {
        user: "ukasha",
        comment: "Can't wait to go up there",
      },
    ],
  },
  {
    imageurl:
      "https://www.fonewalls.com/wp-content/uploads/480x800-Background-HD-Wallpaper-057.jpg",
    user: USERS[2].title + " " + USERS[2].user,
    likes: 6729,
    caption: "Nature 🏔🌄",
    profile_picture: USERS[2].image,
    comments: [],
  },
  {
    imageurl:
      "https://i.pinimg.com/originals/66/03/18/660318679f9c2337147e68e88f25c149.jpg",
    user: USERS[3].title + " " + USERS[3].user,
    likes: 4450,
    caption: "Exotic Cars Collection!!!",
    profile_picture: USERS[3].image,
    comments: [
      {
        user: "haroon",
        comment: "Wow ! looks fire",
      },
      {
        user: "ukasha",
        comment: "That is OP!!!",
      },
    ],
  },
];
