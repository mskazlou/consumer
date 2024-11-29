import log from './log'
import {
  addMovie,
  getMovieById,
  getMovieByName,
  getMovies,
  updateMovieById
} from '../../src/consumer'

import type { Movie } from '../../src/consumer'

/**
 * The collection of tasks to use with `cy.task()`
 * @param on `on` is used to hook into various events Cypress emits
 */
export default function tasks(on: Cypress.PluginEvents) {
  on('task', { log })

  // KEY: a pattern to fine tune cy task when handling multiple arguments
  // Cypress tasks only accept a single argument, but we can pass multiple values
  // by wrapping them inside an object. This ensures the argument is serializable, which is a requirement for passing data between Cypress and Node.js
  // Adjust functions to expect an object, even if the original function took multiple arguments.

  on('task', { getMovies })

  on('task', {
    getMovieById: ({ url, id }: { url: string; id: number }) =>
      getMovieById(url, id),

    getMovieByName: ({ url, name }: { url: string; name: string }) =>
      getMovieByName(url, name),

    addMovie: ({ url, data }: { url: string; data: Omit<Movie, 'id'> }) =>
      addMovie(url, data),

    updateMovie: ({
      url,
      id,
      data
    }: {
      url: string
      id: number
      data: Partial<Movie>
    }) => updateMovieById(url, id, data)
  })
}
