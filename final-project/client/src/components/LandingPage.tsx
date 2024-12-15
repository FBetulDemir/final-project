import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import Header from './Header';
import EventSlider from './EventSlider';
import MainEventBanner from './MainEventBanner';
import GenreGrid from './GenreGrid';

interface EventData {
    id: string;
    name: string;
    location: string;
    date: string;
    image: string;
}

const LandingPage: React.FC = () => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [city, setCity] = useState<string>('Los Angeles');

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:5000/api/events?countryCode=US&segmentId=KZFzniwnSyZfZ7v7nJ&city=${city}`
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
    }, [city]);

    const mainEvent = events[0];
    const otherEvents = events.slice(1);

    return (
        <div className='landing-page'>
            <Header />
            <section className='music-section'>
                <div className='music-content'>
                    <h1>Discover Amazing Music Events</h1>
                    <p>
                        Browse concerts and music festivals happening near you.
                    </p>
                    <input
                        type='text'
                        placeholder='Enter a city (e.g., Los Angeles)'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className='city-input'
                    />
                </div>
            </section>

            {loading ? (
                <p>Loading events...</p>
            ) : events.length > 0 ? (
                <>
                    <h2 className='current-city-info'>
                        All the music events in {city}
                    </h2>
                    <MainEventBanner event={mainEvent} />
                    <div className='bottom-content'>
                        <section className='events'>
                            <h2>Featured Events</h2>
                            <EventSlider events={otherEvents} />
                        </section>
                        <section className='genre-section'>
                            <h2>Explore by Genre</h2>
                            <GenreGrid />
                        </section>
                    </div>
                </>
            ) : (
                <p>No events found for the specified city.</p>
            )}
        </div>
    );
};

export default LandingPage;
