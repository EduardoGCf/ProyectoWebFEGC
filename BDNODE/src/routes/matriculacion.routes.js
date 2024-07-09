import express from 'express';
import { getMatriculaciones, getMatriculacion, addMatriculacion, modifyMatriculacion, removeMatriculacion, getCursosMatriculados } from '../controllers/matriculacion.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/mis-cursos', verifyToken, getCursosMatriculados);
router.get('/', getMatriculaciones);
router.get('/:idEstudiante/:idCurso', getMatriculacion);
router.post('/', verifyToken, addMatriculacion);
router.put('/:id', modifyMatriculacion);
router.delete('/:idEstudiante/:idCurso', verifyToken, removeMatriculacion);

export default router;
