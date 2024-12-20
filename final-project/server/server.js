import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BrowserController from './BrowserController';

import cors from 'cors';

dotenv.config(); // Cargar las variables de entorno del archivo .env
app.use(cors());

const app = express();
const port = process.env.PORT || 3002; // Usa el puerto de .env o el 3002 por defecto

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

// Rutas
app.use('/api', BrowserController); // Asegúrate de que el controlador de eventos esté importado correctamente

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
