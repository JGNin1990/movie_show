import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {FadeIn} from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import {fetchMovies} from '../api';
import Loading from '../helper/Loading';
import {color} from '../asset/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Entypo';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {
  loadingControl,
  setPage,
  setTotalPages,
  storeMovie,
} from '../store/slicers/movieSlicer';
import {Movie} from '../helper/type';
import {useNetInfo} from '@react-native-community/netinfo';
import {heightPercentageToDP} from 'react-native-responsive-screen';

const MovieList: React.FC = React.memo(({navigation}: any) => {
  const dispatch = useDispatch();
  const {isConnected} = useNetInfo();

  const {movies, page, totalPages, loadingMore} = useSelector(
    (state: RootState) => state.movies,
  );

  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchTx, setSearchTx] = useState<string>('');

  const loadMovies = async (pageNumber: number = 1) => {
    try {
      const data = await fetchMovies(pageNumber);

      if (data?.movies?.length) {
        await loadFavorites(data?.movies);
        // dispatch(storeMovie(data?.movies));
        dispatch(setTotalPages(data?.totalPages));

        setFilteredMovies(prevMovies => {
          const combinedMovies = [...prevMovies, ...data?.movies];
          return Array.from(new Set(combinedMovies.map(movie => movie.id))).map(
            id => combinedMovies.find(movie => movie.id === id),
          );
        });

        setLoading(false);
        dispatch(loadingControl(false));
      }
    } catch (error) {
      console.error('Error loading movies:', error);
      setLoading(false);
      dispatch(loadingControl(false));
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMovies(1);
    }, []),
  );

  const loadFavorites = async (fetchedMovies: Movie[]) => {
    const storedFavorites = await AsyncStorage.getItem('favoriteMovies');
    console.log('storedFavorites', storedFavorites);
    if (storedFavorites) {
      const favoriteMovies: Movie[] = JSON.parse(storedFavorites);
      // console.log('favoriteMovies', favoriteMovies);

      // Update the fetchedMovies with the favorite status
      const updatedMovies = fetchedMovies.map(movie => ({
        ...movie,
        isFavorite: favoriteMovies.some(favMovie => favMovie.id === movie.id),
      }));
      dispatch(storeMovie(updatedMovies));
      setFilteredMovies(updatedMovies);
      // console.log('updatedMovies', updatedMovies);
    }
  };

  //for filter
  useEffect(() => {
    if (searchTx) {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTx.toLowerCase()),
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  }, [searchTx, movies]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMovies(1);
    setRefreshing(false);
  };

  const loadMoreMovies = async () => {
    if (!loadingMore && page < totalPages && !searchTx) {
      dispatch(loadingControl(true));
      const nextPage = page + 1;
      dispatch(setPage(nextPage));
      await loadMovies(nextPage);
    }
  };

  const renderMovie = ({item}: {item: Movie}) => (
    <Animated.View
      entering={FadeIn.duration(500)}
      onTouchEnd={() =>
        navigation.navigate('MovieDetail', {movie: item, show: true})
      }
      style={styles.movieContainer}>
      <Animatable.Image
        animation="bounceIn"
        duration={1000}
        resizeMode="contain"
        source={{uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`}}
        style={styles.poster}
      />
      <View style={styles.movieDetails}>
        <View style={styles.movieHeader}>
          <Text style={styles.title}>{item.title}</Text>
          {item.isFavorite && (
            <Icon name="heart" size={20} color={color.pri4} />
          )}
        </View>
        <Text
          style={styles.releaseDate}>{`Release: ${item.release_date}`}</Text>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.con}>
      {showSearch ? (
        <Animatable.View
          animation="slideInDown"
          duration={300}
          style={styles.headerCon}>
          <TextInput
            style={styles.input}
            onChangeText={text => setSearchTx(text)}
            placeholder="Search Movies"
            placeholderTextColor={color.pri}
            value={searchTx}
          />
          <TouchableOpacity
            onPress={() => {
              setShowSearch(false);
              setSearchTx('');
            }}
            style={{marginEnd: 10}}>
            <Icon2 name="cross" size={30} color={color.pri} />
          </TouchableOpacity>
        </Animatable.View>
      ) : (
        <Animatable.View
          animation="slideInDown"
          duration={300}
          style={styles.headerCon}>
          <Text style={{fontSize: 20, fontWeight: '800', color: color.pri}}>
            Your Movie Show
          </Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('OfflineShow')}
              style={{marginEnd: 15, padding: 13}}>
              <Icon2 name="download" size={18} color={color.pri} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowSearch(true)}
              style={{marginEnd: 15, padding: 13}}>
              <Icon name="search" size={18} color={color.pri} />
            </TouchableOpacity>
          </View>
        </Animatable.View>
      )}

      {isConnected ? (
        <Animated.FlatList
          data={filteredMovies}
          renderItem={renderMovie}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContainer}
          style={{paddingBottom: 90}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[color.pri4, color.pri2, color.pri3]}
            />
          }
          onEndReached={loadMoreMovies}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="large" color={color.pri4} />
            ) : null
          }
        />
      ) : (
        <Animatable.View style={styles.nodCon}>
          <Animatable.Text style={styles.nodTx}>
            Your are Offline
          </Animatable.Text>
        </Animatable.View>
      )}

      <Loading visible={loading} />
      <StatusBar backgroundColor={color.pri4} />
    </View>
  );
});

const styles = StyleSheet.create({
  con: {
    backgroundColor: color.pri2,
    minHeight: '100%',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 80,
  },
  movieContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  poster: {
    width: 67,
    height: 100,
    resizeMode: 'cover',
  },
  movieDetails: {
    flex: 1,
    padding: 10,
  },
  movieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: color.pri4,
  },
  releaseDate: {
    fontSize: 14,
    color: '#555',
  },
  headerCon: {
    backgroundColor: color.pri4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    color: color.pri,
    borderColor: color.pri,
    borderBottomWidth: 1,
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

export default MovieList;
