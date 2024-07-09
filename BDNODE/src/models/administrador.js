import pool from '../config/db.js';

export const getAllAdministradores = async () => {
    const [rows] = await pool.query('SELECT * FROM Usuario WHERE tipoDeUsuario = "Administrador"');
    return rows;
};

export const getAdministradorById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM Usuario WHERE idUsuario = ? AND tipoDeUsuario = "Administrador"', [id]);
    return rows[0];
};

export const createAdministrador = async (administrador) => {
    const { nombreUsuario, nombre, apellido, correoElectronico, contrasena } = administrador;
    const tipoDeUsuario = "Administrador";
    const [result] = await pool.query('INSERT INTO Usuario (nombreUsuario, nombre, apellido, correoElectronico, contrasena, tipoDeUsuario) VALUES (?, ?, ?, ?, ?, ?)', [nombreUsuario, nombre, apellido, correoElectronico, contrasena, tipoDeUsuario]);
    return { id: result.insertId, ...administrador, tipoDeUsuario };
};

export const updateAdministrador = async (id, administrador) => {
    const { nombreUsuario, nombre, apellido, correoElectronico, contrasena } = administrador;
    const tipoDeUsuario = "Administrador";
    await pool.query('UPDATE Usuario SET nombreUsuario = ?, nombre = ?, apellido = ?, correoElectronico = ?, contrasena = ?, tipoDeUsuario = ? WHERE idUsuario = ?', [nombreUsuario, nombre, apellido, correoElectronico, contrasena, tipoDeUsuario, id]);
    return { id, ...administrador, tipoDeUsuario };
};

export const deleteAdministrador = async (id) => {
    await pool.query('DELETE FROM Usuario WHERE idUsuario = ? AND tipoDeUsuario = "Administrador"', [id]);
    return { message: 'Administrador eliminado' };
};
