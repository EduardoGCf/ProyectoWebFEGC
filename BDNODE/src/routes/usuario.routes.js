import express from 'express';
import { getUsuarios, getUsuario, addUsuario, modifyUsuario, removeUsuario } from '../controllers/usuario.controller.js';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getUsuarios);
router.get('/:id', getUsuario);
router.post('/', addUsuario);
router.put('/:id', modifyUsuario);
router.delete('/:id',isAdmin, removeUsuario);

export default router;
