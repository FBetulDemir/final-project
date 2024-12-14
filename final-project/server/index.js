import express from 'express';
import db from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authenticate from './middleware/auth-middleware.js'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import multer from 'multer';

// Get the current directory path using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

// Database connection
db.connectDB();

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the directory where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Generate unique filename
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',  // Specify the allowed origin
}));

// Register endpoint with profile picture upload
app.post('/api/register', upload.single('ProfilePicture'), async (req, res) => {
  const { Username, Password, Email, UserType, Latitude, Longitude } = req.body;
  const profilePicture = req.file;  // The uploaded file will be available here

  try {
    // Check if the user already exists by Username or Email
    const existingUser = await db.User.findOne({ $or: [{ Username }, { Email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already in use' });
    }

    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Create new user with profile picture path or URL
    const newUser = new db.User({
      UserId: new mongoose.Types.ObjectId(),
      Username,
      PasswordHash: hashedPassword,
      Email,
      UserType: UserType || 'Regular',
      Latitude,
      Longitude,
      ProfilePicture: profilePicture ? `/uploads/${profilePicture.filename}` : null,  // Store the file path in DB
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.UserId, username: newUser.Username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respond with success message and the user info (excluding the password)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        UserId: newUser.UserId,
        Username: newUser.Username,
        Email: newUser.Email,
        profilePictureUrl: newUser.profilePicture,  // Send the image URL in the response
      },
      token,  // Include token for authentication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Example of a protected route using authentication middleware
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Basic route to check if API is running
app.get('/', (req, res) => res.send('API is running...'));

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Start the server
const PORT = 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
