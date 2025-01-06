import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import Header from '../Header';
import EventSlider from './EventSlider';
import MainEventBanner from './MainEventBanner';
import GenreGrid from './GenreGrid';

const LandingPage: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(
                    'http://localhost:3002/events/get-events'
                );
                console.log('Fetch Response:', response);
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch events: ${response.statusText}`
                    );
                }
                const data = await response.json();
                console.log('Event Data:', data); // Log the full response data
                setEvents(data);
            } catch (err: any) {
                console.error('Fetch Error:', err);
                setError(
                    err.message || 'An error occurred while fetching events'
                );
            }
        };

        fetchEvents();
    }, []);

    const firstEvent = events[0];
    const remainingEvents = events.slice(1);

    return (
        <div className='landing-page'>
            <Header />
            {error && (
                <div style={{ color: 'red', margin: '1em 0' }}>
                    <p>Error: {error}</p>
                    <p>
                        Please try refreshing the page or contact support if the
                        problem persists.
                    </p>
                </div>
            )}
            {events.length === 0 && !error && (
                <p>No events available at the moment.</p>
            )}
            <div className='main-content'>
                {firstEvent && (
                    <MainEventBanner
                        eventName={firstEvent.EventName || 'Unknown Event'}
                        location={firstEvent.Location || 'Unknown Location'}
                        date={
                            firstEvent.DateTime
                                ? new Date(
                                      firstEvent.DateTime
                                  ).toLocaleDateString()
                                : 'Unknown Date'
                        }
                        poster={firstEvent.Poster || 'default-poster.png'}
                    />
                )}
                <EventSlider events={remainingEvents} />
                <GenreGrid />
            </div>
        </div>
    );
};

export default LandingPage;
