import express from 'express';
import ImageController from '../controllers/ImageController';

const router = express.Router();

router.get('/', ImageController.getAll);
router.get('/:id', ImageController.getById);
router.post('/', ImageController.create);
router.put('/:id', ImageController.update);
router.delete('/:id', ImageController.delete);

export default router;
