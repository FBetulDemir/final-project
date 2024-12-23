import express from "express";
import bcrypt from "bcrypt";
import db from "./db.js"; // Assuming the User model is in the 'models' directory
import jwt from "jsonwebtoken";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname } from "path";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "./.env") });

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // specify the directory where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    ); // Generate unique filename
  },
});

const upload = multer({ storage: storage });

// Register new user
router.post(
  "/api/register",
  upload.single("ProfilePicture"),
  async (req, res) => {
    const { Username, Password, Email, UserType, Latitude, Longitude } =
      req.body;
    const profilePicture = req.file; // The uploaded file will be available here

    try {
      // Check if the user already exists by Username or Email
      const existingUser = await db.User.findOne({
        $or: [{ Username }, { Email }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username or Email already in use" });
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
        UserType: UserType || "Regular",
        Latitude,
        Longitude,
        ProfilePicture: profilePicture
          ? `/uploads/${profilePicture.filename}`
          : null, // Store the file path in DB
      });

      // Save the user to the database
      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.UserId, username: newUser.Username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Respond with success message and the user info (excluding the password)
      res.status(201).json({
        message: "User registered successfully",
        user: {
          UserId: newUser.UserId,
          Username: newUser.Username,
          Email: newUser.Email,
          profilePictureUrl: newUser.profilePicture, // Send the image URL in the response
        },
        token, // Include token for authentication
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    }
  }
);

// Login user
router.post("/api/login", async (req, res) => {
  const { Username, Password } = req.body;

  try {
    // Check if the user exists by Username
    const user = await db.User.findOne({ Username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(Password, user.PasswordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.UserId, username: user.Username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with the user details and token
    res.status(200).json({
      message: "Login successful",
      user: {
        UserId: user.UserId,
        Username: user.Username,
        Email: user.Email,
        profilePictureUrl: user.ProfilePicture,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

export default router;
