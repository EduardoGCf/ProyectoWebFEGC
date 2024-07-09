import { getAllMatriculaciones, getMatriculacionById, createMatriculacion, updateMatriculacion, deleteMatriculacion } from '../models/matriculacion.js';
import pool from '../config/db.js';

export const getMatriculaciones = async (req, res) => {
    try {
        const matriculaciones = await getAllMatriculaciones();
        res.json(matriculaciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMatriculacion = async (req, res) => {
    const { idEstudiante, idCurso } = req.params;
    console.log('Verificando matriculación para:', idEstudiante, idCurso);

    try {
        const [rows] = await pool.query('SELECT * FROM Matriculacion WHERE idEstudiante = ? AND idCurso = ?', [idEstudiante, idCurso]);
        console.log('Resultado de la consulta:', rows);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Matriculación no encontrada' });
        }
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener la matriculación:', error);
        res.status(500).json({ message: 'Error al obtener la matriculación', error });
    }
};



export const addMatriculacion = async (req, res) => {
    const { idEstudiante, idCurso } = req.body;
    console.log('Intentando crear matriculación:', idEstudiante, idCurso); // Log para depuración

    try {
        const [result] = await pool.query('INSERT INTO Matriculacion (idEstudiante, idCurso) VALUES (?, ?)', [idEstudiante, idCurso]);
        console.log('Resultado de la inserción:', result); // Log para depuración
        if (result.affectedRows === 0) {
            return res.status(500).json({ message: 'Error al crear la matriculación' });
        }
        res.status(201).json({ message: 'Matriculación exitosa' });
    } catch (error) {
        console.error('Error al crear la matriculación:', error); // Log para depuración
        res.status(500).json({ message: 'Error al crear la matriculación', error });
    }
};


export const modifyMatriculacion = async (req, res) => {
    const { id } = req.params;
    const matriculacion = req.body;
    try {
        const matriculacionActualizada = await updateMatriculacion(id, matriculacion);
        res.json(matriculacionActualizada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeMatriculacion = async (req, res) => {
    const { idEstudiante, idCurso } = req.params;

    try {
        // Eliminar progresos relacionados y la matriculación
        const [progresoResult] = await pool.query(
            'DELETE FROM Progreso WHERE idEstudiante = ? AND idLeccion IN (SELECT idLeccion FROM leccion WHERE idCurso = ?)',
            [idEstudiante, idCurso]
        );
        const [matriculacionResult] = await pool.query(
            'DELETE FROM Matriculacion WHERE idEstudiante = ? AND idCurso = ?',
            [idEstudiante, idCurso]
        );

        if (matriculacionResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Matriculación no encontrada' });
        }

        res.status(200).json({ message: 'Desmatriculación exitosa' });
    } catch (error) {
        res.status(500).json({ message: 'Error al desmatricularse', error });
    }
};

export const getCursosMatriculados = async (req, res) => {
    const { id } = req.user; // Asegúrate de que el middleware de autenticación añade el `id` del usuario al request
    console.log('ID del estudiante:', id); // Log para verificar el ID del estudiante

    try {
        const [rows] = await pool.query(
            'SELECT c.idCurso, c.nombre, c.descripcion, c.imagen FROM Curso c JOIN Matriculacion m ON c.idCurso = m.idCurso WHERE m.idEstudiante = ?',
            [id]
        );
        console.log('Cursos matriculados:', rows); // Log para verificar los cursos obtenidos
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
