import { useState } from 'react';
import { type Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import toast, { Toaster } from 'react-hot-toast';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';


export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

 const handleSearch = async (query: string) => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    toast.error('Please enter your search query.');
    return;
  }

  try {
    setIsLoading(true);
    setHasError(false);
    setMovies([]);

    const results = await fetchMovies(trimmedQuery);

    if (results.length === 0) {
      toast.error('No movies found for your request.');
    }

    setMovies(results);
  } catch {
    setHasError(true);
    toast.error('Something went wrong!');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
       <Toaster position='bottom-center' />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {hasError && <ErrorMessage />}
      {!isLoading && !hasError && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  );
}
