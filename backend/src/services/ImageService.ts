import { ImageRepository } from '../repositories/ImageRepository';
import Image from '../entities/Image';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ImageService {
  private imageRepository: ImageRepository;

  constructor(imageRepository: ImageRepository) {
    this.imageRepository = imageRepository;
  }

  async getAllImages(): Promise<Image[]> {
    return await this.imageRepository.getAllImages();
  }

  async getImageById(id: string): Promise<Image> {
    const image = await this.imageRepository.getImageById(id);
    if (!image) {
      throw new NotFoundError('Image not found');
    }
    return image;
  }

  async createImage(data: any): Promise<Image> {
    const [id] = await this.imageRepository.createImage(data);
    return { id, ...data };
  }

  async updateImage(id: string, data: Partial<Image>): Promise<{ message: string }> {
    const updatedRows = await this.imageRepository.updateImage(id, data);
    if (updatedRows === 0) {
      throw new NotFoundError('Image not found');
    }
    return { message: 'Image updated successfully' };
  }

  async deleteImage(id: string): Promise<{ message: string }> {
    const deletedRows = await this.imageRepository.deleteImage(id);
    if (deletedRows === 0) {
      throw new NotFoundError('Image not found');
    }
    return { message: 'Image deleted successfully' };
  }
}
