import request from 'supertest';
import express from 'express';
import ImageRouter from '../../routes/ImageRouter';
import { NotFoundError } from '../../services/ImageService';

// Mock the ImageService
jest.mock('../../services/ImageService', () => {
  return {
    ImageService: jest.fn().mockImplementation(() => {
      return {
        getAllImages: jest.fn().mockResolvedValue([
          { id: 1, name: 'Image 1', path: 'assets/image1.jpg' },
          { id: 2, name: 'Image 2', path: 'assets/image2.jpg' },
        ]),
        getImageById: jest.fn((id: string) => {
          if (id === '1') {
            return { id: 1, name: 'Image 1', path: 'assets/image1.jpg' };
          } else {
            throw new NotFoundError('Image not found');
          }
        }),
        createImage: jest.fn((data) => ({ id: 3, ...data })),
        updateImage: jest.fn((id: string, data) => {
          if (id === '1') {
            return { id: 1, ...data };
          } else {
            throw new NotFoundError('Image not found');
          }
        }),
        deleteImage: jest.fn((id: string) => {
          if (id === '1') {
            return { message: 'Image deleted' };
          } else {
            throw new NotFoundError('Image not found');
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

// Arrange
const app = express();
app.use(express.json());
app.use('/images', ImageRouter);

describe('Given the images resource', () => {
  describe('When we make a GET request to the /images endpoint', () => {
    test('Then the list of images is returned', async () => {
      const response = await request(app).get('/images');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: 1, name: 'Image 1', path: 'assets/image1.jpg' },
        { id: 2, name: 'Image 2', path: 'assets/image2.jpg' },
      ]);
    });
  });

  describe('When we make a GET request to the /images/:id endpoint', () => {
    test('Then the specific image is returned if it exists', async () => {
      const response = await request(app).get('/images/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, name: 'Image 1', path: 'assets/image1.jpg' });
    });

    test('Then a 404 status is returned if the image does not exist', async () => {
      const response = await request(app).get('/images/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Image not found' });
    });
  });

  describe('When we make a POST request to the /images endpoint', () => {
    test('Then a new image is created and returned', async () => {
      const newImage = { name: 'Image 3', path: 'assets/image3.jpg' };

      const response = await request(app).post('/images').send(newImage);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 3, ...newImage });
    });
  });

  describe('When we make a PUT request to the /images/:id endpoint', () => {
    test('Then the existing image is updated if it exists', async () => {
      const updatedImage = { name: 'Updated Image 1', path: 'assets/updatedimage1.jpg' };

      const response = await request(app).put('/images/1').send(updatedImage);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, ...updatedImage });
    });

    test('Then a 404 status is returned if the image does not exist', async () => {
      const updatedImage = { name: 'Updated Image', path: 'assets/updatedimage.jpg' };

      const response = await request(app).put('/images/999').send(updatedImage);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Image not found' });
    });
  });

  describe('When we make a DELETE request to the /images/:id endpoint', () => {
    test('Then the existing image is deleted if it exists', async () => {
      const response = await request(app).delete('/images/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Image deleted' });
    });

    test('Then a 404 status is returned if the image does not exist', async () => {
      const response = await request(app).delete('/images/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Image not found' });
    });
  });
});
