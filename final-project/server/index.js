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

// Obtener el directorio actual usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "./.env") });

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
app.use(
  cors({
    origin: "http://localhost:5173", // Specify the allowed origin
  })
);

app.use(userRoutes);

// Ruta protegida de ejemplo
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
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
