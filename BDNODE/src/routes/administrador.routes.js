import express from 'express';
import { getAdministradores, getAdministrador, addAdministrador, modifyAdministrador, removeAdministrador } from '../controllers/administrador.controller.js';

const router = express.Router();

router.get('/', getAdministradores);
router.get('/:id', getAdministrador);
router.post('/', addAdministrador);
router.put('/:id', modifyAdministrador);
router.delete('/:id', removeAdministrador);

export default router;
