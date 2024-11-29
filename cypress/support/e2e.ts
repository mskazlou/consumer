import './commands'
import 'cypress-map'
import '@bahmutov/cy-api'
import type { Movie } from '../../src/consumer'

const apiUrl = Cypress.config('baseUrl') || 'http://localhost:3001'

Cypress.Commands.add('getMovies', (url = apiUrl) => {
  cy.log('**getAllMovies**')
  return cy.task('getAllMovies', url)
})

Cypress.Commands.add('getMovieById', (url: string, id: number) => {
  cy.log(`**getMovieById ${id}**`)
  return cy.task('getMovieById', { url, id })
})

Cypress.Commands.add('getMovieByName', (url: string, name: string) => {
  cy.log(`**getMovieByName ${name}**`)
  return cy.task('getMovieByName', { url, name })
})

Cypress.Commands.add('addMovie', (url: string, data: Omit<Movie, 'id'>) => {
  cy.log(`**addMovie: ${JSON.stringify(data)}**`)
  return cy.task('addMovie', { url, data })
})

Cypress.Commands.add('deleteMovie', (url: string, id: number) => {
  cy.log(`**deleteMovie ${id}**`)
  return cy.task('deleteMovie', { url, id })
})

Cypress.Commands.add(
  'updateMovie',
  (url: string, id: number, data: Partial<Movie>) => {
    cy.log(`**updateMovie ${id} ${JSON.stringify(data)}**`)
    return cy.task('updateMovie', { url, id, data })
  }
)
