import pool from '../config/db.js';

export const getAllEstudiantes = async () => {
    const [rows] = await pool.query('SELECT * FROM Usuario WHERE tipoDeUsuario = "Estudiante"');
    return rows;
};

export const getEstudianteById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM Usuario WHERE idUsuario = ? AND tipoDeUsuario = "Estudiante"', [id]);
    return rows[0];
};

export const createEstudiante = async (estudiante) => {
    const { nombreUsuario, nombre, apellido, correoElectronico, contrasena } = estudiante;
    const tipoDeUsuario = "Estudiante";
    const [result] = await pool.query('INSERT INTO Usuario (nombreUsuario, nombre, apellido, correoElectronico, contrasena, tipoDeUsuario) VALUES (?, ?, ?, ?, ?, ?)', [nombreUsuario, nombre, apellido, correoElectronico, contrasena, tipoDeUsuario]);
    return { id: result.insertId, ...estudiante, tipoDeUsuario };
};

export const updateEstudiante = async (id, estudiante) => {
    const { nombreUsuario, nombre, apellido, correoElectronico, contrasena } = estudiante;
    const tipoDeUsuario = "Estudiante";
    await pool.query('UPDATE Usuario SET nombreUsuario = ?, nombre = ?, apellido = ?, correoElectronico = ?, contrasena = ?, tipoDeUsuario = ? WHERE idUsuario = ?', [nombreUsuario, nombre, apellido, correoElectronico, contrasena, tipoDeUsuario, id]);
    return { id, ...estudiante, tipoDeUsuario };
};

export const deleteEstudiante = async (id) => {
    await pool.query('DELETE FROM Usuario WHERE idUsuario = ? AND tipoDeUsuario = "Estudiante"', [id]);
    return { message: 'Estudiante eliminado' };
};
