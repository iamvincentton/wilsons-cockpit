import { AstronautRepository, Astronaut } from '../repositories/AstronautRepository';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class AstronautService {
  private astronautRepository: AstronautRepository;

  constructor(astronautRepository: AstronautRepository) {
    this.astronautRepository = astronautRepository;
  }

  async getAllAstronauts(): Promise<any[]> {
    const astronauts = await this.astronautRepository.getAllAstronauts();
    return astronauts.map(({ id, firstname, lastname, name, isHabitable, description, path, imageName }) => ({
      id,
      firstname,
      lastname,
      originPlanet: {
        name,
        isHabitable: isHabitable === 1,
        description,
        image: {
          path,
          name: imageName,
        },
      },
    }));
  }

  async getAstronautById(id: string): Promise<any> {
    const data = await this.astronautRepository.getAstronautById(id);
    if (!data) {
      throw new NotFoundError('Astronaut not found');
    }
    return {
      id: data.id,
      firstname: data.firstname,
      lastname: data.lastname,
      originPlanet: {
        name: data.name,
        isHabitable: data.isHabitable === 1,
        description: data.description,
        image: {
          path: data.path,
          name: data.imageName,
        },
      },
    };
  }

  async createAstronaut(data: Partial<Omit<Astronaut, 'id'>>): Promise<any> {
    const planet = await this.astronautRepository.getPlanetById(data.originPlanetId!);
    if (!planet) {
      throw new NotFoundError('Origin planet not found');
    }
    if (planet.isHabitable === 0) {
      throw new BadRequestError('Astronauts can only be associated with habitable planets');
    }

    const [id] = await this.astronautRepository.createAstronaut(data);
    return { id, ...data };
  }

  async updateAstronaut(id: string, data: Partial<Astronaut>): Promise<{ message: string }> {
    const planet = await this.astronautRepository.getPlanetById(data.originPlanetId!);
    if (!planet) {
      throw new NotFoundError('Origin planet not found');
    }
    if (planet.isHabitable === 0) {
      throw new BadRequestError('Astronauts can only be associated with habitable planets');
    }

    const updatedRows = await this.astronautRepository.updateAstronaut(id, data);
    if (updatedRows === 0) {
      throw new NotFoundError('Astronaut not found');
    }
    return { message: 'Astronaut updated successfully' };
  }

  async deleteAstronaut(id: string): Promise<{ message: string }> {
    const deletedRows = await this.astronautRepository.deleteAstronaut(id);
    if (deletedRows === 0) {
      throw new NotFoundError('Astronaut not found');
    }
    return { message: 'Astronaut deleted successfully' };
  }
}
