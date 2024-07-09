import { getAllCursos, getCursoById, createCurso, updateCurso, deleteCurso } from '../models/curso.js';

export const getCursos = async (req, res) => {
    try {
        const cursos = await getAllCursos();
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener cursos' });
    }
};

export const getCurso = async (req, res) => {
    const { id } = req.params;
    try {
        const curso = await getCursoById(id);
        if (curso) {
            if (curso.imagen) {
                curso.imagen = curso.imagen.toString('base64');
            }
            res.json(curso);
        } else {
            res.status(404).json({ message: 'Curso no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener curso' });
    }
};

export const addCurso = async (req, res) => {
    const { nombre, descripcion, idCategoria } = req.body;
    let imagen = null;

    if (req.file) {
        imagen = req.file.buffer; // Usar buffer para almacenar la imagen como Blob
    }

    try {
        const newCurso = await createCurso({ nombre, descripcion, imagen, idCategoria });
        res.status(201).json(newCurso);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear curso', error });
    }
};

export const editCurso = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, idCategoria } = req.body;
    let imagen = null;

    // Obtener la imagen actual si no se proporciona una nueva
    const cursoActual = await getCursoById(id);
    if (req.file) {
        imagen = req.file.buffer; // Usar buffer para almacenar la imagen como Blob
    } else {
        imagen = cursoActual.imagen; // Mantener la imagen existente
    }

    console.log('Datos recibidos para actualización:', { nombre, descripcion, idCategoria, imagen });

    try {
        const updatedCurso = await updateCurso(id, { nombre, descripcion, imagen, idCategoria });
        res.json(updatedCurso);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar curso', error });
    }
};

export const removeCurso = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteCurso(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: `Error al eliminar curso ${error}` });
    }
};
