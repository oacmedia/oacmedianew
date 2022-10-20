import { Image, ScrollView, StyleSheet, View } from "react-native";
import React from "react";

import BottomTabs from "../components/home/BottomTabs";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Text from "../components/Text";

const movieData = [
  {
    id: 1,
    type: "Action",
    url: "https://img.moviescdn.xyz/crop/215/310/media/imagesv2/2022/03/kung-fu-season-2-2022.jpg",
  },
  {
    id: 2,
    type: "Action",
    url: "https://img.moviescdn.xyz/crop/215/310/media/imagesv2/2020/02/strike-back-season-8-2020.jpg",
  },
  {
    id: 3,
    type: "Action",
    url: "https://img.moviescdn.xyz/crop/215/310/media/imagesv2/2018/04/into-the-badlands-season-3-2018.jpg",
  },
  {
    id: 4,
    type: "Comedy",
    url: "https://img.moviescdn.xyz/crop/215/310/media/imagesv2/2018/04/night-school-2018.jpg",
  },
  {
    id: 5,
    type: "Comedy",
    url: "https://img.moviescdn.xyz/crop/215/310/media/images/201029_085815/the-conners.jpg",
  },
  {
    id: 6,
    type: "Comedy",
    url: "https://img.moviescdn.xyz/crop/215/310/media/images/220915_094515/xiong-chu-mo-chong-fan-di-qiu.jpg",
  },
  {
    id: 7,
    type: "Sci-Fi",
    url: "https://img.moviescdn.xyz/crop/215/310/media/imagesv2/2018/03/pacific-rim-uprising-2018.jpg",
  },
  {
    id: 8,
    type: "Sci-Fi",
    url: "https://img.moviescdn.xyz/crop/215/310/media/imagesv2/2018/03/mv5by2jiytnmztctytq1oc00yju4lwewmjytzjkwy2y5mdi0otu3xkeyxkfqcgdeqxvynti4mze4mdu-v1-sy1000-cr0-0-674-1000-al-.jpg",
  },
  {
    id: 9,
    type: "Sci-Fi",
    url: "https://img.moviescdn.xyz/crop/215/310/media/imagesv2/2019/09/titans-season-2-2019.jpg",
  },
  {
    id: 10,
    type: "Crime",
    url: "https://img.moviescdn.xyz/crop/215/310/media/images/211204_112434/la-casa-de-papel.jpg",
  },
  {
    id: 11,
    type: "Crime",
    url: "https://img.moviescdn.xyz/crop/215/310/media/imagesv2/2017/08/19-2-season-4-2017-cv.jpg",
  },
  {
    id: 12,
    type: "Crime",
    url: "https://img.moviescdn.xyz/crop/215/310/media/imagesv2/2017/06/power-season-4-2017.jpg",
  },
];

const ThumbsComponent = ({ movie }) => {
  return (
    <Image
      source={{
        uri: movie.url,
      }}
      style={styles.video}
    />
  );
};

const ReelsScreen = ({ navigation }) => {
  return (
    <Screen>
      <ScrollView style={{ marginBottom: 70 }}>
        <View style={styles.container}>
          <Text style={styles.contText}>Action</Text>
          <ScrollView horizontal>
            <View style={styles.thumbContainer}>
              {movieData
                .filter((movie) => {
                  return movie.type == "Action";
                })
                .map((film) => {
                  return <ThumbsComponent key={film.id} movie={film} />;
                })}
            </View>
          </ScrollView>
        </View>

        <View style={styles.container}>
          <Text style={styles.contText}>Comedy</Text>
          <ScrollView horizontal>
            <View style={styles.thumbContainer}>
              {movieData
                .filter((movie) => {
                  return movie.type == "Comedy";
                })
                .map((film) => {
                  return <ThumbsComponent key={film.id} movie={film} />;
                })}
            </View>
          </ScrollView>
        </View>

        <View style={styles.container}>
          <Text style={styles.contText}>Sci-Fi</Text>
          <ScrollView horizontal>
            <View style={styles.thumbContainer}>
              {movieData
                .filter((movie) => {
                  return movie.type == "Sci-Fi";
                })
                .map((film) => {
                  return <ThumbsComponent key={film.id} movie={film} />;
                })}
            </View>
          </ScrollView>
        </View>

        <View style={styles.container}>
          <Text style={styles.contText}>Crime</Text>
          <ScrollView horizontal>
            <View style={styles.thumbContainer}>
              {movieData
                .filter((movie) => {
                  return movie.type == "Crime";
                })
                .map((film) => {
                  return <ThumbsComponent key={film.id} movie={film} />;
                })}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      <BottomTabs navigation={navigation}/>
    </Screen>
  );
};

export default ReelsScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
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
});