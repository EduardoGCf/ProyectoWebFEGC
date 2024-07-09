import express from 'express';
import { getProgresos, getProgreso, addProgreso, modifyProgreso, removeProgreso } from '../controllers/progreso.controller.js';

const router = express.Router();

router.get('/', getProgresos);
router.get('/:idCurso/:idUsuario', getProgreso);
router.post('/', addProgreso);
router.put('/:id', modifyProgreso);
router.delete('/:id', removeProgreso);

export default router;
