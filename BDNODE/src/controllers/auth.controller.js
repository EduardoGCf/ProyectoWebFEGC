import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

export const login = async (req, res) => {
    const { correoElectronico, contrasena } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM Usuario WHERE correoElectronico = ?', [correoElectronico]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const match = await bcrypt.compare(contrasena, user.contrasena);
        if (!match) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user.idUsuario, tipoDeUsuario: user.tipoDeUsuario, nombreUsuario: user.nombreUsuario},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Token creado:', token);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Asegúrate de cambiar a 'true' en producción con HTTPS
            maxAge: 3600000, // 1 hora
            sameSite: 'Lax'
        });

        res.json({ message: 'Inicio de sesión exitoso', token }); // Aquí enviamos el token en la respuesta JSON
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Cierre de sesión exitoso' });
};

// Verificar si el correo electrónico ya existe
export const checkEmailExists = async (req, res) => {
    const { email } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM Usuario WHERE correoElectronico = ?', [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado' });
        }
        res.json({ message: 'El correo electrónico está disponible' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Registro de usuario
export const register = async (req, res) => {
    const { nombreUsuario, nombre, apellido, correoElectronico, contrasena } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM Usuario WHERE correoElectronico = ?', [correoElectronico]);
        if (rows.length > 0) {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        await pool.query('INSERT INTO Usuario (nombreUsuario, nombre, apellido, correoElectronico, contrasena) VALUES (?, ?, ?, ?, ?)', 
                        [nombreUsuario, nombre, apellido, correoElectronico, hashedPassword]);

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};