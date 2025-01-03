import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Obtener el directorio actual usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });


const router = express.Router();

// Endpoint to fetch events from Ticketmaster API
router.get('/api/events', async (req, res) => {
    const {
        countryCode = 'US',
        segmentId = 'KZFzniwnSyZfZ7v7nJ',
        city = 'Los Angeles',
    } = req.query;

    console.log('Incoming request with query:', {
        countryCode,
        segmentId,
        city,
    });

    try {
        const response = await axios.get(
            'https://app.ticketmaster.com/discovery/v2/events.json',
            {
                params: {
                    apikey: process.env.VITE_TICKETMASTER_API_KEY,
                    countryCode,
                    segmentId,
                    city,
                },
            }
        );

        console.log('Response from Ticketmaster API:', response.data);

        if (!response.data._embedded) {
            res.json([]);
            return;
        }

        const events = response.data._embedded.events;
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error.message);
        if (error.response) {
            console.error('Error response details:', error.response.data);
        }
        res.status(500).json({ error: 'Error fetching events' });
    }
});

console.log('API Key:', process.env.VITE_TICKETMASTER_API_KEY);

export default router;
