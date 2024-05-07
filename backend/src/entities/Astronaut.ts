import Planet from './Planet';

interface Astronaut {
  id: number;
  firstname: string;
  lastname: string;
  originPlanet: Planet;
}

export default Astronaut;
