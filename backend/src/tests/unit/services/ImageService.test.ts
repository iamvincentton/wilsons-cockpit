import { ImageRepository } from '../../../repositories/ImageRepository';
import Image from '../../../entities/Image';
import { ImageService, NotFoundError } from '../../../services/ImageService';

describe('ImageService', () => {
  let imageRepositoryMock: jest.Mocked<ImageRepository>;
  let imageService: ImageService;

  beforeEach(() => {
    // Arrange: mock the ImageRepository and create an instance of the service
    imageRepositoryMock = {
      getAllImages: jest.fn(),
      getImageById: jest.fn(),
      createImage: jest.fn(),
      updateImage: jest.fn(),
      deleteImage: jest.fn(),
    } as jest.Mocked<ImageRepository>;
    imageService = new ImageService(imageRepositoryMock);
  });

  describe('getAllImages', () => {
    it('should return a list of images', async () => {
      // Arrange
      const images: Image[] = [{ id: 1, name: 'Image 1', path: '/assets/image1.jpg' }];
      imageRepositoryMock.getAllImages.mockResolvedValue(images);

      // Act
      const result = await imageService.getAllImages();

      // Assert
      expect(result).toEqual(images);
      expect(imageRepositoryMock.getAllImages).toHaveBeenCalledTimes(1);
    });
  });

  describe('getImageById', () => {
    it('should return an image by ID', async () => {
      // Arrange
      const image: Image = { id: 1, name: 'Image 1', path: '/assets/image1.jpg' };
      imageRepositoryMock.getImageById.mockResolvedValue(image);

      // Act
      const result = await imageService.getImageById('1');

      // Assert
      expect(result).toEqual(image);
      expect(imageRepositoryMock.getImageById).toHaveBeenCalledWith('1');
      expect(imageRepositoryMock.getImageById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError when image is not found', async () => {
      // Arrange
      imageRepositoryMock.getImageById.mockResolvedValue(undefined);

      // Act & Assert
      await expect(imageService.getImageById('999')).rejects.toThrow(NotFoundError);
      await expect(imageService.getImageById('999')).rejects.toThrow('Image not found');
      expect(imageRepositoryMock.getImageById).toHaveBeenCalledWith('999');
    });
  });

  describe('createImage', () => {
    it('should create a new image and return it', async () => {
      // Arrange
      const imageData = { name: 'Image 1', path: '/assets/image1.jpg' };
      const newImage: Image = { id: 1, ...imageData };
      imageRepositoryMock.createImage.mockResolvedValue([1]);

      // Act
      const result = await imageService.createImage(imageData);

      // Assert
      expect(result).toEqual(newImage);
      expect(imageRepositoryMock.createImage).toHaveBeenCalledWith(imageData);
      expect(imageRepositoryMock.createImage).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateImage', () => {
    it('should update an image successfully', async () => {
      // Arrange
      const updatedData: Partial<Image> = { name: 'Updated Image' };
      imageRepositoryMock.updateImage.mockResolvedValue(1);

      // Act
      const result = await imageService.updateImage('1', updatedData);

      // Assert
      expect(result).toEqual({ message: 'Image updated successfully' });
      expect(imageRepositoryMock.updateImage).toHaveBeenCalledWith('1', updatedData);
      expect(imageRepositoryMock.updateImage).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError when trying to update a non-existent image', async () => {
      // Arrange
      const updatedData: Partial<Image> = { name: 'Updated Image' };
      imageRepositoryMock.updateImage.mockResolvedValue(0);

      // Act & Assert
      await expect(imageService.updateImage('999', updatedData)).rejects.toThrow(NotFoundError);
      await expect(imageService.updateImage('999', updatedData)).rejects.toThrow('Image not found');
      expect(imageRepositoryMock.updateImage).toHaveBeenCalledWith('999', updatedData);
    });
  });

  describe('deleteImage', () => {
    it('should delete an image successfully', async () => {
      // Arrange
      imageRepositoryMock.deleteImage.mockResolvedValue(1);

      // Act
      const result = await imageService.deleteImage('1');

      // Assert
      expect(result).toEqual({ message: 'Image deleted successfully' });
      expect(imageRepositoryMock.deleteImage).toHaveBeenCalledWith('1');
      expect(imageRepositoryMock.deleteImage).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError when trying to delete a non-existent image', async () => {
      // Arrange
      imageRepositoryMock.deleteImage.mockResolvedValue(0);

      // Act & Assert
      await expect(imageService.deleteImage('999')).rejects.toThrow(NotFoundError);
      await expect(imageService.deleteImage('999')).rejects.toThrow('Image not found');
      expect(imageRepositoryMock.deleteImage).toHaveBeenCalledWith('999');
    });
  });
});
