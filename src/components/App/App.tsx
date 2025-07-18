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
import ReactPaginate from 'react-paginate';
import css from '../css/Pagination.module.css';

export default function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useQuery<FetchMoviesResponse>({
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
    setSelectedMovie(null); 
  };

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  const prevSearchQuery = useRef('');

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
        toast('No movies found for your request.');
      } else if (prevSearchQuery.current !== searchQuery) {
        toast.success('Movies found successfully!');
        prevSearchQuery.current = searchQuery;
      }
  }, [isSuccess, data]);
  


  return (
    <>
      <Toaster position="bottom-center" />
      <SearchBar onSubmit={handleSearch} />

      {searchQuery && (isLoading || isFetching) && <Loader />}

      {isError && <ErrorMessage />}

     {isSuccess && !isFetching && !isError && movies.length > 0 && (
  <MovieGrid movies={movies} onSelect={setSelectedMovie} />
)}


      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
    </>
  );
}
