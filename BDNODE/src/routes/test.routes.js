import express from 'express';

const router = express.Router();

router.get('/check-cookie', (req, res) => {
    const token = req.cookies.token;
    if (token) {
        res.json({ message: 'Cookie recibida', token });
    } else {
        res.status(401).json({ message: 'No se encontró la cookie' });
    }
});

export default router;
