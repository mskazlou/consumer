import type { Movie } from '../../src/consumer'
import { faker } from '@faker-js/faker'

export const generateMovie = (): Omit<Movie, 'id'> => ({
  name: faker.lorem.words(3),
  year: faker.date.past({ years: 50 }).getFullYear(),
  rating: faker.number.float({ min: 1, max: 10, fractionDigits: 1 })
})
