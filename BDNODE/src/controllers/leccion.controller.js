import { getAllLecciones, getLeccionesByCursoId, getLeccionById, createLeccion, updateLeccion, deleteLeccion } from '../models/Leccion.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const getLecciones = async (req, res) => {
    const { cursoId } = req.query;
    try {
        let lecciones;
        if (cursoId) {
            lecciones = await getLeccionesByCursoId(cursoId);
        } else {
            lecciones = await getAllLecciones();
        }
        res.json(lecciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLeccion = async (req, res) => {
    const { id } = req.params;
    try {
        const leccion = await getLeccionById(id);
        if (leccion) {
            if (leccion.banner) {
                leccion.banner = leccion.banner.toString('base64');
            }
            if (leccion.contenidoTxt) {
                leccion.contenidoTxt = leccion.contenidoTxt.toString('base64');
            }
            res.json(leccion);
        } else {
            res.status(404).json({ message: 'Lección no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addLeccion = [
    async (req, res) => {
        const { idCurso, titulo, descripcion, contenidoVideo } = req.body;
        const contenidoTxt = null;
        const banner = '../img/default-lesson.jpg';
        const leccion = { idCurso, titulo, descripcion, contenidoTxt, contenidoVideo, banner };
        try {
            const nuevaLeccion = await createLeccion(leccion);
            res.status(201).json(nuevaLeccion);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];

export const modifyLeccion = [
    upload.fields([{ name: 'contenidoTxt' }, { name: 'banner' }]),
    async (req, res) => {
        const leccionActual = await getLeccionById(req.params.id);
        const { id } = req.params;
        let { titulo, descripcion, contenidoVideo } = req.body;
        const contenidoTxt = req.files['contenidoTxt'] ? req.files['contenidoTxt'][0].buffer : (req.body.borrarContenidoTxt === 'true' ? null : leccionActual.contenidoTxt);
        const banner = req.files['banner'] ? req.files['banner'][0].buffer : leccionActual.banner;
        let idCurso = leccionActual.idCurso;
        const leccion = { idCurso, titulo, descripcion, contenidoTxt, contenidoVideo, banner };
        try {
            const leccionActualizada = await updateLeccion(id, leccion);
            res.json(leccionActualizada);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];

export const removeLeccion = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await deleteLeccion(id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
