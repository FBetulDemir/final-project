import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GenrePage.css';
import Header from '../Header';

interface Event {
    id: string;
    name: string;
    location: string;
    date: string;
    image: string;
}

const GenrePage: React.FC = () => {
    const { genreName } = useParams<{ genreName: string }>();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:5000/api/events?countryCode=US&segmentId=KZFzniwnSyZfZ7v7nJ&genre=${genreName}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Error: ${response.status} ${response.statusText}`
                    );
                }

                const data = await response.json();
                const formattedEvents = data.map((event: any) => ({
                    id: event.id,
                    name: event.name,
                    location:
                        event._embedded?.venues[0]?.name || 'Unknown Location',
                    date: event.dates?.start?.localDate || 'Unknown Date',
                    image: event.images?.[0]?.url || '',
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Error fetching event data:', error.message);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [genreName]);

    return (
        <div className='genre-page'>
            <Header />
            <h1>{genreName} Events</h1>
            {loading ? (
                <p>Loading events...</p>
            ) : events.length > 0 ? (
                <div className='event-grid'>
                    {events.map((event) => (
                        <div key={event.id} className='event-card'>
                            <img src={event.image} alt={event.name} />
                            <h3>{event.name}</h3>
                            <p>{event.location}</p>
                            <p>{event.date}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No events found for this genre.</p>
            )}
            <button className='back-button' onClick={() => navigate(-1)}>
                Back to Genres
            </button>
        </div>
    );
};

export default GenrePage;
