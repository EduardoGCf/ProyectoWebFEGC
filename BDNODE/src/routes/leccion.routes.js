import express from 'express';
import { getLecciones, getLeccion, addLeccion, modifyLeccion, removeLeccion } from '../controllers/leccion.controller.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getLecciones);
router.get('/:id', getLeccion);
router.post('/', verifyToken, isAdmin, addLeccion);
router.put('/:id', verifyToken, isAdmin, modifyLeccion);
router.delete('/:id', verifyToken, isAdmin, removeLeccion);

export default router;
