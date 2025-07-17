import { useEffect, useRef, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import { fetchMovies, type FetchMoviesResponse } from '../../services/movieService';
import { type Movie } from '../../types/movie';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import ReactPagination from '../Pagination/Pagination';

export default function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

 

  const { data, isLoading, isError, isSuccess } = useQuery<FetchMoviesResponse>({
  
    queryKey: ['movies', searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: searchQuery.trim().length > 0,
    placeholderData: keepPreviousData,
    
  });

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      toast.error('Please enter your search query.');
      return;
    }
    setSearchQuery(trimmed);
    setPage(1);
  };

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  const hasShowSuccessToast = useRef(false);

  useEffect(() => {
  if (isSuccess && data) {
    if (data.results.length === 0) {
      toast('Фільми не знайдено');
    } else if (!hasShowSuccessToast.current) {
      toast.success('Фільми знайдено успішно!');
      hasShowSuccessToast.current = true;
    }
  }
}, [isSuccess, data]);

  return (
    <>
      <Toaster position="bottom-center" />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {totalPages > 1 && (
        <ReactPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </>
  );
}
