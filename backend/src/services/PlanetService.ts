import { PlanetRepository, Planet } from '../repositories/PlanetRepository';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class PlanetService {
  private planetRepository: PlanetRepository;

  constructor(planetRepository: PlanetRepository) {
    this.planetRepository = planetRepository;
  }

  async getAllPlanets(name?: string): Promise<any[]> {
    const planets = await this.planetRepository.getAllPlanets(name);
    return planets.map(({ id, name, isHabitable, description, path, imageName }) => ({
      id,
      name,
      isHabitable: isHabitable === 1,
      description,
      image: {
        path,
        name: imageName,
      },
    }));
  }

  async getPlanetById(id: string): Promise<any> {
    const data = await this.planetRepository.getPlanetById(id);
    if (!data) {
      throw new NotFoundError('Planet not found');
    }
    return {
      id: data.id,
      name: data.name,
      isHabitable: data.isHabitable === 1,
      description: data.description,
      image: {
        path: data.path,
        name: data.imageName,
      },
    };
  }

  async createPlanet(data: Partial<Omit<Planet, 'id'>>): Promise<any> {
    const image = await this.planetRepository.getImageById(data.imageId!);  
    if (!image) {
      throw new NotFoundError('Image not found');
    }

    const [id] = await this.planetRepository.createPlanet(data);
    return { id, ...data };
  }

  async updatePlanet(id: string, data: Partial<Planet>): Promise<{ message: string }> {
    const image = await this.planetRepository.getImageById(data.imageId!);  
    if (!image) {
      throw new NotFoundError('Image not found');
    }

    const updatedRows = await this.planetRepository.updatePlanet(id, data);
    if (updatedRows === 0) {
      throw new NotFoundError('Planet not found');
    }
    return { message: 'Planet updated successfully' };
  }

  async deletePlanet(id: string): Promise<{ message: string }> {
    const deletedRows = await this.planetRepository.deletePlanet(id);
    if (deletedRows === 0) {
      throw new NotFoundError('Planet not found');
    }
    return { message: 'Planet deleted successfully' };
  }
}
