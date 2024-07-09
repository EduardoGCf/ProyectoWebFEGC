import pool from '../config/db.js';

export const getAllMatriculaciones = async () => {
    const [rows] = await pool.query('SELECT * FROM Matriculacion');
    return rows;
};

export const getMatriculacionById = async (idEstudiante, idCurso) => {
    const [rows] = await pool.query('SELECT * FROM Matriculacion WHERE idEstudiante = ? AND idCurso = ?', [idEstudiante, idCurso]);
    return rows[0];
};


export const createMatriculacion = async (matriculacion) => {
    const { idEstudiante, idCurso } = matriculacion;
    let fechaInscripcion = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await pool.query('INSERT INTO Matriculacion (idEstudiante, fechaInscripcion, idCurso) VALUES (?, ?, ?)', [idEstudiante, fechaInscripcion, idCurso]);
    return { id: result.insertId, ...matriculacion };
};

export const updateMatriculacion = async (id, matriculacion) => {
    const { idEstudiante, fechaInscripcion, idCurso } = matriculacion;
    await pool.query('UPDATE Matriculacion SET idEstudiante = ?, fechaInscripcion = ?, idCurso = ? WHERE idMatriculacion = ?', [idEstudiante, fechaInscripcion, idCurso, id]);
    return { id, ...matriculacion };
};

export const deleteMatriculacion = async (id) => {
    await pool.query('DELETE FROM Matriculacion WHERE idEstudiante = ?', [id]);
    return { message: 'Matriculación eliminada' };
};
