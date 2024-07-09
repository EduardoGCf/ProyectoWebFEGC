import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import CursoRouter from './routes/curso.routes.js';
import UsuarioRouter from './routes/usuario.routes.js';
import ProgresoRouter from './routes/progreso.routes.js';
import MatriculacionRouter from './routes/matriculacion.routes.js';
import LeccionRouter from './routes/leccion.routes.js';
import AdministradorRouter from './routes/administrador.routes.js';
import EstudianteRouter from './routes/estudiante.routes.js';
import AuthRouter from './routes/auth.routes.js';
import CategoriaRouter from './routes/categoria.routes.js';
import ProfileRouter from './routes/profile.routes.js'; // Nueva ruta

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT ?? 4000;

app.get('/', (req, res) => {
    res.json({ message: 'API de cursos' });
});

// Rutas
app.use('/curso', CursoRouter);
app.use('/usuario', UsuarioRouter);
app.use('/progreso', ProgresoRouter);
app.use('/matriculacion', MatriculacionRouter);
app.use('/leccion', LeccionRouter);
app.use('/administrador', AdministradorRouter);
app.use('/estudiante', EstudianteRouter);
app.use('/auth', AuthRouter);
app.use('/categoria', CategoriaRouter);
app.use('/profile', ProfileRouter); // Nueva ruta

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores del servidor
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ message: 'Algo salió mal en el servidor' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
