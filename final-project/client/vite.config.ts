import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";

// Load the `.env` file from a specific path
dotenv.config({ path: "../server/.env" }); // Replace with the correct path to your .env file

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env, // Pass the loaded variables into the application
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
});
