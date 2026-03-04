import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const searchMovies = async (query) => {
  const { data } = await tmdbApi.get('/search/movie', {
    params: { query, language: 'en-US' },
  });
  return data.results;
};

export const searchTVShows = async (query) => {
  const { data } = await tmdbApi.get('/search/tv', {
    params: { query, language: 'en-US' },
  });
  return data.results;
};

export const getMovieDetails = async (movieId) => {
  const { data } = await tmdbApi.get(`/movie/${movieId}`, {
    params: { append_to_response: 'images' },
  });
  return data;
};

export const getTVDetails = async (tvId) => {
  const { data } = await tmdbApi.get(`/tv/${tvId}`, {
    params: { append_to_response: 'images' },
  });
  return data;
};

export const getMovieLogos = async (movieId) => {
  const { data } = await tmdbApi.get(`/movie/${movieId}/images`);
  return data.logos;
};

export const getTVLogos = async (tvId) => {
  const { data } = await tmdbApi.get(`/tv/${tvId}/images`);
  return data.logos;
};

export const getTrendingMovies = async () => {
  const { data } = await tmdbApi.get('/trending/movie/week');
  return data.results;
};

export const getTrendingTV = async () => {
  const { data } = await tmdbApi.get('/trending/tv/week');
  return data.results;
};

export const getImageUrl = (path, size = 'original') => {
  return path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null;
};
