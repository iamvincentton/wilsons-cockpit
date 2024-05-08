import knex from '../../../db';
import Image from '../../../entities/Image';
import { ImageRepository } from '../../../repositories/ImageRepository';

jest.mock('../../../db');

const mockKnex = knex as jest.MockedFunction<typeof knex>;

describe('ImageRepository', () => {
  let imageRepository: ImageRepository;

  beforeEach(() => {
    imageRepository = new ImageRepository();
    jest.clearAllMocks(); // Clear previous mocks to avoid side effects
  });

  describe('getAllImages', () => {
    it('should return all images', async () => {
      // Arrange
      const images: Image[] = [
        { id: 1, name: 'Image 1', path: 'https://example.com/1' },
        { id: 2, name: 'Image 2', path: 'https://example.com/2' }
      ];
      mockKnex.mockReturnValue({
        select: jest.fn().mockReturnValue(images)
      } as any);

      // Act
      const result = await imageRepository.getAllImages();

      // Assert
      expect(result).toEqual(images);
      expect(mockKnex).toHaveBeenCalledWith('images');
      expect(mockKnex().select).toHaveBeenCalledWith('*');
    });
  });

  describe('getImageById', () => {
    it('should return an image by ID', async () => {
      // Arrange
      const image: Image = { id: 1, name: 'Image 1', path: 'https://example.com/1' };
      mockKnex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(image)
      } as any);

      // Act
      const result = await imageRepository.getImageById('1');

      // Assert
      expect(result).toEqual(image);
      expect(mockKnex).toHaveBeenCalledWith('images');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '1');
      expect(mockKnex().first).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if image not found', async () => {
      // Arrange
      mockKnex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(undefined)
      } as any);

      // Act
      const result = await imageRepository.getImageById('999');

      // Assert
      expect(result).toBeUndefined();
      expect(mockKnex).toHaveBeenCalledWith('images');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '999');
      expect(mockKnex().first).toHaveBeenCalledTimes(1);
    });
  });

  describe('createImage', () => {
    it('should insert a new image and return its ID', async () => {
      // Arrange
      const imageData = { id: 1, name: 'New Image 1', path: 'https://example.com/1' };
      mockKnex.mockReturnValue({
        insert: jest.fn().mockResolvedValue([1])
      } as any);

      // Act
      const result = await imageRepository.createImage(imageData);

      // Assert
      expect(result).toEqual([1]);
      expect(mockKnex).toHaveBeenCalledWith('images');
      expect(mockKnex().insert).toHaveBeenCalledWith(imageData);
    });
  });

  describe('updateImage', () => {
    it('should update an image and return the number of affected rows', async () => {
      // Arrange
      const updatedData: Partial<Image> = { name: 'Updated Image' };
      mockKnex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(1)
      } as any);

      // Act
      const result = await imageRepository.updateImage('1', updatedData);

      // Assert
      expect(result).toEqual(1);
      expect(mockKnex).toHaveBeenCalledWith('images');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '1');
      expect(mockKnex().update).toHaveBeenCalledWith(updatedData);
    });

    it('should return 0 if image is not found', async () => {
      // Arrange
      const updatedData: Partial<Image> = { name: 'Updated Image' };
      mockKnex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(0)
      } as any);

      // Act
      const result = await imageRepository.updateImage('999', updatedData);

      // Assert
      expect(result).toEqual(0);
      expect(mockKnex).toHaveBeenCalledWith('images');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '999');
      expect(mockKnex().update).toHaveBeenCalledWith(updatedData);
    });
  });

  describe('deleteImage', () => {
    it('should delete an image and return the number of affected rows', async () => {
      // Arrange
      mockKnex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        del: jest.fn().mockResolvedValue(1)
      } as any);

      // Act
      const result = await imageRepository.deleteImage('1');

      // Assert
      expect(result).toEqual(1);
      expect(mockKnex).toHaveBeenCalledWith('images');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '1');
      expect(mockKnex().del).toHaveBeenCalledTimes(1);
    });

    it('should return 0 if image is not found', async () => {
      // Arrange
      mockKnex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        del: jest.fn().mockResolvedValue(0)
      } as any);

      // Act
      const result = await imageRepository.deleteImage('999');

      // Assert
      expect(result).toEqual(0);
      expect(mockKnex).toHaveBeenCalledWith('images');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '999');
      expect(mockKnex().del).toHaveBeenCalledTimes(1);
    });
  });
});
