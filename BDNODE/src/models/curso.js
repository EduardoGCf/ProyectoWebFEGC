// models/cursos.js
import pool from '../config/db.js';

export const getAllCursos = async () => {
    const [rows] = await pool.query('SELECT * FROM Curso');
    return rows;
};

export const getCursoById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM Curso WHERE idCurso = ?', [id]);
    return rows[0];
};

export const createCurso = async (curso) => {
    const [result] = await pool.query('INSERT INTO Curso (nombre, descripcion, imagen, idCategoria) VALUES (?, ?, ?, ?)', [curso.nombre, curso.descripcion, curso.imagen, curso.idCategoria]);
    return { id: result.insertId, ...curso };
};

export const updateCurso = async (id, curso) => {
    const { nombre, descripcion, imagen, idCategoria } = curso;
    await pool.query('UPDATE Curso SET nombre = ?, descripcion = ?, imagen = ?, idCategoria = ? WHERE idCurso = ?', [nombre, descripcion, imagen, idCategoria, id]);
    return { id, ...curso };
};

export const deleteCurso = async (id) => {
    await pool.query('DELETE FROM Curso WHERE idCurso = ?', [id]);
    return { message: 'Curso eliminado' };
};
