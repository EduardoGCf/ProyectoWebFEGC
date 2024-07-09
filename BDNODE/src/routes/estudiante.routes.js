import express from 'express';
import { getEstudiantes, getEstudiante, addEstudiante, modifyEstudiante, removeEstudiante } from '../controllers/estudiante.controller.js';

const router = express.Router();

router.get('/', getEstudiantes);
router.get('/:id', getEstudiante);
router.post('/', addEstudiante);
router.put('/:id', modifyEstudiante);
router.delete('/:id', removeEstudiante);

export default router;
