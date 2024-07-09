import express from 'express';
import { getCategorias, createCategoria, getCategoriaByName, getCategoriaById,removeCategoria, modifyCategoria} from '../controllers/categoria.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',  getCategorias);
router.post('/', verifyToken, createCategoria);
router.delete('/:id', verifyToken, removeCategoria);
router.get('/nombre/:nombre', verifyToken, getCategoriaByName);
router.get('/:id', getCategoriaById); // Endpoint para obtener categoría por ID
router.put('/:id/:nombre', verifyToken, modifyCategoria); // Endpoint para modificar categoría por ID

export default router;
