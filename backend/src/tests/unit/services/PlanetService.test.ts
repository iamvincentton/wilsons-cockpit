// src/services/__tests__/AstronautService.test.ts
import { AstronautRepository, Astronaut } from '../../../repositories/AstronautRepository';
import { AstronautService, NotFoundError, BadRequestError } from '../../../services/AstronautService';

jest.mock('../../../repositories/AstronautRepository');

const mockAstronautRepository = new AstronautRepository() as jest.Mocked<AstronautRepository>;

describe('AstronautService', () => {
  let astronautService: AstronautService;

  beforeEach(() => {
    astronautService = new AstronautService(mockAstronautRepository);
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('getAllAstronauts', () => {
    it('should return all astronauts with mapped originPlanet properties', async () => {
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
      ];
      mockAstronautRepository.getAllAstronauts.mockResolvedValue(astronauts);

      // Act
      const result = await astronautService.getAllAstronauts();

      // Assert
      expect(result).toEqual([
        {
          id: '1',
          firstname: 'Neil',
          lastname: 'Armstrong',
          originPlanet: {
            name: 'Earth',
            isHabitable: true,
            description: 'Blue Planet',
            image: {
              path: '/images/earth.png',
              name: 'Earth Image',
            },
          },
        },
      ]);
      expect(mockAstronautRepository.getAllAstronauts).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAstronautById', () => {
    it('should return an astronaut by ID', async () => {
      // Arrange
      const astronaut = {
        id: '1',
        firstname: 'Neil',
        lastname: 'Armstrong',
        name: 'Earth',
        isHabitable: 1,
        description: 'Blue Planet',
        path: '/images/earth.png',
        imageName: 'Earth Image',
      };
      mockAstronautRepository.getAstronautById.mockResolvedValue(astronaut);

      // Act
      const result = await astronautService.getAstronautById('1');

      // Assert
      expect(result).toEqual({
        id: '1',
        firstname: 'Neil',
        lastname: 'Armstrong',
        originPlanet: {
          name: 'Earth',
          isHabitable: true,
          description: 'Blue Planet',
          image: {
            path: '/images/earth.png',
            name: 'Earth Image',
          },
        },
      });
      expect(mockAstronautRepository.getAstronautById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundError if astronaut is not found', async () => {
      // Arrange
      mockAstronautRepository.getAstronautById.mockResolvedValue(undefined);

      // Act & Assert
      await expect(astronautService.getAstronautById('999')).rejects.toThrow(NotFoundError);
      expect(mockAstronautRepository.getAstronautById).toHaveBeenCalledWith('999');
    });
  });

  describe('createAstronaut', () => {
    it('should create a new astronaut and return its ID', async () => {
      // Arrange
      const newAstronaut = {
        firstname: 'Buzz',
        lastname: 'Aldrin',
        originPlanetId: 'earth',
      };
      const planet = {
        id: 'earth',
        name: 'Earth',
        isHabitable: 1,
        description: 'Blue Planet',
        path: '/images/earth.png',
        imageName: 'Earth Image',
      };
      mockAstronautRepository.getPlanetById.mockResolvedValue(planet);
      mockAstronautRepository.createAstronaut.mockResolvedValue([1]);

      // Act
      const result = await astronautService.createAstronaut(newAstronaut);

      // Assert
      expect(result).toEqual({
        id: 1,
        ...newAstronaut,
      });
      expect(mockAstronautRepository.getPlanetById).toHaveBeenCalledWith('earth');
      expect(mockAstronautRepository.createAstronaut).toHaveBeenCalledWith(newAstronaut);
    });

    it('should throw NotFoundError if origin planet is not found', async () => {
      // Arrange
      const newAstronaut = {
        firstname: 'Buzz',
        lastname: 'Aldrin',
        originPlanetId: 'mars',
      };
      mockAstronautRepository.getPlanetById.mockResolvedValue(undefined);

      // Act & Assert
      await expect(astronautService.createAstronaut(newAstronaut)).rejects.toThrow(NotFoundError);
      expect(mockAstronautRepository.getPlanetById).toHaveBeenCalledWith('mars');
    });

    it('should throw BadRequestError if origin planet is not habitable', async () => {
      // Arrange
      const newAstronaut = {
        firstname: 'Buzz',
        lastname: 'Aldrin',
        originPlanetId: 'mars',
      };
      const planet = {
        id: 'mars',
        name: 'Mars',
        isHabitable: 0,
        description: 'Red Planet',
        path: '/images/mars.png',
        imageName: 'Mars Image',
      };
      mockAstronautRepository.getPlanetById.mockResolvedValue(planet);

      // Act & Assert
      await expect(astronautService.createAstronaut(newAstronaut)).rejects.toThrow(BadRequestError);
      expect(mockAstronautRepository.getPlanetById).toHaveBeenCalledWith('mars');
    });
  });

  describe('updateAstronaut', () => {
    it('should update an astronaut and return a success message', async () => {
      // Arrange
      const updatedAstronaut = {
        firstname: 'Buzz',
        lastname: 'Aldrin',
        originPlanetId: 'earth',
      };
      const planet = {
        id: 'earth',
        name: 'Earth',
        isHabitable: 1,
        description: 'Blue Planet',
        path: '/images/earth.png',
        imageName: 'Earth Image',
      };
      mockAstronautRepository.getPlanetById.mockResolvedValue(planet);
      mockAstronautRepository.updateAstronaut.mockResolvedValue(1);

      // Act
      const result = await astronautService.updateAstronaut('1', updatedAstronaut);

      // Assert
      expect(result).toEqual({ message: 'Astronaut updated successfully' });
      expect(mockAstronautRepository.getPlanetById).toHaveBeenCalledWith('earth');
      expect(mockAstronautRepository.updateAstronaut).toHaveBeenCalledWith('1', updatedAstronaut);
    });

    it('should throw NotFoundError if origin planet is not found', async () => {
      // Arrange
      const updatedAstronaut = {
        firstname: 'Buzz',
        lastname: 'Aldrin',
        originPlanetId: 'mars',
      };
      mockAstronautRepository.getPlanetById.mockResolvedValue(undefined);

      // Act & Assert
      await expect(astronautService.updateAstronaut('1', updatedAstronaut)).rejects.toThrow(NotFoundError);
      expect(mockAstronautRepository.getPlanetById).toHaveBeenCalledWith('mars');
    });

    it('should throw BadRequestError if origin planet is not habitable', async () => {
      // Arrange
      const updatedAstronaut = {
        firstname: 'Buzz',
        lastname: 'Aldrin',
        originPlanetId: 'mars',
      };
      const planet = {
        id: 'mars',
        name: 'Mars',
        isHabitable: 0,
        description: 'Red Planet',
        path: '/images/mars.png',
        imageName: 'Mars Image',
      };
      mockAstronautRepository.getPlanetById.mockResolvedValue(planet);

      // Act & Assert
      await expect(astronautService.updateAstronaut('1', updatedAstronaut)).rejects.toThrow(BadRequestError);
      expect(mockAstronautRepository.getPlanetById).toHaveBeenCalledWith('mars');
    });

    it('should throw NotFoundError if astronaut is not found', async () => {
      // Arrange
      const updatedAstronaut = {
        firstname: 'Buzz',
        lastname: 'Aldrin',
        originPlanetId: 'earth',
      };
      const planet = {
        id: 'earth',
        name: 'Earth',
        isHabitable: 1,
        description: 'Blue Planet',
        path: '/images/earth.png',
        imageName: 'Earth Image',
      };
      mockAstronautRepository.getPlanetById.mockResolvedValue(planet);
      mockAstronautRepository.updateAstronaut.mockResolvedValue(0);

      // Act & Assert
      await expect(astronautService.updateAstronaut('999', updatedAstronaut)).rejects.toThrow(NotFoundError);
      expect(mockAstronautRepository.getPlanetById).toHaveBeenCalledWith('earth');
      expect(mockAstronautRepository.updateAstronaut).toHaveBeenCalledWith('999', updatedAstronaut);
    });
  });

  describe('deleteAstronaut', () => {
    it('should delete an astronaut and return a success message', async () => {
      // Arrange
      mockAstronautRepository.deleteAstronaut.mockResolvedValue(1);

      // Act
      const result = await astronautService.deleteAstronaut('1');

      // Assert
      expect(result).toEqual({ message: 'Astronaut deleted successfully' });
      expect(mockAstronautRepository.deleteAstronaut).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundError if astronaut is not found', async () => {
      // Arrange
      mockAstronautRepository.deleteAstronaut.mockResolvedValue(0);

      // Act & Assert
      await expect(astronautService.deleteAstronaut('999')).rejects.toThrow(NotFoundError);
      expect(mockAstronautRepository.deleteAstronaut).toHaveBeenCalledWith('999');
    });
  });
});
