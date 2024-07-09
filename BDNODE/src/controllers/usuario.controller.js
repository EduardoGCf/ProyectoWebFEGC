import { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from '../models/usuario.js';
import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    const { nombreUsuario, nombre, apellido, correoElectronico, contrasena, tipoDeUsuario = 'Estudiante' } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        const [result] = await pool.query('INSERT INTO Usuario (nombreUsuario, nombre, apellido, correoElectronico, contrasena, tipoDeUsuario) VALUES (?, ?, ?, ?, ?, ?)', [nombreUsuario, nombre, apellido, correoElectronico, hashedPassword, tipoDeUsuario]);
        res.status(201).json({ id: result.insertId, nombreUsuario, nombre, apellido, correoElectronico, tipoDeUsuario });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await getAllUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await getUsuarioById(id);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addUsuario = async (req, res) => {
    const usuario = req.body;
    try {
        const nuevoUsuario = await createUsuario(usuario);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const modifyUsuario = async (req, res) => {
    const { id } = req.params;
    const usuario = req.body;
    try {
        const usuarioActualizado = await updateUsuario(id, usuario);
        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await deleteUsuario(id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

