import { Router } from 'express';
import { getCursos, getCurso, addCurso, editCurso, removeCurso } from '../controllers/curso.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/', getCursos);
router.get('/:id', getCurso);
router.post('/', verifyToken, upload.single('imagen'), addCurso);
router.put('/:id', verifyToken, upload.single('imagen'), editCurso);
router.delete('/:id', verifyToken, removeCurso);

export default router;
