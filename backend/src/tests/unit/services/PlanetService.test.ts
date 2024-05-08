import { PlanetRepository, Planet, PlanetData } from '../../../repositories/PlanetRepository';
import { PlanetService, NotFoundError } from '../../../services/PlanetService';

jest.mock('../../../repositories/PlanetRepository');

const mockPlanetRepository = new PlanetRepository() as jest.Mocked<PlanetRepository>;

describe('PlanetService', () => {
  let planetService: PlanetService;

  beforeEach(() => {
    planetService = new PlanetService(mockPlanetRepository);
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('getAllPlanets', () => {
    it('should return all planets with mapped image properties', async () => {
      // Arrange
      const planets: PlanetData[] = [
        {
          id: '1',
          name: 'Earth',
          isHabitable: 1,
          description: 'Blue Planet',
          path: '/images/earth.png',
          imageName: 'Earth Image',
          imageId: '1',
        },
        {
          id: '2',
          name: 'Mars',
          isHabitable: 0,
          description: 'Red Planet',
          path: '/images/mars.png',
          imageName: 'Mars Image',
          imageId: '2',
        },
      ];
      mockPlanetRepository.getAllPlanets.mockResolvedValue(planets);

      // Act
      const result = await planetService.getAllPlanets();

      // Assert
      expect(result).toEqual([
        {
          id: '1',
          name: 'Earth',
          isHabitable: true,
          description: 'Blue Planet',
          image: {
            path: '/images/earth.png',
            name: 'Earth Image',
          },
        },
        {
          id: '2',
          name: 'Mars',
          isHabitable: false,
          description: 'Red Planet',
          image: {
            path: '/images/mars.png',
            name: 'Mars Image',
          },
        },
      ]);
      expect(mockPlanetRepository.getAllPlanets).toHaveBeenCalledTimes(1);
    });

    it('should filter planets by name if provided', async () => {
      // Arrange
      const planets: PlanetData[] = [
        {
          id: '1',
          name: 'Earth',
          isHabitable: 1,
          description: 'Blue Planet',
          path: '/images/earth.png',
          imageName: 'Earth Image',
          imageId: '1',
        },
      ];
      mockPlanetRepository.getAllPlanets.mockResolvedValue(planets);

      // Act
      const result = await planetService.getAllPlanets('Earth');

      // Assert
      expect(result).toEqual([
        {
          id: '1',
          name: 'Earth',
          isHabitable: true,
          description: 'Blue Planet',
          image: {
            path: '/images/earth.png',
            name: 'Earth Image',
          },
        },
      ]);
      expect(mockPlanetRepository.getAllPlanets).toHaveBeenCalledWith('Earth');
      expect(mockPlanetRepository.getAllPlanets).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPlanetById', () => {
    it('should return a planet by ID', async () => {
      // Arrange
      const planet: PlanetData = {
        id: '1',
        name: 'Earth',
        isHabitable: 1,
        description: 'Blue Planet',
        path: '/images/earth.png',
        imageName: 'Earth Image',
        imageId: '1',
      };
      mockPlanetRepository.getPlanetById.mockResolvedValue(planet);

      // Act
      const result = await planetService.getPlanetById('1');

      // Assert
      expect(result).toEqual({
        id: '1',
        name: 'Earth',
        isHabitable: true,
        description: 'Blue Planet',
        image: {
          path: '/images/earth.png',
          name: 'Earth Image',
        },
      });
      expect(mockPlanetRepository.getPlanetById).toHaveBeenCalledWith('1');
      expect(mockPlanetRepository.getPlanetById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError if planet is not found', async () => {
      // Arrange
      mockPlanetRepository.getPlanetById.mockResolvedValue(undefined);

      // Act & Assert
      await expect(planetService.getPlanetById('999')).rejects.toThrow(NotFoundError);
      expect(mockPlanetRepository.getPlanetById).toHaveBeenCalledWith('999');
      expect(mockPlanetRepository.getPlanetById).toHaveBeenCalledTimes(1);
    });
  });

  describe('createPlanet', () => {
    it('should create a new planet and return its ID', async () => {
      // Arrange
      const newPlanet: Partial<Omit<Planet, 'id'>> = {
        name: 'New Planet',
        description: 'New Description',
        isHabitable: true,
        imageId: 'img1',
      };
      const image = {
        path: '/images/earth.png',
        name: 'Earth Image',
      };
      mockPlanetRepository.getImageById.mockResolvedValue(image);
      mockPlanetRepository.createPlanet.mockResolvedValue([1]);

      // Act
      const result = await planetService.createPlanet(newPlanet);

      // Assert
      expect(result).toEqual({ id: 1, ...newPlanet });
      expect(mockPlanetRepository.getImageById).toHaveBeenCalledWith('img1');
      expect(mockPlanetRepository.getImageById).toHaveBeenCalledTimes(1);
      expect(mockPlanetRepository.createPlanet).toHaveBeenCalledWith(newPlanet);
      expect(mockPlanetRepository.createPlanet).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError if image is not found', async () => {
      // Arrange
      const newPlanet: Partial<Omit<Planet, 'id'>> = {
        name: 'New Planet',
        description: 'New Description',
        isHabitable: true,
        imageId: 'img1',
      };
      mockPlanetRepository.getImageById.mockResolvedValue(undefined);

      // Act & Assert
      await expect(planetService.createPlanet(newPlanet)).rejects.toThrow(NotFoundError);
      expect(mockPlanetRepository.getImageById).toHaveBeenCalledWith('img1');
      expect(mockPlanetRepository.getImageById).toHaveBeenCalledTimes(1);
    });
  });

  describe('updatePlanet', () => {
    it('should update a planet and return a success message', async () => {
      // Arrange
      const updatedPlanet: Partial<Planet> = {
        name: 'Updated Planet',
        description: 'Updated Description',
        isHabitable: true,
        imageId: 'img1',
      };
      const image = {
        path: '/images/earth.png',
        name: 'Earth Image',
      };
      mockPlanetRepository.getImageById.mockResolvedValue(image);
      mockPlanetRepository.updatePlanet.mockResolvedValue(1);

      // Act
      const result = await planetService.updatePlanet('1', updatedPlanet);

      // Assert
      expect(result).toEqual({ message: 'Planet updated successfully' });
      expect(mockPlanetRepository.getImageById).toHaveBeenCalledWith('img1');
      expect(mockPlanetRepository.getImageById).toHaveBeenCalledTimes(1);
      expect(mockPlanetRepository.updatePlanet).toHaveBeenCalledWith('1', updatedPlanet);
      expect(mockPlanetRepository.updatePlanet).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError if image is not found', async () => {
      // Arrange
      const updatedPlanet: Partial<Planet> = {
        name: 'Updated Planet',
        description: 'Updated Description',
        isHabitable: true,
        imageId: 'img1',
      };
      mockPlanetRepository.getImageById.mockResolvedValue(undefined);

      // Act & Assert
      await expect(planetService.updatePlanet('1', updatedPlanet)).rejects.toThrow(NotFoundError);
      expect(mockPlanetRepository.getImageById).toHaveBeenCalledWith('img1');
      expect(mockPlanetRepository.getImageById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError if planet is not found', async () => {
      // Arrange
      const updatedPlanet: Partial<Planet> = {
        name: 'Updated Planet',
        description: 'Updated Description',
        isHabitable: true,
        imageId: 'img1',
      };
      const image = {
        path: '/images/earth.png',
        name: 'Earth Image',
      };
      mockPlanetRepository.getImageById.mockResolvedValue(image);
      mockPlanetRepository.updatePlanet.mockResolvedValue(0);

      // Act & Assert
      await expect(planetService.updatePlanet('999', updatedPlanet)).rejects.toThrow(NotFoundError);
      expect(mockPlanetRepository.getImageById).toHaveBeenCalledWith('img1');
      expect(mockPlanetRepository.getImageById).toHaveBeenCalledTimes(1);
      expect(mockPlanetRepository.updatePlanet).toHaveBeenCalledWith('999', updatedPlanet);
      expect(mockPlanetRepository.updatePlanet).toHaveBeenCalledTimes(1);
    });
  });

  describe('deletePlanet', () => {
    it('should delete a planet and return a success message', async () => {
      // Arrange
      mockPlanetRepository.deletePlanet.mockResolvedValue(1);

      // Act
      const result = await planetService.deletePlanet('1');

      // Assert
      expect(result).toEqual({ message: 'Planet deleted successfully' });
      expect(mockPlanetRepository.deletePlanet).toHaveBeenCalledWith('1');
      expect(mockPlanetRepository.deletePlanet).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError if planet is not found', async () => {
      // Arrange
      mockPlanetRepository.deletePlanet.mockResolvedValue(0);

      // Act & Assert
      await expect(planetService.deletePlanet('999')).rejects.toThrow(NotFoundError);
      expect(mockPlanetRepository.deletePlanet).toHaveBeenCalledWith('999');
      expect(mockPlanetRepository.deletePlanet).toHaveBeenCalledTimes(1);
    });
  });
});
