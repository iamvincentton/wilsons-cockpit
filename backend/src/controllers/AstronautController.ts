import { Request, Response } from 'express';
import { AstronautService, NotFoundError, BadRequestError } from '../services/AstronautService';
import { AstronautRepository } from '../repositories/AstronautRepository';

const astronautService = new AstronautService(new AstronautRepository());

const AstronautController = {
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const astronauts = await astronautService.getAllAstronauts();
      res.status(200).json(astronauts);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const astronaut = await astronautService.getAstronautById(id);
      res.status(200).json(astronaut);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  },

  create: async (req: Request, res: Response): Promise<void> => {
    const { firstname, lastname, originPlanetId } = req.body;

    if (!firstname || !lastname || !originPlanetId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    try {
      const astronaut = await astronautService.createAstronaut({ firstname, lastname, originPlanetId });
      res.status(201).json(astronaut);
    } catch (error) {
      if (error instanceof BadRequestError) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { firstname, lastname, originPlanetId } = req.body;

    try {
      const result = await astronautService.updateAstronaut(id, { firstname, lastname, originPlanetId });
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof BadRequestError) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const result = await astronautService.deleteAstronaut(id);
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

export default AstronautController;
