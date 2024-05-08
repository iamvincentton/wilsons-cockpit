import { PlanetRepository, Planet } from '../../../repositories/PlanetRepository';
import knex from '../../../db'; // Adjust the path according to your project structure
import { MockedFunction } from 'jest-mock';

jest.mock('../../../db');

const mockKnex = knex as MockedFunction<typeof knex>;

describe('PlanetRepository', () => {
  let planetRepository: PlanetRepository;

  beforeEach(() => {
    planetRepository = new PlanetRepository();
    jest.clearAllMocks(); // Clear previous mocks to avoid side effects
  });

  describe('getAllPlanets', () => {
    it('should return all planets', async () => {
      // Arrange
      const planets = [
        {
          id: '1',
          name: 'Earth',
          description: 'Blue Planet',
          isHabitable: 1,
          imageId: 'img1',
          path: '/images/earth.png',
          imageName: 'Earth Image',
        },
        {
          id: '2',
          name: 'Mars',
          description: 'Red Planet',
          isHabitable: 0,
          imageId: 'img2',
          path: '/images/mars.png',
          imageName: 'Mars Image',
        },
      ];

      mockKnex.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        join: jest.fn().mockReturnThis(),
        // where: jest.fn().mockReturnThis(),
        where: jest.fn().mockImplementation((callback: Function) => {
          callback({ where: jest.fn().mockReturnThis() });
          return planets;
        }),
      } as any);

      // Act
      const result = await planetRepository.getAllPlanets();

      // Assert
      expect(result).toEqual(planets);
      expect(mockKnex).toHaveBeenCalledWith('planets');
      expect(mockKnex().select).toHaveBeenCalledWith('planets.*', 'images.path', 'images.name as imageName');
      expect(mockKnex().join).toHaveBeenCalledWith('images', 'images.id', '=', 'planets.imageId');
    });

    it('should filter planets by name if provided', async () => {
      // Arrange
      const planets = [
        {
          id: '1',
          name: 'Earth',
          description: 'Blue Planet',
          isHabitable: 1,
          imageId: 'img1',
          path: '/images/earth.png',
          imageName: 'Earth Image',
        },
      ];

      mockKnex.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        join: jest.fn().mockReturnThis(),
        where: jest.fn().mockImplementation((callback: Function) => {
          callback({ where: jest.fn().mockReturnThis() });
          return planets;
        }),
      } as any);

      // Act
      const result = await planetRepository.getAllPlanets('Earth');

      // Assert
      expect(result).toEqual(planets);
      expect(mockKnex).toHaveBeenCalledWith('planets');
      expect(mockKnex().select).toHaveBeenCalledWith('planets.*', 'images.path', 'images.name as imageName');
      expect(mockKnex().join).toHaveBeenCalledWith('images', 'images.id', '=', 'planets.imageId');
    });
  });

  describe('getPlanetById', () => {
    it('should return a planet by ID', async () => {
      // Arrange
      const planet = {
        id: '1',
        name: 'Earth',
        description: 'Blue Planet',
        isHabitable: 1,
        imageId: 'img1',
        path: '/images/earth.png',
        imageName: 'Earth Image',
      };

      mockKnex.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        join: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(planet),
      } as any);

      // Act
      const result = await planetRepository.getPlanetById('1');

      // Assert
      expect(result).toEqual(planet);
      expect(mockKnex).toHaveBeenCalledWith('planets');
      expect(mockKnex().select).toHaveBeenCalledWith('planets.*', 'images.path', 'images.name as imageName');
      expect(mockKnex().join).toHaveBeenCalledWith('images', 'images.id', '=', 'planets.imageId');
      expect(mockKnex().where).toHaveBeenCalledWith('planets.id', '1');
      expect(mockKnex().first).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if planet not found', async () => {
      // Arrange
      mockKnex.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        join: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(undefined),
      } as any);

      // Act
      const result = await planetRepository.getPlanetById('999');

      // Assert
      expect(result).toBeUndefined();
      expect(mockKnex).toHaveBeenCalledWith('planets');
      expect(mockKnex().select).toHaveBeenCalledWith('planets.*', 'images.path', 'images.name as imageName');
      expect(mockKnex().join).toHaveBeenCalledWith('images', 'images.id', '=', 'planets.imageId');
      expect(mockKnex().where).toHaveBeenCalledWith('planets.id', '999');
      expect(mockKnex().first).toHaveBeenCalledTimes(1);
    });
  });

  describe('createPlanet', () => {
    it('should insert a new planet and return its ID', async () => {
      // Arrange
      const newPlanet: Partial<Omit<Planet, 'id'>> = {
        name: 'New Planet',
        description: 'Test Planet',
        isHabitable: true,
        imageId: 'img3',
      };

      mockKnex.mockReturnValue({
        insert: jest.fn().mockResolvedValue([1]),
      } as any);

      // Act
      const result = await planetRepository.createPlanet(newPlanet);

      // Assert
      expect(result).toEqual([1]);
      expect(mockKnex).toHaveBeenCalledWith('planets');
      expect(mockKnex().insert).toHaveBeenCalledWith(newPlanet);
    });
  });

  describe('updatePlanet', () => {
    it('should update a planet and return the number of affected rows', async () => {
      // Arrange
      const updatedPlanet: Partial<Planet> = {
        name: 'Updated Planet',
        description: 'Updated Description',
      };

      mockKnex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(1),
      } as any);

      // Act
      const result = await planetRepository.updatePlanet('1', updatedPlanet);

      // Assert
      expect(result).toEqual(1);
      expect(mockKnex).toHaveBeenCalledWith('planets');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '1');
      expect(mockKnex().update).toHaveBeenCalledWith(updatedPlanet);
    });

    it('should return 0 if planet not found', async () => {
      // Arrange
      const updatedPlanet: Partial<Planet> = {
        name: 'Updated Planet',
        description: 'Updated Description',
      };

      mockKnex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(0),
      } as any);

      // Act
      const result = await planetRepository.updatePlanet('999', updatedPlanet);

      // Assert
      expect(result).toEqual(0);
      expect(mockKnex).toHaveBeenCalledWith('planets');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '999');
      expect(mockKnex().update).toHaveBeenCalledWith(updatedPlanet);
    });
  });

  describe('deletePlanet', () => {
    it('should delete a planet and return the number of affected rows', async () => {
      // Arrange
      mockKnex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        del: jest.fn().mockResolvedValue(1),
      } as any);

      // Act
      const result = await planetRepository.deletePlanet('1');

      // Assert
      expect(result).toEqual(1);
      expect(mockKnex).toHaveBeenCalledWith('planets');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '1');
      expect(mockKnex().del).toHaveBeenCalledTimes(1);
    });

    it('should return 0 if planet not found', async () => {
      // Arrange
      mockKnex.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        del: jest.fn().mockResolvedValue(0),
      } as any);

      // Act
      const result = await planetRepository.deletePlanet('999');

      // Assert
      expect(result).toEqual(0);
      expect(mockKnex).toHaveBeenCalledWith('planets');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '999');
      expect(mockKnex().del).toHaveBeenCalledTimes(1);
    });
  });

  describe('getImageById', () => {
    it('should return image details by ID', async () => {
      // Arrange
      const image = {
        path: '/images/earth.png',
        name: 'Earth Image',
      };

      mockKnex.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(image),
      } as any);

      // Act
      const result = await planetRepository.getImageById('img1');

      // Assert
      expect(result).toEqual(image);
      expect(mockKnex).toHaveBeenCalledWith('images');
      expect(mockKnex().select).toHaveBeenCalledWith('path', 'name');
      expect(mockKnex().where).toHaveBeenCalledWith('id', 'img1');
      expect(mockKnex().first).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if image not found', async () => {
      // Arrange
      mockKnex.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(undefined),
      } as any);

      // Act
      const result = await planetRepository.getImageById('999');

      // Assert
      expect(result).toBeUndefined();
      expect(mockKnex).toHaveBeenCalledWith('images');
      expect(mockKnex().select).toHaveBeenCalledWith('path', 'name');
      expect(mockKnex().where).toHaveBeenCalledWith('id', '999');
      expect(mockKnex().first).toHaveBeenCalledTimes(1);
    });
  });
});
