import React from 'react';
import './MainEventBanner.css';

interface EventData {
    id: string;
    name: string;
    location: string;
    date: string;
    image: string;
}

const MainEventBanner: React.FC<{ event: EventData }> = ({ event }) => {
    return (
        <div className='main-banner'>
            <div className='banner-image-container'>
                <img
                    src={event.image}
                    alt={event.name}
                    className='banner-image'
                />
            </div>
            <div className='banner-overlay'>
                <h1>{event.name}</h1>
                <p>{event.location}</p>
                <p>{event.date}</p>
            </div>
        </div>
    );
};

export default MainEventBanner;
