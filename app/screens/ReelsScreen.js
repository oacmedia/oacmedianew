import { Image, ScrollView, StyleSheet, View, TouchableOpacity, Dimensions, ActivityIndicator, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";

import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Text from "../components/Text";
import { Icon } from "@rneui/base";
import { useUserAuth } from "../context/UserAuthContext";
import AppText from "../components/Text";
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import { useVideoData } from "../context/VideoDataContext";
import moment from "moment/moment";

const fullWidth = Dimensions.get('window').width;

const VideoScreen = ({ navigation }) => {
  const {user, setUser} = useUserAuth();
  const [allCategories, setAllCategories] = useState([]);
  const [movieData, setMovieData] = useState([]);
  const {videoData, setVideoData} = useVideoData();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [lastDocRef, setLastDocRef] = useState(null);
  let pageSize = 5;

  const ThumbsComponent = ({ title, time, cat }) => {
    return (
      <TouchableOpacity
            onPress={() => {
              //setVideoData({videoUrl: movie.videoUrl, title: movie.title, description: movie.description, tUrl: movie.url})
              //navigation.navigate("VideoScreen");
            }}
            style={{marginHorizontal: 10,marginTop:10,width: fullWidth-20, height: title.length > 30?((fullWidth/100)*56.25)+80:((fullWidth/100)*56.25)+65}}
          >
            <Image
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/oacmedia-app-8464c.appspot.com/o/ef6e178f-0428-4140-839e-863627f47323.jpeg?alt=media&token=64e83b67-9069-40b6-9853-e2a757cf38e7",
              }}
              style={styles.video}
            />
            <View style={{height: title.length > 45?91:76, width: fullWidth-20, backgroundColor: "white",
              //"rgba(220,220,220,0.2)",
               position: "absolute", zIndex: 1, bottom: 0,padding: 10,}}>
              <Text style={{color: colors.background,paddingLeft: 6, fontSize: title.length > 30?16:18,fontWeight: "600"}}>{title.length > 90 ? title.slice(0, 90)+"...": title}</Text>
              <View style={{position:"absolute", bottom: 10, left: 8,}}>
                <Text style={{color: colors.dark, paddingLeft: 8,fontSize: 12,fontWeight: "500"}}>{cat.length > 20 ? cat.slice(0, 20)+"...": cat}</Text>
              </View>
              <View style={{position:"absolute", bottom: 10, right: 60,}}>
                <Text style={{color: colors.dark, paddingLeft: 8,fontSize: 14,fontWeight: "500"}}>{moment.utc(time.toDate()).local().startOf('seconds').fromNow()}</Text>
              </View>
              <View  style={{
                alignItems:'center',
                justifyContent:'center',
                width:30,
                height:30,
                backgroundColor:colors.background,
                borderRadius:30 / 2,
                position: "absolute",
                zIndex: 1,
                bottom: 1,
                right: 8,
                marginVertical: 3,
              }}>
                <Icon name={"play-arrow"}  size={22} color="#FFF" />
              </View>
            </View>
          </TouchableOpacity>
    );
  };

  const loadPosts = useCallback(() => {
    setIsLoading(true);
    let query = firestore().collection('Videos')
    if(lastDocRef) {
      query = query.startAfter(lastDocRef)
    }
    query = query.limit(pageSize)
    query.get()
      .then(async (snapshot) => {
        let post = [];
        for( let cat of snapshot.docs ){
            let data = cat.data();
            let id = cat.id;
            post.push({type: data.category.label, id: id, url: data.thumbUrl, videoUrl: data.videoUrl, title: data.title, description: data.description, time: data.time});
        }
        if(snapshot.docs.length < pageSize) {
          setIsFinished(true);
        }
        if(snapshot.docs.length) {
          setLastDocRef(snapshot.docs[snapshot.docs.length-1]);
        }
        setIsLoading(false);
        setMessages((prevPosts) => {
          let objs = post.map((obj)=>{
            return obj;
          });
          return [...prevPosts, ...objs];
        });
      });
  }, [setIsLoading, setIsFinished, setMessages, lastDocRef, setLastDocRef])

  const fetchMoreData = useCallback(() => {
    if(isLoading || isFinished) return;
    loadPosts();
  }, [isFinished, isLoading])

  // async function getCategories(){
  //   let array = [];
  //   let count = 0;
  //   let snapshot = await firestore().collection('Categories').get()
  //     for( let request of snapshot.docs ){
  //       count++;
  //       let data = request.data();
  //       let id = request.id;
  //       array.push({category: data.category, id: id});
  //       if(count == snapshot.docs.length){
  //         setAllCategories(array);
  //       }
  //     }
      
  // }
  // async function getData(){
  //   let array = [];
  //   let count = 0;
  //   let snapshot = await firestore().collection('Videos').get()
  //     for( let request of snapshot.docs ){
  //       count++;
  //       let data = request.data();
  //       let id = request.id;
  //       array.push({type: data.category.label, id: id, url: data.thumbUrl, videoUrl: data.videoUrl, title: data.title, description: data.description});
  //       if(count == snapshot.docs.length){
  //         setMovieData(array);
  //       }
  //     }
  // }
  // useEffect(()=>{
  //   setVideoData({});
  //   getData();
  //   getCategories();
  //   firestore().collection('Videos').onSnapshot(()=>{
  //     getData();
  //     getCategories();
  //   })
  // },[])

  useEffect(()=>{

    loadPosts();

    let query = firestore().collection('Videos')
    let unsubscribe = query.onSnapshot((snapshot) => {
      setMessages((prevPosts) => {
        // don't load posts on reload
        if(prevPosts.length === 0)
          return prevPosts;
        let newPosts = [...prevPosts];
        snapshot.docChanges().forEach(async(change)=> {
          let data = change.doc.data();
          let id = change.doc.id;

          let _postIndex = newPosts.findIndex((_post) => _post.id === id);
          if(change.type === "removed") {
            newPosts.splice(_postIndex, 1);
            return;
          }
          let post = [{type: data.category.label, id: id, url: data.thumbUrl, videoUrl: data.videoUrl, title: data.title, description: data.description, time: data.time}];
          if(_postIndex !== -1) {
            newPosts.splice(_postIndex, 1, ...post);
          } else {
            newPosts.unshift(...post);
          }
        })
        return newPosts;
      })
    })
    return () => {
      unsubscribe();
    }
  },[]);

  return (
    <Screen>
      <View style={{ alignSelf: "center", marginTop: 20 }}>
        <AppText style={{ fontSize: 25, fontWeight: "700" }}>Videos</AppText>
      </View>
      {user.isAdmin && <TouchableOpacity
        style={{
            borderWidth:5,
            borderColor:"transparent",
            alignItems:'center',
            justifyContent:'center',
            width:65,
            height:65,
            backgroundColor:'#fff',
            borderRadius:50,
            position: "absolute",
            zIndex: 2,
            bottom: 70,
            right: 10,
          }}
        onPress={() => {
            navigation.navigate("UploadVideo");
          }}
      >
        <Icon name={"add"}  size={35} color={colors.background} />
      </TouchableOpacity>}
      {user.isAdmin && <TouchableOpacity
        style={{
            borderWidth:5,
            borderColor:"transparent",
            alignItems:'center',
            justifyContent:'center',
            width:65,
            height:65,
            backgroundColor:'#fff',
            borderRadius:50,
            position: "absolute",
            zIndex: 2,
            bottom: 70,
            left: 10,
          }}
        onPress={() => {
            navigation.navigate("DeleteVideo");
          }}
      >
        <Icon name={"delete"}  size={35} color={colors.background} />
      </TouchableOpacity>}
      <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <ThumbsComponent title={item.title} time={item.time} cat={item.type} />
        }}
        onEndReachedThreshold={0.2}
        onEndReached={fetchMoreData}
      />
      </View>
      <BottomTabs navigation={navigation} scrName={"ReelsScreen"}/>
    </Screen>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 120,
  },
  contText: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 22,
    fontWeight: "600",
  },
  thumbContainer: {
    marginTop: 5,
    marginLeft: 10,
    flexDirection: "row",
  },
  video: {
    marginRight: 10,
    width: fullWidth-20,
    height: (fullWidth/100)*56.25,
    resizeMode: "cover",
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: fullWidth,
    width: fullWidth,
    backgroundColor: "transparent",
  },
});