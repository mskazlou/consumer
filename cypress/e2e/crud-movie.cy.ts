import { retryableBefore } from '../support/retryable-before'
import { generateMovie } from '../support/factories'
import type { Movie } from '../../src/consumer'
import spok from 'cy-spok'

describe('CRUD movie', () => {
  const movie = generateMovie()
  const updatedMovie = { name: 'Updated Movie', year: 2000 }
  const movieProps: Omit<Movie, 'id'> = {
    name: spok.string,
    year: spok.number,
    rating: spok.number
  }

  retryableBefore(() => {
    cy.api({
      method: 'GET',
      url: '/'
    })
      .its('body.message')
      .should('eq', 'Server is running.')
  })

  it('crud movie', () => {
    cy.addMovie(movie)
      .should(
        spok({
          data: movieProps,
          status: 200
        })
      )
      .its('data.id')
      .then((id: number) => {
        cy.getMovies()
          .print()
          .should(spok({ status: 200, data: spok.array }))
          .its('data')
          .findOne({ name: movie.name })

        cy.getMovieById(id)
          .its('data')
          .should(spok({ ...movieProps, id }))
          .its('name')
          .then(cy.getMovieByName)
          .its('data')
          .should(spok({ ...movieProps, id }))

        cy.updateMovie(id, updatedMovie).should(
          spok({
            data: { id, name: updatedMovie.name, year: updatedMovie.year },
            status: 200
          })
        )

        cy.deleteMovie(id).should(
          spok({ status: 200, message: `Movie ${id} has been deleted` })
        )

        cy.getMovies().findOne({ name: updatedMovie.name }).should('not.exist')
      })
  })
})
