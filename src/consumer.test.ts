import {
  addMovie,
  deleteMovieById,
  getMovieById,
  getMovieByName,
  getMovies,
  updateMovieById
} from './consumer'
import type { ErrorResponse, Movie } from './consumer'
import nock, { cleanAll } from 'nock'
import type {
  CreateMovieResponse,
  DeleteMovieResponse,
  GetMovieResponse,
  MovieNotFoundResponse,
  UpdateMovieResponse
} from './provider-schema/movie-types'

const MOCKSERVER_URL = 'http://mockserver.com'

describe('Consumer Tests', () => {
  beforeEach(() => {
    cleanAll()
  })

  describe('getMovies, getMovieByName', () => {
    it('should return all movies', async () => {
      const EXPECTED_BODY: Movie = {
        id: 1,
        name: 'Test movie',
        year: 1999,
        rating: 8.5
      }

      nock(MOCKSERVER_URL)
        .get('/movies')
        .reply(200, { status: 200, data: [EXPECTED_BODY] })

      const res = await getMovies(MOCKSERVER_URL)
      expect(res.data).toEqual([EXPECTED_BODY])
      expect(res.status).toEqual(200)
    })

    it('should handle errors correctly', async () => {
      const errorResponse: ErrorResponse = { error: 'Not found' }

      nock(MOCKSERVER_URL).get('/movies').reply(404, {
        status: 404,
        data: errorResponse
      })

      const res = await getMovies(MOCKSERVER_URL)
      expect(res.status).toEqual(404)
      expect(res.data).toEqual(errorResponse)
    })

    it('should return a specific movie by name', async () => {
      const EXPECTED_BODY: Movie = {
        id: 1,
        name: 'My movie',
        year: 1999,
        rating: 8.5
      }

      nock(MOCKSERVER_URL)
        .get(`/movies?name=${EXPECTED_BODY.name}`)
        .reply(200, { status: 200, data: EXPECTED_BODY })

      const res = (await getMovieByName(
        MOCKSERVER_URL,
        EXPECTED_BODY.name
      )) as GetMovieResponse

      expect(res.data).toEqual(EXPECTED_BODY)
    })

    it('should handle errors correctly', async () => {
      const MOVIE_NAME = 'My movie'
      const errorResponse: ErrorResponse = { error: 'Not found' }

      nock(MOCKSERVER_URL)
        .get(`/movies?name=${MOVIE_NAME}`)
        .reply(404, errorResponse)

      const res = (await getMovieByName(
        MOCKSERVER_URL,
        MOVIE_NAME
      )) as MovieNotFoundResponse
      expect(res).toEqual(errorResponse)
    })
  })

  describe('getMovieById', () => {
    it('should return a specific movie by Id', async () => {
      const EXPECTED_BODY = {
        id: 1,
        name: 'My movie',
        year: 1999,
        rating: 8.5
      }

      nock(MOCKSERVER_URL)
        .get(`/movies/${EXPECTED_BODY.id}`)
        .reply(200, { status: 200, data: EXPECTED_BODY })

      const res = (await getMovieById(
        MOCKSERVER_URL,
        EXPECTED_BODY.id
      )) as GetMovieResponse

      expect(res.data).toEqual(EXPECTED_BODY)
    })

    it('should handle errors when movie not found', async () => {
      const testId = 999
      const errorRes: ErrorResponse = { error: 'Not found' }

      nock(MOCKSERVER_URL).get(`/movies/${testId}`).reply(404, errorRes)

      const result = await getMovieById(MOCKSERVER_URL, testId)
      expect(result).toEqual(errorRes)
    })
  })

  describe('addMovie', () => {
    const movie: Omit<Movie, 'id'> = {
      name: 'New movie',
      year: 1999,
      rating: 8.5
    }

    it('should add a new movie', async () => {
      const movie: Omit<Movie, 'id'> = {
        name: 'New movie',
        year: 1999,
        rating: 8.5
      }

      nock(MOCKSERVER_URL)
        .post('/movies', movie)
        .reply(200, {
          status: 200,
          data: {
            ...movie,
            id: 1
          }
        })

      const res = (await addMovie(MOCKSERVER_URL, movie)) as CreateMovieResponse
      expect(res.data).toEqual({ ...movie, id: 1 })
    })

    it('should not add a movie that already exists', async () => {
      const errorRes: ErrorResponse = {
        error: `Movie ${movie.name} already exists`
      }

      nock(MOCKSERVER_URL).post('/movies', movie).reply(409, errorRes)

      const res = await addMovie(MOCKSERVER_URL, movie)
      expect(res).toEqual(errorRes)
    })
  })
  describe('updateMovie', () => {
    const updatedMovieData = {
      name: 'Updated movie',
      year: 2000,
      rating: 8.5
    }

    it('should update an existing movie', async () => {
      const testId = 1

      const EXPECTED_BODY: Movie = {
        id: testId,
        ...updatedMovieData
      }

      nock(MOCKSERVER_URL)
        .put(`/movies/${testId}`, updatedMovieData)
        .reply(200, { status: 200, data: EXPECTED_BODY })

      const res = (await updateMovieById(
        MOCKSERVER_URL,
        testId,
        updatedMovieData
      )) as UpdateMovieResponse

      expect(res.data).toEqual(EXPECTED_BODY)
    })

    it('should return an error if movie to update does not exist', async () => {
      const testId = 999

      const errorRes: ErrorResponse = {
        error: `Movie with ID ${testId} not found`
      }

      nock(MOCKSERVER_URL)
        .put(`/movies/${testId}`, updatedMovieData)
        .reply(404, errorRes)

      const res = (await updateMovieById(
        MOCKSERVER_URL,
        testId,
        updatedMovieData
      )) as MovieNotFoundResponse

      expect(res).toEqual(errorRes)
    })
  })

  describe('deleteMovie', () => {
    it('should delete a movie', async () => {
      const testId = 100
      const message = `Movie ${testId} has been deleted`

      nock(MOCKSERVER_URL)
        .delete(`/movies/${testId}`)
        .reply(200, { message, status: 200 })

      const res = (await deleteMovieById(
        MOCKSERVER_URL,
        testId
      )) as DeleteMovieResponse

      expect(res.message).toEqual(message)
    })
    it('should throw an error if movie to delete does not exist', async () => {
      const testId = 1234567
      const message = `Movie with ID ${testId} not found`

      nock(MOCKSERVER_URL)
        .delete(`/movies/${testId}`)
        .reply(404, { message, status: 404 })

      const res = (await deleteMovieById(
        MOCKSERVER_URL,
        testId
      )) as DeleteMovieResponse

      expect(res.message).toEqual(message)
    })
  })
})
