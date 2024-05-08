// src/repositories/AstronautRepository.ts
import knex from '../db';

export interface Astronaut {
  id?: string;
  firstname: string;
  lastname: string;
  originPlanetId: string;
}

interface AstronautData {
  id: string;
  firstname: string;
  lastname: string;
  name: string;
  isHabitable: number;
  description: string;
  path: string;
  imageName: string;
}

interface PlanetData {
  id: string;
  isHabitable: number;
}

export class AstronautRepository {
  async getAllAstronauts(): Promise<AstronautData[]> {
    return await knex('astronauts')
      .select('astronauts.*', 'planets.name', 'planets.isHabitable', 'planets.description', 'images.path', 'images.name as imageName')
      .join('planets', 'planets.id', '=', 'astronauts.originPlanetId')
      .join('images', 'images.id', '=', 'planets.imageId');
  }

  async getAstronautById(id: string): Promise<AstronautData | undefined> {
    return await knex('astronauts')
      .select('astronauts.*', 'planets.*', 'images.path', 'images.name as imageName')
      .join('planets', 'planets.id', '=', 'astronauts.originPlanetId')
      .join('images', 'images.id', '=', 'planets.imageId')
      .where('astronauts.id', id)
      .first();
  }

  async createAstronaut(data: Partial<Omit<Astronaut, 'id'>>): Promise<number[]> {
    return await knex('astronauts').insert(data);
  }

  async updateAstronaut(id: string, data: Partial<Astronaut>): Promise<number> {
    return await knex('astronauts').where('id', id).update(data);
  }

  async deleteAstronaut(id: string): Promise<number> {
    return await knex('astronauts').where('id', id).del();
  }

  async getPlanetById(id: string): Promise<PlanetData | undefined> {
    return await knex('planets').select('id', 'isHabitable').where('id', id).first();
  }
}
