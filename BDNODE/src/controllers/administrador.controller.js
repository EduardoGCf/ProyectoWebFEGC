import { getAllAdministradores, getAdministradorById, createAdministrador, updateAdministrador, deleteAdministrador } from '../models/administrador.js';

export const getAdministradores = async (req, res) => {
    try {
        const administradores = await getAllAdministradores();
        res.json(administradores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAdministrador = async (req, res) => {
    const { id } = req.params;
    try {
        const administrador = await getAdministradorById(id);
        if (administrador) {
            res.json(administrador);
        } else {
            res.status(404).json({ message: 'Administrador no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addAdministrador = async (req, res) => {
    const administrador = req.body;
    try {
        const nuevoAdministrador = await createAdministrador(administrador);
        res.status(201).json(nuevoAdministrador);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const modifyAdministrador = async (req, res) => {
    const { id } = req.params;
    const administrador = req.body;
    try {
        const administradorActualizado = await updateAdministrador(id, administrador);
        res.json(administradorActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeAdministrador = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await deleteAdministrador(id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
