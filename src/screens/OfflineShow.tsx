import {View, StyleSheet} from 'react-native';
import React, {useCallback, useState} from 'react';
import GoBack from '../helper/GoBack';
import Animated from 'react-native-reanimated';
import {Card, Text} from 'react-native-paper';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {color} from '../asset/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

const OfflineShow = ({navigation}: any) => {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const jsonValue = await AsyncStorage.getItem('favoriteMovies');
    if (jsonValue != null) {
      setData(JSON.parse(jsonValue));
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  // console.log('data', data);

  return (
    <>
      <GoBack title={'Favorites'} />
      {data?.length ? (
        <Animated.ScrollView style={styles.con}>
          <Animated.View style={styles.cardCon}>
            {data?.map((item: any, index) => (
              <Card
                key={index}
                onPress={() =>
                  navigation.navigate('MovieDetail', {movie: item, show: false})
                }
                style={styles.subCon}>
                <Card.Cover
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                  }}
                  resizeMode="contain"
                  style={styles.img}
                />
                <Card.Content>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.releaseDate}>{item.release_date}</Text>
                </Card.Content>
              </Card>
            ))}
          </Animated.View>
        </Animated.ScrollView>
      ) : (
        <View style={styles.nodCon}>
          <Text style={styles.nodTx}>No Favorites Movies</Text>
        </View>
      )}
    </>
  );
};

export default OfflineShow;

const styles = StyleSheet.create({
  con: {
    padding: 10,
    backgroundColor: color.pri2,
  },
  poster: {
    width: 67,
    height: 100,
    resizeMode: 'cover',
  },
  cardCon: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 80,
  },
  subCon: {
    width: widthPercentageToDP('45%'),
    marginBottom: 15,
    backgroundColor: color.pri,
    padding: 10,
    height: 230,
  },
  img: {
    height: 100,
    backgroundColor: color.pri,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
    color: color.pri4,
    marginTop: 20,
    width: '100%',
    textAlign: 'center',
  },

  releaseDate: {
    fontSize: 14,
    alignSelf: 'center',
    color: '#555',
  },
  nodCon: {
    width: '100%',
    minHeight: heightPercentageToDP('100%'),
    backgroundColor: color.pri2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  nodTx: {
    fontSize: 20,
    color: color.pri4,
    fontWeight: '800',
  },
});
