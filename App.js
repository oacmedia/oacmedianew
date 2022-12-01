import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import SignedInStack from "./navigation";
import * as Notifications from 'expo-notifications';
import AStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

export default function App() {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(()=>{
    const getPermission = async () => {
      //if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            //alert('Enable push notifications to use the app!');
            await AStorage.setItem('expopushtoken', "");
            return;
          }
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          await AStorage.setItem('expopushtoken', token);
      // } else {
      //   alert('Must use physical device for Push Notifications');
      // }

        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
    }

    getPermission();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {});

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  },[])
  return <SignedInStack />;
}
