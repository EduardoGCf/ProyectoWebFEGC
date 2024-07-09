import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, no se encontró el token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.tipoDeUsuario !== 'Administrador') {
        return res.status(403).json({ message: 'Acceso denegado: No eres administrador' });
    }
    next();
};
