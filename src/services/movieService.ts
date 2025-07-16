import axios from 'axios';
import { type Movie } from '../types/movie';

interface FetchMoviesResponse {
  results: Movie[];
}

export async function fetchMovies(query: string, page: number): Promise<Movie[]> {
  const config = {
    params: {
      query,
      include_adult: false,
      language: 'en-US',
      page: 1,
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  };

  try {
    const response = await axios.get<FetchMoviesResponse>(
      'https://api.themoviedb.org/3/search/movie',
      config
    );
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error; 
  }
}
