import { Request, Response } from 'express';
import { ImageService, NotFoundError } from '../services/ImageService';
import { ImageRepository } from '../repositories/ImageRepository';

const imageService = new ImageService(new ImageRepository());

const ImageController = {
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const images = await imageService.getAllImages();
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const image = await imageService.getImageById(id);
      res.status(200).json(image);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  },

  create: async (req: Request, res: Response): Promise<void> => {
    const { name, path } = req.body;
    try {
      const image = await imageService.createImage({ name, path });
      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, path } = req.body;
    try {
      const result = await imageService.updateImage(id, { name, path });
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const result = await imageService.deleteImage(id);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  },
};

export default ImageController;
