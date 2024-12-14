import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import Header from './Header';

interface EventData {
    id: number;
    artist: string;
    location: string;
    city: string;
    date: string;
    genre: string;
    image: string;
}

const LandingPage: React.FC = () => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch event data from an API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('https://api.example.com/events');
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching event data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className='landing-page'>
            <Header />
            <section className='hero'>
                <div className='hero-content'>
                    <h1>Discover Amazing Events</h1>
                    <p>
                        Browse concerts, festivals, and shows happening near
                        you.
                    </p>
                </div>
            </section>

            <section className='events'>
                <h2>Upcoming Events</h2>
                {loading ? (
                    <p>Loading events...</p>
                ) : (
                    <div className='event-grid'>
                        {events.map((event) => (
                            <div key={event.id} className='event-card'>
                                <img src={event.image} alt={event.artist} />
                                <h3>{event.artist}</h3>
                                <p>{event.location}</p>
                                <p>{event.city}</p>
                                <p>{event.date}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default LandingPage;
