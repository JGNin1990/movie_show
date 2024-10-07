export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  isFavorite?: boolean;
}

export interface MovieState {
  movies: Movie[];
  totalPages: number;
  page: number;
  loadingMore: boolean;
  favorites: Movie[];
}


