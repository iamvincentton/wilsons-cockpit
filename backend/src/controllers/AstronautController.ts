import { Request, Response } from 'express';
import knex from '../db';
// import Planet from '../entities/Planet';

const AstronautController = {
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const astronauts = (await knex('astronauts')
      .select('astronauts.*', 'planets.name', 'planets.description', 'planets.isHabitable', 'images.path', 'images.name as imageName')
      .join('planets', 'planets.id', '=', 'astronauts.originPlanetId')
      .join('images', 'images.id', '=', 'planets.imageId'))
      .map(({ id, firstname, lastname, name, isHabitable, description, path, imageName }) => ({
        id,
        firstname,
        lastname,
        originPlanet: {
          name,
          isHabitable: isHabitable === 1, // Convertion de 1/0 à true/false
          description,
          image: {
            path,
            name: imageName,
          },
        },
      }));
      res.status(200).json(astronauts);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const data = await knex('astronauts')
      .select('astronauts.*', 'planets.*', 'images.path', 'images.name as imageName')
      .join('planets', 'planets.id', '=', 'astronauts.originPlanetId')
      .join('images', 'images.id', '=', 'planets.imageId')
      .where('astronauts.id', id)
      .first();
      if (data) {
        res.status(200).json({
          id: data.id,
          firstname: data.firstname,
          lastname: data.lastname,
          originPlanet: {
            name: data.name,
            isHabitable: data.isHabitable === 1, // Convertion de 1/0 à true/false
            description: data.description,
            image: {
              path: data.path,
              name: data.imageName,
            },
          },
        });
      } else {
        res.status(404).json({ error: 'Astronaut not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  create: async (req: Request, res: Response): Promise<void> => {
    const { firstname, lastname, originPlanetId } = req.body;

    // Basic input validation
    if (!firstname || !lastname || !originPlanetId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    try {
      const planet = await findPlanet(originPlanetId);
      if (!planet) {
        res.status(400).json({ error: 'Origin planet not found' });
        return;
      }
      if (planet.isHabitable === 0) {
        res.status(400).json({ error: 'Astronauts can only come from habitable planets' });
        return;
      }

      const [id] = await knex.insert({ firstname, lastname, originPlanetId }).into('astronauts');

      res.status(200).json({
        id, firstname, lastname, originPlanetId,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { firstname, lastname, originPlanetId } = req.body;
    try {
      const astronaut = await knex('astronauts').where('id', id).first();
      if (!astronaut) {
        res.status(404).json({ error: 'Astronaut not found' });
        return;
      }

      const planet = await findPlanet(originPlanetId);
      if (!planet) {
        res.status(400).json({ error: 'Origin planet not found' });
        return;
      }

      if (planet.isHabitable === 0) {
        res.status(400).json({ error: 'Astronauts can only come from habitable planets' });
        return;
      }
      
      await knex('astronauts').where('id', id).update({ firstname, lastname, originPlanetId });
      res.status(200).json({ message: 'Astronaut updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const deletedRows = await knex('astronauts').where('id', id).del();
      if (deletedRows > 0) {
        res.status(200).json({ message: 'Astronaut deleted successfully' });
      } else {
        res.status(404).json({ error: 'Astronaut not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

async function findPlanet(id: number) {
  return await knex('planets')
    .select('planets.*', 'images.path', 'images.name as imageName')
    .join('images', 'images.id', '=', 'planets.imageId')
    .where('planets.id', id)
    .first();
}

export default AstronautController;
