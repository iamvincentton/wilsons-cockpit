import request from 'supertest';
import express from 'express';
import PlanetRouter from '../../routes/PlanetRouter';
import { NotFoundError } from '../../services/PlanetService';

// Mock data
const newPlanet = { name: 'Jupiter', description: 'Gas Giant', imageId: 3, isHabitable: false };
const updatedPlanet = { name: 'Updated Earth', description: 'Updated Description', imageId: 1, isHabitable: true };

// Mock the PlanetService
jest.mock('../../services/PlanetService', () => {
  return {
    PlanetService: jest.fn().mockImplementation(() => {
      return {
        getAllPlanets: jest.fn()
          .mockResolvedValueOnce([
            { id: 1, name: 'Earth', description: 'Blue Planet', imageId: 1, isHabitable: true },
            { id: 2, name: 'Mars', description: 'Red Planet', imageId: 2, isHabitable: false },
          ]),
          // .mockRejectedValueOnce(new Error('Internal Server Error')),
        getPlanetById: jest.fn((id: string) => {
          // Arrange
          if (id === '1') {
            return { id: 1, name: 'Earth', description: 'Blue Planet', imageId: 1, isHabitable: true };
          } else {
            throw new NotFoundError('Planet not found');
          }
        }),
        createPlanet: jest.fn((data) => ({ id: 3, ...data })),
        updatePlanet: jest.fn((id: string, data) => {
          // Arrange
          if (id === '1') {
            return { id: 1, ...data };
          } else {
            throw new NotFoundError('Planet not found');
          }
        }),
        deletePlanet: jest.fn((id: string) => {
          // Arrange
          if (id === '1') {
            return { message: 'Planet deleted' };
          } else {
            throw new NotFoundError('Planet not found');
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
  };
});

const app = express();
app.use(express.json());
app.use('/planets', PlanetRouter);

describe('Given the planets resource', () => {
  describe('When we make a GET request to the /planets endpoint', () => {
    test('Then the list of planets is returned', async () => {
      // Arrange

      // Act
      const response = await request(app).get('/planets');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: 1, name: 'Earth', description: 'Blue Planet', imageId: 1, isHabitable: true },
        { id: 2, name: 'Mars', description: 'Red Planet', imageId: 2, isHabitable: false },
      ]);
    });

    // test('Then a 500 status is returned if an internal server error occurs', async () => {
    //   // Arrange

    //   // Act
    //   const response = await request(app).get('/planets'); // Second Call

    //   // Assert
    //   expect(response.status).toBe(500);
    //   expect(response.body).toEqual({ error: 'Internal Server Error' });
    // });
  });

  describe('When we make a GET request to the /planets/:id endpoint', () => {
    test('Then the specific planet is returned if it exists', async () => {
      // Arrange

      // Act
      const response = await request(app).get('/planets/1');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, name: 'Earth', description: 'Blue Planet', imageId: 1, isHabitable: true });
    });

    test('Then a 404 status is returned if the planet does not exist', async () => {
      // Arrange

      // Act
      const response = await request(app).get('/planets/999');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Planet not found' });
    });
  });

  describe('When we make a POST request to the /planets endpoint', () => {
    test('Then a new planet is created and returned', async () => {
      // Arrange

      // Act
      const response = await request(app).post('/planets').send(newPlanet);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 3, ...newPlanet });
    });
  });

  describe('When we make a PUT request to the /planets/:id endpoint', () => {
    test('Then the existing planet is updated if it exists', async () => {
      // Arrange

      // Act
      const response = await request(app).put('/planets/1').send(updatedPlanet);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, ...updatedPlanet });
    });

    test('Then a 404 status is returned if the planet does not exist', async () => {
      // Arrange

      // Act
      const response = await request(app).put('/planets/999').send(updatedPlanet);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Planet not found' });
    });
  });

  describe('When we make a DELETE request to the /planets/:id endpoint', () => {
    test('Then the existing planet is deleted if it exists', async () => {
      // Arrange

      // Act
      const response = await request(app).delete('/planets/1');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Planet deleted' });
    });

    test('Then a 404 status is returned if the planet does not exist', async () => {
      // Arrange

      // Act
      const response = await request(app).delete('/planets/999');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Planet not found' });
    });
  });
});
