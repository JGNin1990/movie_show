import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import Animated from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import {color} from '../asset/styles';
import {RouteProp, useNavigation} from '@react-navigation/native';
import GoBack from '../helper/GoBack';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Movie} from '../helper/type';

type RootStackParamList = {
  MovieDetail: {movie: Movie; show: boolean};
};

interface MovieDetailProps {
  route: RouteProp<RootStackParamList, 'MovieDetail'>;
}

const Detail: React.FC<MovieDetailProps> = ({route}: any) => {
  const {movie: initialMovie, show} = route.params;
  const [movie, setMovie] = useState(initialMovie);
  const navigation = useNavigation();

  // Toggle favorite status
  const toggleFavorite = async () => {
    const storedFavorites = await AsyncStorage.getItem('favoriteMovies');
    let favoriteMovies = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (movie.isFavorite) {
      favoriteMovies = favoriteMovies.filter(
        (favMovie: any) => favMovie.id !== movie.id,
      );
      setMovie({...movie, isFavorite: false});
    } else {
      favoriteMovies.push(movie);
      setMovie({...movie, isFavorite: true});
    }

    await AsyncStorage.setItem(
      'favoriteMovies',
      JSON.stringify(favoriteMovies),
    );
  };

  const removeFav = async () => {
    const storedFavorites = await AsyncStorage.getItem('favoriteMovies');
    let favoriteMovies = storedFavorites ? JSON.parse(storedFavorites) : [];

    favoriteMovies = favoriteMovies.filter(
      (favMovie: any) => favMovie.id !== movie.id,
    );

    await AsyncStorage.setItem(
      'favoriteMovies',
      JSON.stringify(favoriteMovies),
    );
    navigation.goBack();
  };

  return (
    <>
      <GoBack title={movie.title} />
      <Animated.View style={styles.container}>
        <Animatable.Image
          animation="fadeIn"
          duration={500}
          source={{uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`}}
          style={styles.poster}
        />
        <ScrollView style={styles.detailsContainer}>
          <View style={styles.movieHeader}>
            <Text style={styles.title}>{movie.title}</Text>
            {show ? (
              <TouchableOpacity onPress={toggleFavorite}>
                <Icon
                  name={movie.isFavorite ? 'heart' : 'heart-o'}
                  size={20}
                  color={color.pri4}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={removeFav}>
                <Icon name={'trash'} size={20} color={color.pri4} />
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={
              styles.releaseDate
            }>{`Release Date: ${movie.release_date}`}</Text>
          <Text style={styles.overview}>{movie.overview}</Text>
        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.pri2,
    padding: 20,
  },
  poster: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  detailsContainer: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  releaseDate: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  overview: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  movieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Detail;
