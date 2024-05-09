import request from 'supertest';
import express from 'express';
import AstronautRouter from '../../routes/AstronautRouter';
import { NotFoundError, BadRequestError } from '../../services/AstronautService';

// Mock data
const newAstronaut = { firstname: 'Sally', lastname: 'Ride', originPlanetId: 1 };
const updatedAstronaut = { firstname: 'Updated Neil', lastname: 'Armstrong', originPlanetId: 1 };

// Mock the AstronautService
jest.mock('../../services/AstronautService', () => {
  return {
    AstronautService: jest.fn().mockImplementation(() => {
      return {
        getAllAstronauts: jest.fn().mockResolvedValue([
          { id: 1, firstname: 'Neil', lastname: 'Armstrong', originPlanet: { id: 1, name: 'Earth' } },
          { id: 2, firstname: 'Buzz', lastname: 'Aldrin', originPlanet: { id: 1, name: 'Earth' } },
        ]),
        getAstronautById: jest.fn((id: string) => {
          // Arrange
          if (id === '1') {
            return { id: 1, firstname: 'Neil', lastname: 'Armstrong', originPlanet: { id: 1, name: 'Earth' } };
          } else {
            throw new NotFoundError('Astronaut not found');
          }
        }),
        createAstronaut: jest.fn((data) => ({ id: 3, ...data, originPlanet: { id: data.originPlanetId, name: 'Earth' } })),
        updateAstronaut: jest.fn((id: string, data) => {
          // Arrange
          if (id === '1') {
            return { id: 1, ...data, originPlanet: { id: data.originPlanetId, name: 'Earth' } };
          } else {
            throw new NotFoundError('Astronaut not found');
          }
        }),
        deleteAstronaut: jest.fn((id: string) => {
          // Arrange
          if (id === '1') {
            return { message: 'Astronaut deleted' };
          } else {
            throw new NotFoundError('Astronaut not found');
          }
        }),
      };
    }),
    NotFoundError: class extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
      }
    },
    BadRequestError: class extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
      }
    },
  };
});

const app = express();
app.use(express.json());
app.use('/astronauts', AstronautRouter);

describe('Given the astronauts resource', () => {
  describe('When we make a GET request to the /astronauts endpoint', () => {
    test('Then the list of astronauts is returned', async () => {
      // Arrange (setup already done in the mock)

      // Act
      const response = await request(app).get('/astronauts');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: 1, firstname: 'Neil', lastname: 'Armstrong', originPlanet: { id: 1, name: 'Earth' } },
        { id: 2, firstname: 'Buzz', lastname: 'Aldrin', originPlanet: { id: 1, name: 'Earth' } },
      ]);
    });
  });

  describe('When we make a GET request to the /astronauts/:id endpoint', () => {
    test('Then the specific astronaut is returned if it exists', async () => {
      // Arrange (setup already done in the mock)

      // Act
      const response = await request(app).get('/astronauts/1');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, firstname: 'Neil', lastname: 'Armstrong', originPlanet: { id: 1, name: 'Earth' } });
    });

    test('Then a 404 status is returned if the astronaut does not exist', async () => {
      // Arrange (setup already done in the mock)

      // Act
      const response = await request(app).get('/astronauts/999');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Astronaut not found' });
    });
  });

  describe('When we make a POST request to the /astronauts endpoint', () => {
    test('Then a new astronaut is created and returned', async () => {
      // Arrange (setup already done in the mock)

      // Act
      const response = await request(app).post('/astronauts').send(newAstronaut);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 3, ...newAstronaut, originPlanet: { id: 1, name: 'Earth' } });
    });

    test('Then a 400 status is returned if required fields are missing', async () => {
      // Arrange (setup already done in the mock)

      // Act
      const response = await request(app).post('/astronauts').send({ firstname: 'John' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });
  });

  describe('When we make a PUT request to the /astronauts/:id endpoint', () => {
    test('Then the existing astronaut is updated if it exists', async () => {
      // Arrange (setup already done in the mock)

      // Act
      const response = await request(app).put('/astronauts/1').send(updatedAstronaut);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, ...updatedAstronaut, originPlanet: { id: 1, name: 'Earth' } });
    });

    test('Then a 404 status is returned if the astronaut does not exist', async () => {
      // Arrange (setup already done in the mock)

      // Act
      const response = await request(app).put('/astronauts/999').send(updatedAstronaut);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Astronaut not found' });
    });
  });

  describe('When we make a DELETE request to the /astronauts/:id endpoint', () => {
    test('Then the existing astronaut is deleted if it exists', async () => {
      // Arrange (setup already done in the mock)

      // Act
      const response = await request(app).delete('/astronauts/1');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Astronaut deleted' });
    });

    test('Then a 404 status is returned if the astronaut does not exist', async () => {
      // Arrange (setup already done in the mock)

      // Act
      const response = await request(app).delete('/astronauts/999');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Astronaut not found' });
    });
  });
});
