import knex from '../../../db';
import { MockedFunction } from 'jest-mock';
import { AstronautRepository, Astronaut, AstronautData, PlanetData } from '../../../repositories/AstronautRepository';

jest.mock('../../../db');

const mockKnex = knex as MockedFunction<typeof knex>;

describe('AstronautRepository', () => {
  let astronautRepository: AstronautRepository;

  beforeEach(() => {
    astronautRepository = new AstronautRepository();
    jest.clearAllMocks(); // Clear previous mocks to avoid side effects
  });

  describe('getAllAstronauts', () => {
    it('should return all astronauts with associated planet and image data', async () => {
      // Arrange
      const astronauts = [
        {
          id: '1',
          firstname: 'Neil',
          lastname: 'Armstrong',
          name: 'Earth',
          isHabitable: 1,
          description: 'Blue Planet',
          path: '/images/earth.png',
          imageName: 'Earth Image',
        },
        {
          id: '2',
          firstname: 'Buzz',
          lastname: 'Aldrin',
          name: 'Mars',
          isHabitable: 0,
          description: 'Red Planet',
          path: '/images/mars.png',
          imageName: 'Mars Image',
        },
      ];

      mockKnex.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        join: jest.fn().mockResolvedValue(astronauts),
      } as any);

      // Act
      const result = await astronautRepository.getAllAstronauts();

      // Assert
      expect(result).toEqual(astronauts);
      expect(mockKnex).toHaveBeenCalledWith('astronauts');
      expect(mockKnex().select).toHaveBeenCalledWith(
        'astronauts.*',
        'planets.name',
        'planets.isHabitable',
        'planets.description',
        'images.path',
        'images.name as imageName',
      );
      expect(mockKnex().innerJoin).toHaveBeenCalledWith('planets', 'planets.id', '=', 'astronauts.originPlanetId');
      expect(mockKnex().join).toHaveBeenCalledWith('images', 'images.id', '=', 'planets.imageId');
    });
  });

  describe('getAstronautById', () => {
    it('should return an astronaut by ID', async () => {
      // Arrange
      const astronaut: AstronautData = {
        id: '1',
        firstname: 'Neil',
        lastname: 'Armstrong',
        name: 'Earth',
        isHabitable: 1,
        description: 'Blue Planet',
        path: '/images/earth.png',
        imageName: 'Earth Image',
      };

      mockKnex.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        join: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(astronaut),
      } as any);

      // Act
      const result = await astronautRepository.getAstronautById('1');

      // Assert
      expect(result).toEqual(astronaut);
      expect(mockKnex).toHaveBeenCalledWith('astronauts');
      expect(mockKnex().select).toHaveBeenCalledWith(
        'astronauts.*',
        'planets.*',
        'images.path',
        'images.name as imageName',
      );
      expect(mockKnex().join).toHaveBeenCalledWith('planets', 'planets.id', '=', 'astronauts.originPlanetId');
      expect(mockKnex().join).toHaveBeenCalledWith('images', 'images.id', '=', 'planets.imageId');
      expect(mockKnex().where).toHaveBeenCalledWith('astronauts.id', '1');
      expect(mockKnex().first).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if astronaut is not found', async () => {
      // Arrange
      mockKnex.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        join: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(undefined),
      } as any);

      // Act
      const result = await astronautRepository.getAstronautById('999');

      // Assert
      expect(result).toBeUndefined();
      expect(mockKnex).toHaveBeenCalledWith('astronauts');
      expect(mockKnex().select).toHaveBeenCalledWith(
        'astronauts.*',
        'planets.*',
        'images.path',
        'images.name as imageName',
      );
      expect(mockKnex().join).toHaveBeenCalledWith('planets', 'planets.id', '=', 'astronauts.originPlanetId');
      expect(mockKnex().join).toHaveBeenCalledWith('images', 'images.id', '=', 'planets.imageId');
      expect(mockKnex().where).toHaveBeenCalledWith('astronauts.id', '999');
      expect(mockKnex().first).toHaveBeenCalledTimes(1);
    });
  });

  describe('createAstronaut', () => {
    it('should insert a new astronaut and return its ID', async () => {
      // Arrange
      const newAstronaut: Partial<Omit<Astronaut, 'id'>> = {
        firstname: 'Buzz',
        lastname: 'Aldrin',
        originPlanetId: 'earth',
      };

      mockKnex.mockReturnValue({
        insert: jest.fn().mockResolvedValue([1]),
      } as any);

      // Act
      const result = await astronautRepository.createAstronaut(newAstronaut);

      // Assert
      expect(result).toEqual([1]);
      expect(mockKnex).toHaveBeenCalledWith('astronauts');
      expect(mockKnex().insert).toHaveBeenCalledWith(newAstronaut);
    });
  });

  describe('updateAstronaut', () => {
    it('should update an astronaut and return the number of affected rows', async () => {
      // Arrange
      const updatedAstronaut: Partial<Astronaut> = {
        firstname: 'Buzz',
        lastname: 'Aldrin',
        originPlanetId: 'mars',
      };

      mockKnex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(1),
      } as any);

      // Act
      const result = await astronautRepository.updateAstronaut('1', updatedAstronaut);

      // Assert
      expect(result).toEqual(1);
      expect(mockKnex).toHaveBeenCalledWith('astronauts');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '1');
      expect(mockKnex().update).toHaveBeenCalledWith(updatedAstronaut);
    });

    it('should return 0 if astronaut is not found', async () => {
      // Arrange
      const updatedAstronaut: Partial<Astronaut> = {
        firstname: 'Buzz',
        lastname: 'Aldrin',
        originPlanetId: 'mars',
      };

      mockKnex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(0),
      } as any);

      // Act
      const result = await astronautRepository.updateAstronaut('999', updatedAstronaut);

      // Assert
      expect(result).toEqual(0);
      expect(mockKnex).toHaveBeenCalledWith('astronauts');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '999');
      expect(mockKnex().update).toHaveBeenCalledWith(updatedAstronaut);
    });
  });

  describe('deleteAstronaut', () => {
    it('should delete an astronaut and return the number of affected rows', async () => {
      // Arrange
      mockKnex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        del: jest.fn().mockResolvedValue(1),
      } as any);

      // Act
      const result = await astronautRepository.deleteAstronaut('1');

      // Assert
      expect(result).toEqual(1);
      expect(mockKnex).toHaveBeenCalledWith('astronauts');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '1');
      expect(mockKnex().del).toHaveBeenCalledTimes(1);
    });

    it('should return 0 if astronaut is not found', async () => {
      // Arrange
      mockKnex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        del: jest.fn().mockResolvedValue(0),
      } as any);

      // Act
      const result = await astronautRepository.deleteAstronaut('999');

      // Assert
      expect(result).toEqual(0);
      expect(mockKnex).toHaveBeenCalledWith('astronauts');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '999');
      expect(mockKnex().del).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPlanetById', () => {
    it('should return a planet by ID', async () => {
      // Arrange
      const planet: PlanetData = {
        id: 'earth',
        isHabitable: 1,
      };

      mockKnex.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(planet),
      } as any);

      // Act
      const result = await astronautRepository.getPlanetById('earth');

      // Assert
      expect(result).toEqual(planet);
      expect(mockKnex).toHaveBeenCalledWith('planets');
      expect(mockKnex().select).toHaveBeenCalledWith('id', 'isHabitable');
      expect(mockKnex().where).toHaveBeenCalledWith('id', 'earth');
      expect(mockKnex().first).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if planet is not found', async () => {
      // Arrange
      mockKnex.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(undefined),
      } as any);

      // Act
      const result = await astronautRepository.getPlanetById('999');

      // Assert
      expect(result).toBeUndefined();
      expect(mockKnex).toHaveBeenCalledWith('planets');
      expect(mockKnex().select).toHaveBeenCalledWith('id', 'isHabitable');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '999');
      expect(mockKnex().first).toHaveBeenCalledTimes(1);
    });
  });
});
