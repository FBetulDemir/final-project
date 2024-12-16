import express from 'express';
import bcrypt from 'bcrypt';
import { User, UserType } from '../models/User'; // Assuming the User model is in the 'models' directory
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  const { Username, Password, Email, UserType, Latitude, Longitude } = req.body;

  try {
    // Check if user with the same username or email already exists
    const existingUser = await User.findOne({ $or: [{ Username }, { Email }] });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already in use' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Create new user
    const newUser = new User({
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

    // Generate JWT token (optional, for authentication)
    const token = jwt.sign(
      { userId: newUser.UserId, username: newUser.Username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        UserId: newUser.UserId,
        Username: newUser.Username,
        Email: newUser.Email,
      },
      token, // Include token in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

export default router;
