import type { Movie } from '../src/consumer'

export {}

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /** Gets a list of movies
       * ```js
       * cy.getAllMovies(token)
       * ```
       */
      getMovies(
        token: string,
        allowedToFail?: boolean
      ): Chainable<Response<Movie[]> & Messages>

      /** Gets a movie by id
       * ```js
       * cy.getMovieById(token, 1)
       * ```
       */
      getMovieById(
        token: string,
        id: number,
        allowedToFail?: boolean
      ): Chainable<Response<Movie> & Messages>

      /** Gets a movie by name
       * ```js
       * cy.getMovieByName(token, 'The Great Gatsby')
       * ```
       */
      getMovieByName(
        token: string,
        name: string,
        allowedToFail?: boolean
      ): Chainable<Response<Movie> & Messages>

      /** Creates a movie
       * ```js
       * cy.addMovie({name: 'The Great Gatsby'})
       * ```
       */
      addMovie(
        token: string,
        body: Omit<Movie, 'id'>,
        allowedToFail?: boolean
      ): Chainable<Response<Movie> & Messages>

      /** Updates a movie by id
       * ```js
       * cy.updateMovie(1, {name: 'The Great Gatsby'})
       * ```
       */
      updateMovie(
        token: string,
        id: number,
        body: Partial<Omit<Movie, 'id'>>
      ): Chainable<Response<Movie> & Messages>

      /** Deletes a  movie
       * ```js
       * cy.deleteMovie(1)
       * ```
       */
      deleteMovie(
        token: string,
        id: number,
        allowedToFail?: boolean
      ): Chainable<Response<Movie> & Messages>

      /** https://www.npmjs.com/package/@cypress/skip-test
       * `cy.skipOn('localhost')` */
      skipOn(
        nameOrFlag: string | boolean | (() => boolean),
        cb?: () => void
      ): Chainable<Subject>

      /** https://www.npmjs.com/package/@cypress/skip-test
       * `cy.onlyOn('localhost')` */
      onlyOn(
        nameOrFlag: string | boolean | (() => boolean),
        cb?: () => void
      ): Chainable<Subject>
    }
  }
}
