import axios from 'axios';
import type { Movie } from '../types/movie';

export interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

export async function fetchMovies(
  query: string,
  page: number
): Promise<FetchMoviesResponse> {
  const config = {
    params: {
      query,
      include_adult: false,
      language: 'en-US',
      page,
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
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}
