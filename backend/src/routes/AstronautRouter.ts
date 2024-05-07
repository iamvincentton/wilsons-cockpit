// src/routes/AstronautRouter.ts
import express from 'express';
import AstronautController from '../controllers/AstronautController';

const router = express.Router();

router.get('/', AstronautController.getAll);
router.get('/:id', AstronautController.getById);
router.post('/', AstronautController.create);
router.put('/:id', AstronautController.update);
router.delete('/:id', AstronautController.delete);

export default router;
