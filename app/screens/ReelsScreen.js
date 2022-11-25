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

const fullWidth = Dimensions.get('window').width;

const VideoScreen = ({ navigation }) => {
  const {user, setUser} = useUserAuth();
  const [allCategories, setAllCategories] = useState([]);
  const [movieData, setMovieData] = useState([]);
  const {videoData, setVideoData} = useVideoData();

  const ThumbsComponent = ({ movie, navigation }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setVideoData({videoUrl: movie.videoUrl, title: movie.title, description: movie.description})
          navigation.navigate("VideoScreen");
        }}
      >
        <Image
          source={{
            uri: movie.url,
          }}
          style={styles.video}
        />
      </TouchableOpacity>
    );
  };

  async function getCategories(){
    let array = [];
    let count = 0;
    let snapshot = await firestore().collection('Categories').get()
      for( let request of snapshot.docs ){
        count++;
        let data = request.data();
        let id = request.id;
        array.push({category: data.category, id: id});
        if(count == snapshot.docs.length){
          setAllCategories(array);
        }
      }
      
  }
  async function getData(){
    let array = [];
    let count = 0;
    let snapshot = await firestore().collection('Videos').get()
      for( let request of snapshot.docs ){
        count++;
        let data = request.data();
        let id = request.id;
        array.push({type: data.category.label, id: id, url: data.thumbUrl, videoUrl: data.videoUrl, title: data.title, description: data.description});
        if(count == snapshot.docs.length){
          setMovieData(array);
        }
      }
  }
  useEffect(()=>{
    setVideoData({});
    getData();
    getCategories();
    firestore().collection('Videos').onSnapshot(()=>{
      getData();
      getCategories();
    })
  },[])

  return (
    <Screen>
      <View style={{ alignSelf: "center", marginTop: 20 }}>
        <AppText style={{ fontSize: 25, fontWeight: "700" }}>Videos</AppText>
      </View>
      {user.isAdmin && <TouchableOpacity
        style={{
            borderWidth:5,
            borderColor:'#20194D',
            alignItems:'center',
            justifyContent:'center',
            width:75,
            height:75,
            backgroundColor:'#fff',
            borderRadius:50,
            position: "absolute",
            zIndex: 1,
            bottom: 70,
            right: 10,
          }}
        onPress={() => {
            navigation.navigate("UploadVideo");
          }}
      >
        <Icon name={"add"}  size={40} color="#20194D" />
      </TouchableOpacity>}
      {user.isAdmin && <TouchableOpacity
        style={{
            borderWidth:5,
            borderColor:'#20194D',
            alignItems:'center',
            justifyContent:'center',
            width:75,
            height:75,
            backgroundColor:'#fff',
            borderRadius:50,
            position: "absolute",
            zIndex: 1,
            bottom: 70,
            left: 10,
          }}
        onPress={() => {
            navigation.navigate("DeleteVideo");
          }}
      >
        <Icon name={"delete"}  size={40} color="#20194D" />
      </TouchableOpacity>}
      <FlatList style={{ marginBottom: 40 }}
          data={allCategories}
          keyExtractor={(category) => category.id}
          renderItem={(category) => {
            //const {item: post} = item
            let catData = category.item
            //console.log(catData);
            return  <View style={styles.container}>
                      <Text style={styles.contText}>{catData.category}</Text>
                      <ScrollView horizontal>
                        <View style={styles.thumbContainer}>
                          {movieData
                            .filter((movie) => {
                              //console.log(movie.type != 'undefined' && catData.category != 'undefined'? movie.type == catData.category : false);
                              
                              return movie.type != 'undefined' && catData.category != 'undefined'? movie.type == catData.category : false;
                            })
                            .map((film) => {
                              return <ThumbsComponent key={film.id} movie={film} navigation={navigation} />;
                            })}
                        </View>
                      </ScrollView>
                    </View>
          }}
          />
      <BottomTabs navigation={navigation}/>
    </Screen>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  contText: {
    marginLeft: 20,
    fontSize: 16,
    fontWeight: "600",
  },
  thumbContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
  video: {
    marginRight: 10,
    width: 250,
    height: 150,
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