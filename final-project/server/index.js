import express from "express";
import db from "./db.js";
import authenticate from "./middleware/auth-middleware.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";
import userRoutes from "./userRoutes.js";
import eventsRouter from "./events.js";

// Get the current directory path using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "./.env") });

const app = express();

// Database connection
db.connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Specify the allowed origin
  })
);

app.use(userRoutes);

// Example of a protected route using authentication middleware
app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Basic route to check if API is running
app.get("/", (req, res) => res.send("API is running..."));

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static("uploads"));
app.use("/uploads/posters", express.static("posters"));
app.use("/events", eventsRouter);

// Start the server
const PORT = 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
