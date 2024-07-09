import { getAllProgresos, getProgresoById, createProgreso, updateProgreso, deleteProgreso } from '../models/progreso.js';

export const getProgresos = async (req, res) => {
    try {
        const progresos = await getAllProgresos();
        res.json(progresos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProgreso = async (req, res) => {
    const { idCurso, idUsuario } = req.params;
    try {
        const progresos = await getProgresoById(idCurso, idUsuario);
        console.log(progresos);
        res.json(progresos); 

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const addProgreso = async (req, res) => {
    const progreso = req.body;
    try {
        const nuevoProgreso = await createProgreso(progreso);
        res.status(201).json(nuevoProgreso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const modifyProgreso = async (req, res) => {
    const { id } = req.params;
    const progreso = req.body;
    try {
        const progresoActualizado = await updateProgreso(id, progreso);
        res.json(progresoActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeProgreso = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await deleteProgreso(id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
