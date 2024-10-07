import axios from 'axios';

const API_KEY = 'cd8689e313e86ff2c61885e4ca93b057';
const BASE_URL = 'https://api.themoviedb.org/3/movie/popular';
const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDg2ODllMzEzZTg2ZmYyYzYxODg1ZTRjYTkzYjA1NyIsIm5iZiI6MTcyODE0MTIzOC4xNjExMywic3ViIjoiNjcwMTU0NzVlODRlZWIzNWEwZjg1Njk0Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.ensc1HoiGLqNwP2u41J1SpilfIwnNbR5HuK41yuycSE';

export const fetchMovies = async (page = 1): Promise<any> => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        api_key: API_KEY,
        page, 
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    return {
      movies: response.data.results,
      totalPages: response.data.total_pages,
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
