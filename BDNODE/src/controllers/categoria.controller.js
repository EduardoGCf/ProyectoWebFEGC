// src/controllers/categoria.controller.js

import pool from '../config/db.js';

export const getCategorias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Categoria');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías' });
    }
};

export const createCategoria = async (req, res) => {
    const { nombre } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO Categoria (nombre) VALUES (?)', [nombre]);
        res.status(201).json({ idCategoria: result.insertId, nombre });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear categoría' });
    }
};

export const getCategoriaByName = async (req, res) => {
    const { nombre } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM Categoria WHERE nombre = ?', [nombre]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categoría' });
    }
};

export const getCategoriaById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM Categoria WHERE idCategoria = ?', [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categoría' });
    }
};

export const removeCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE Curso SET idCategoria = NULL WHERE idCategoria = ?', [id]);

        await pool.query('DELETE FROM Categoria WHERE idCategoria = ?', [id]);
        res.json({ message: 'Categoría eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar categoría' });
    }
}

export const modifyCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.params;
    console.log('Datos recibidos para actualización:', { nombre }, { id});
    try {
        await pool.query('UPDATE Categoria SET nombre = ? WHERE idCategoria = ?', [nombre, id]);
        res.json({ idCategoria: id, nombre });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar categoría' });
    }
}
