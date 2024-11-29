// Movie type from the provider, in the real world this would come from a published package

import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import type {
  ConflictMovieResponse,
  CreateMovieResponse,
  DeleteMovieResponse,
  GetMovieResponse,
  MovieNotFoundResponse,
  UpdateMovieResponse
} from './provider-schema/movie-types'

export type Movie = {
  id: number
  name: string
  year: number
  rating: number
}

export type ErrorResponse = {
  error: string
}

// Helper function to extract data from Axios response
const yieldData = <T>(res: AxiosResponse<T>): T => res.data

const handleError = (err: AxiosError): ErrorResponse => {
  if (err.response?.data) return err.response.data as ErrorResponse
  return { error: 'Unexpected error occurred' }
}

const generateAuthToken = (): string => `Bearer ${new Date().toISOString()}`

const commonHeaders = {
  headers: { Authorization: generateAuthToken() }
}

export const getMovies = (url: string): Promise<GetMovieResponse> =>
  axios.get(`${url}/movies`).then(yieldData).catch(handleError)

// Fetch a single movie by ID
export const getMovieById = (
  url: string,
  id: number
): Promise<GetMovieResponse | MovieNotFoundResponse> =>
  axios
    .get(`${url}/movies/${id}`, commonHeaders)
    .then(yieldData)
    .catch(handleError)

export const getMovieByName = (
  url: string,
  name: string
): Promise<GetMovieResponse | MovieNotFoundResponse> =>
  axios
    .get(`${url}/movies?name=${encodeURIComponent(name)}`, commonHeaders)
    .then(yieldData)
    .catch(handleError)

// create a new movie
export const addMovie = (
  url: string,
  data: Omit<Movie, 'id'>
): Promise<CreateMovieResponse | ConflictMovieResponse> =>
  axios
    .post(`${url}/movies`, data, commonHeaders)
    .then(yieldData)
    .catch(handleError)

// Delete movie by ID
export const deleteMovieById = (
  url: string,
  id: number
): Promise<DeleteMovieResponse | MovieNotFoundResponse> =>
  axios
    .delete(`${url}/movies/${id}`, commonHeaders)
    .then(yieldData)
    .catch(handleError)

// Update movie by ID
export const updateMovieById = (
  url: string,
  movieId: number,
  data: Partial<Omit<Movie, 'id'>>
): Promise<UpdateMovieResponse | MovieNotFoundResponse> =>
  axios
    .put(`${url}/movies/${movieId}`, data, commonHeaders)
    .then(yieldData)
    .catch(handleError)