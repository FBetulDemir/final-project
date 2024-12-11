import express from 'express';
import db from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authenticate from './middleware/auth-middleware.js'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current directory path using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

db.connectDB()

// Middleware
app.use(express.json());

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { Username, Password, Email, UserType, Latitude, Longitude } = req.body;

  try {
    // Check if the user already exists by Username or Email
    const existingUser = await db.User.findOne({ $or: [{ Username }, { Email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already in use' });
    }

    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Create new user
    const newUser = new db.User({
      UserId: new mongoose.Types.ObjectId(),
      Username,
      PasswordHash: hashedPassword,
      Email,
      UserType: UserType || UserType.Regular,
      Latitude,
      Longitude,
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
      },
      token, // Include token for authentication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

console.log(process.env.JWT_SECRET)


// Example of a protected route using authentication middleware
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Basic route to check if API is running
app.get('/', (req, res) => res.send('API is running...'));

// Start the server
const PORT = 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
