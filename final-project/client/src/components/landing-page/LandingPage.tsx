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
                    'http://localhost:3002/api/events'
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                setEvents(data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchEvents();
    }, []);

    const firstEvent = events[0];
    const remainingEvents = events.slice(1);

    return (
        <div className='landing-page'>
            <Header />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className='main-content'>
                {firstEvent && (
                    <MainEventBanner
                        eventName={firstEvent.EventName}
                        location={firstEvent.Location || 'Unknown Location'}
                        date={new Date(
                            firstEvent.DateTime
                        ).toLocaleDateString()}
                        poster={firstEvent.Poster || ''}
                    />
                )}
                <EventSlider events={remainingEvents} />
                <GenreGrid />
            </div>
        </div>
    );
};

export default LandingPage;
