import pool from '../config/db.js';

export const getAllCategorias = async () => {
    const [rows] = await pool.query('SELECT * FROM Categoria');
    return rows;
};

export const getCategoriaById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM Categoria WHERE idCategoria = ?', [id]);
    return rows[0];
};

export const createCategoria = async (categoria) => {
    const { nombre } = categoria;
    const [result] = await pool.query('INSERT INTO Categoria (nombre) VALUES (?)', [nombre]);
    return { id: result.insertId, ...categoria };
};

export const updateCategoria = async (id, categoria) => {
    const { nombre } = categoria;
    await pool.query('UPDATE Categoria SET nombre = ? WHERE idCategoria = ?', [nombre, id]);
    return { id, ...categoria };
};

export const deleteCategoria = async (id) => {
    await pool.query('DELETE FROM Categoria WHERE idCategoria = ?', [id]);
    return { message: 'Categoría eliminada' };
};
