import pool from '../config/db.js';
import bcrypt from 'bcrypt';
export const getAllUsuarios = async () => {
    const [rows] = await pool.query('SELECT * FROM Usuario');
    return rows;
};

export const getUsuarioById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM Usuario WHERE idUsuario = ?', [id]);
    return rows[0];
};

export const createUsuario = async (usuario) => {
    const { nombreUsuario, nombre, apellido, correoElectronico, contrasena, tipoDeUsuario } = usuario;
    const [result] = await pool.query('INSERT INTO Usuario (nombreUsuario, nombre, apellido, correoElectronico, contrasena, tipoDeUsuario) VALUES (?, ?, ?, ?, ?, ?)', [nombreUsuario, nombre, apellido, correoElectronico, contrasena, tipoDeUsuario]);
    return { id: result.insertId, ...usuario };
};

export const updateUsuario = async (id, usuario) => {
    const { nombreUsuario, nombre, apellido, correoElectronico, contrasena, tipoDeUsuario } = usuario;
    await pool.query('UPDATE Usuario SET nombreUsuario = ?, nombre = ?, apellido = ?, correoElectronico = ?, contrasena = ?, tipoDeUsuario = ? WHERE idUsuario = ?', [nombreUsuario, nombre, apellido, correoElectronico, contrasena, tipoDeUsuario, id]);
    return { id, ...usuario };
};

export const deleteUsuario = async (id) => {
    await pool.query('DELETE FROM Usuario WHERE idUsuario = ?', [id]);
    return { message: 'Usuario eliminado' };
};

// Función para obtener el usuario por correo electrónico
export const getUserByEmail = async (correoElectronico) => {
    const [rows] = await pool.query('SELECT * FROM Usuario WHERE correoElectronico = ?', [correoElectronico]);
    return rows[0];
};

// Función para validar la contraseña del usuario
export const validatePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};