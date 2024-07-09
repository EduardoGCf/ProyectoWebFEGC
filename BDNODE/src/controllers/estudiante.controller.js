import { getAllEstudiantes, getEstudianteById, createEstudiante, updateEstudiante, deleteEstudiante } from '../models/estudiante.js';

export const getEstudiantes = async (req, res) => {
    try {
        const estudiantes = await getAllEstudiantes();
        res.json(estudiantes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEstudiante = async (req, res) => {
    const { id } = req.params;
    try {
        const estudiante = await getEstudianteById(id);
        if (estudiante) {
            res.json(estudiante);
        } else {
            res.status(404).json({ message: 'Estudiante no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addEstudiante = async (req, res) => {
    const estudiante = req.body;
    try {
        const nuevoEstudiante = await createEstudiante(estudiante);
        res.status(201).json(nuevoEstudiante);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const modifyEstudiante = async (req, res) => {
    const { id } = req.params;
    const estudiante = req.body;
    try {
        const estudianteActualizado = await updateEstudiante(id, estudiante);
        res.json(estudianteActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeEstudiante = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await deleteEstudiante(id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
