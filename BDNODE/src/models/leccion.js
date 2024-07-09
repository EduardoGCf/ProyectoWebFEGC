import pool from '../config/db.js';

export const getAllLecciones = async () => {
    const [rows] = await pool.query('SELECT * FROM Leccion');
    return rows;
};

export const getLeccionesByCursoId = async (cursoId) => {
    const [rows] = await pool.query('SELECT * FROM Leccion WHERE idCurso = ?', [cursoId]);
    return rows;
};

export const getLeccionById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM Leccion WHERE idLeccion = ?', [id]);
    return rows[0];
};

export const createLeccion = async (leccion) => {
    const { idCurso, titulo, descripcion, contenidoTxt, contenidoVideo, banner } = leccion;
    const [result] = await pool.query('INSERT INTO Leccion (idCurso, titulo, descripcion, contenidoTxt, contenidoVideo, banner) VALUES (?, ?, ?, ?, ?, ?)', [idCurso, titulo, descripcion, contenidoTxt, contenidoVideo, banner]);
    return { id: result.insertId, ...leccion };
};

export const updateLeccion = async (id, leccion) => {
    const { idCurso, titulo, descripcion, contenidoTxt, contenidoVideo, banner } = leccion;
    await pool.query('UPDATE Leccion SET idCurso = ?, titulo = ?, descripcion = ?, contenidoTxt = ?, contenidoVideo = ?, banner = ? WHERE idLeccion = ?', [idCurso, titulo, descripcion, contenidoTxt, contenidoVideo, banner, id]);
    return { id, ...leccion };
};

export const deleteLeccion = async (id) => {
    await pool.query('DELETE FROM Leccion WHERE idLeccion = ?', [id]);
    return { message: 'Lección eliminada' };
};
