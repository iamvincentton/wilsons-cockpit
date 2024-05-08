// src/controllers/PlanetController.ts
import { Request, Response } from 'express';
import { PlanetService, NotFoundError } from '../services/PlanetService';
import { PlanetRepository } from '../repositories/PlanetRepository';

const planetService = new PlanetService(new PlanetRepository());

const PlanetController = {
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.query;
      const planets = await planetService.getAllPlanets(name as string);
      res.status(200).json(planets);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const planet = await planetService.getPlanetById(id);
      res.status(200).json(planet);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  },

  create: async (req: Request, res: Response): Promise<void> => {
    const { name, description, isHabitable, imageId } = req.body;
    try {
      const planet = await planetService.createPlanet({ name, description, isHabitable, imageId });
      res.status(201).json(planet);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, description, isHabitable, imageId } = req.body;
    try {
      const result = await planetService.updatePlanet(id, { name, description, isHabitable, imageId });
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
      const result = await planetService.deletePlanet(id);
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

export default PlanetController;
