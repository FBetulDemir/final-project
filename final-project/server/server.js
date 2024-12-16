import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './BrowserController.js'; // Asegúrate de que la extensión sea .js

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Rutas
app.use('/api', router); // Ajuste para que las rutas sean accesibles desde /api

// Ruta básica
app.get('/', (req, res) => res.send('API is running...'));

// Iniciar servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
