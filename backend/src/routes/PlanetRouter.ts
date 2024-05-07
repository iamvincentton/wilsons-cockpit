import express from 'express';
import PlanetController from '../controllers/PlanetController';

const router = express.Router();

router.get('/', PlanetController.getAll);
router.get('/:id', PlanetController.getById);
router.post('/', PlanetController.create);
router.put('/:id', PlanetController.update);
router.delete('/:id', PlanetController.delete);

export default router;
