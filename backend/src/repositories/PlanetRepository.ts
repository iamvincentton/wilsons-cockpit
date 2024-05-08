// src/repositories/PlanetRepository.ts
import knex from '../db';

export interface Planet {
  id?: string;
  name: string;
  description: string;
  isHabitable: boolean;
  imageId: string;
}

interface PlanetData {
  id: string;
  name: string;
  description: string;
  isHabitable: number;
  path: string;
  imageName: string;
  imageId: string;
}

export class PlanetRepository {
  async getAllPlanets(name?: string): Promise<PlanetData[]> {
    return await knex('planets')
      .select('planets.*', 'images.path', 'images.name as imageName')
      .join('images', 'images.id', '=', 'planets.imageId')
      .where((queryBuilder) => {
        if (name) {
          queryBuilder.where('planets.name', 'like', `%${name}%`);
        }
      });
  }

  async getPlanetById(id: string): Promise<PlanetData | undefined> {
    return await knex('planets')
      .select('planets.*', 'images.path', 'images.name as imageName')
      .join('images', 'images.id', '=', 'planets.imageId')
      .where('planets.id', id)
      .first();
  }

  async createPlanet(data: Partial<Omit<Planet, 'id'>>): Promise<number[]> {
    return await knex('planets').insert(data);
  }

  async updatePlanet(id: string, data: Partial<Planet>): Promise<number> {
    return await knex('planets').where('id', id).update(data);
  }

  async deletePlanet(id: string): Promise<number> {
    return await knex('planets').where('id', id).del();
  }

  async getImageById(id: string): Promise<{ path: string; name: string } | undefined> {
    return await knex('images').select('path', 'name').where('id', id).first();
  }
}
