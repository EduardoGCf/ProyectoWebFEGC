import pool from '../config/db.js';

export const getAllProgresos = async () => {
    const [rows] = await pool.query('SELECT * FROM Progreso');
    return rows;
};

export const getProgresoById = async (idCurso, idUsuario) => {
    const [rows] = await pool.query('SELECT * FROM Progreso WHERE idEstudiante = ? AND idLeccion IN (SELECT idLeccion FROM leccion WHERE idCurso = ?)', [idUsuario, idCurso]);
    return rows;
};


/*export const createProgreso = async (progreso) => {
    const { idEstudiante, idLeccion } = progreso;
    const fechaProgreso = new Date();
    const [result] = await pool.query('INSERT INTO Progreso (idEstudiante, idLeccion, fechaProgreso) VALUES (?, ?, ?)', [idEstudiante, idLeccion, fechaProgreso]);
    return { id: result.insertId, ...progreso };
};
*/


export const createProgreso = async (progreso) => {
    const { idEstudiante, idLeccion } = progreso;

    try {
        // Verificar si el progreso ya existe
        const [existingProgress] = await pool.query('SELECT * FROM Progreso WHERE idEstudiante = ? AND idLeccion = ?', [idEstudiante, idLeccion]);

        if (existingProgress.length > 0) {
            return ;
        }

        // Crear nuevo progreso si no existe
        await pool.query('INSERT INTO Progreso (idEstudiante, idLeccion,fechaProgreso) VALUES (?, ?, ?)', [idEstudiante, idLeccion, new Date()]);
        return { id: result.insertId, ...progreso };
    } catch (error) {
        console.error('Error al crear el progreso:', error);
        return ;
    }
};


export const updateProgreso = async (id, progreso) => {
    const { idEstudiante, idLeccion, fechaProgreso } = progreso;
    await pool.query('UPDATE Progreso SET idEstudiante = ?, idLeccion = ?, fechaProgreso = ? WHERE idProgreso = ?', [idEstudiante, idLeccion, fechaProgreso, id]);
    return { id, ...progreso };
};

export const deleteProgreso = async (id) => {
    await pool.query('DELETE FROM Progreso WHERE idProgreso = ?', [id]);
    return { message: 'Progreso eliminado' };
};
