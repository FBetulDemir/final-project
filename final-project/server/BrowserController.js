import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const API_KEY = process.env.API_KEY; // La clave de la API de Google Maps

// Endpoint para agregar un evento
router.post('/events', async (req, res) => {
    const { artist, concert, location, address, date, ticketPrice, description, poster } = req.body;

    // Validación básica
    if (!address || !artist || !concert || !location || !date || !ticketPrice) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    try {
        // Geocodificación con la API de Google Maps
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
        const response = await axios.get(geocodeUrl);

        if (!response.data || response.data.status !== 'OK') {
            return res.status(400).json({ message: 'Address not found or geocoding failed' });
        }

        const { lat, lng } = response.data.results[0].geometry.location; // Usamos lat/lng del primer resultado

        // Responder con los datos geocodificados
        res.status(201).json({
            message: 'Geocoding successful',
            data: {
                artist,
                concert,
                location,
                address,
                latitude: parseFloat(lat),
                longitude: parseFloat(lng),
                date,
                ticketPrice,
                description,
                poster,
            },
        });
    } catch (error) {
        console.error('Error in geocoding:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Ruta de prueba para verificar el controlador
router.get('/test', (req, res) => {
    res.send('BrowserController is working!');
});

export default router;


