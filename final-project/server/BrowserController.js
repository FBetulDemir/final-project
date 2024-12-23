import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import db from './db.js'; // Assuming the Event model is exported from db.js

dotenv.config();

const router = express.Router();
const API_KEY = process.env.API_KEY; // Ensure this is defined in your .env file

// Endpoint to fetch all events
router.get('/events', async (req, res) => {
    try {
        const events = await db.Event.find(); // Use the Event model to fetch all events
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).json({
            message: 'Failed to fetch events',
            error: error.message,
        });
    }
});

// Endpoint to add a new event (already implemented)
router.post('/events', async (req, res) => {
    const {
        artist,
        concert,
        location,
        address,
        date,
        ticketPrice,
        description,
        poster,
    } = req.body;

    if (!address || !artist || !concert || !location || !date || !ticketPrice) {
        return res
            .status(400)
            .json({ message: 'All required fields must be provided' });
    }

    try {
        const geocodeUrl = `https://your-new-geocoding-api.com/geocode?address=${encodeURIComponent(
            address
        )}&key=${API_KEY}`;
        const response = await axios.get(geocodeUrl);

        if (!response.data || response.data.status !== 'success') {
            return res
                .status(400)
                .json({ message: 'Address not found or geocoding failed' });
        }

        const { latitude, longitude } = response.data;

        // Save the new event to the database
        const newEvent = new db.Event({
            EventId: `${Date.now()}`, // Unique EventId
            MusicianId: '123', // Example MusicianId; replace as needed
            EventName: concert,
            Genre: 'Rock', // Default Genre; replace as needed
            Description: description || null,
            Latitude: parseFloat(latitude),
            Longitude: parseFloat(longitude),
            DateTime: date,
            TicketPrice: parseFloat(ticketPrice),
            MaxAttendees: 100, // Default value; replace as needed
            Poster: poster || null,
        });

        await newEvent.save();

        res.status(201).json({
            message: 'Event added successfully',
            event: newEvent,
        });
    } catch (error) {
        console.error('Error in geocoding or saving event:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Test route to verify the controller
router.get('/test', (req, res) => {
    res.send('BrowserController is working!');
});

export default router;
