import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import multer from 'multer';
import BrowserController from './BrowserController.js';
import db from './db.js';
import authenticate from './middleware/auth-middleware.js';

db.connectDB()

// Obtener el directorio actual usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 3002;

// Conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error.message));

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3002', // Especificar el origen permitido
}));
app.use('/uploads', express.static('uploads'));

// Rutas del controlador Browser
app.use('/api', BrowserController);

// Endpoint para registrar usuarios con carga de imagen de perfil
app.post('/api/register', upload.single('ProfilePicture'), async (req, res) => {
  const { Username, Password, Email, UserType, Latitude, Longitude } = req.body;
  const profilePicture = req.file;

  try {
    const existingUser = await db.User.findOne({ $or: [{ Username }, { Email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const newUser = new db.User({
      UserId: new mongoose.Types.ObjectId(),
      Username,
      PasswordHash: hashedPassword,
      Email,
      UserType: UserType || 'Regular',
      Latitude,
      Longitude,
      ProfilePicture: profilePicture ? `/uploads/${profilePicture.filename}` : null,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser.UserId, username: newUser.Username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        UserId: newUser.UserId,
        Username: newUser.Username,
        Email: newUser.Email,
        profilePictureUrl: newUser.ProfilePicture,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Ruta protegida de ejemplo
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Ruta básica para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
