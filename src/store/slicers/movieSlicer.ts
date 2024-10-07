import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Movie, MovieState} from '../../helper/type';

const initialState: MovieState = {
  movies: [],
  totalPages: 1,
  page: 0,
  loadingMore: false,
  favorites: [],
};

const MovieSlicer = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    storeMovie: (state, action: PayloadAction<Movie[]>) => {
      const newMovies = action.payload;
      const movieMap = new Map(state.movies.map(movie => [movie.id, movie]));
      // newMovies.forEach(movie => {
      //   if (!movieMap.has(movie.id)) {
      //     movieMap.set(movie.id, movie);
      //   }
      // });
      newMovies.forEach(movie => {
        movieMap.set(movie.id, movie);
      });
      state.movies = Array.from(movieMap.values());
    },
    loadingControl: (state, action: PayloadAction<boolean>) => {
      state.loadingMore = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
  },
});

export const {storeMovie, loadingControl, setPage, setTotalPages} =
  MovieSlicer.actions;
export default MovieSlicer.reducer;
