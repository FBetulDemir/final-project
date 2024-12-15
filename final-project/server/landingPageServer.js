import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint to fetch events from Ticketmaster API
app.get('/api/events', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

console.log('API Key:', process.env.VITE_TICKETMASTER_API_KEY);
