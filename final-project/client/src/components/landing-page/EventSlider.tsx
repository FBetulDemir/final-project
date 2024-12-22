import React, { useState } from 'react';
import './EventSlider.css';

interface Event {
    _id: string;
    EventName: string;
    Poster: string;
    DateTime: string;
}

interface Props {
    events: Event[];
}

const EventSlider: React.FC<Props> = ({ events }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const eventsToShow = 4; // Number of events to show at a time

    const nextSlide = () => {
        if (currentIndex < events.length - eventsToShow) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const visibleEvents = events.slice(
        currentIndex,
        currentIndex + eventsToShow
    );

    return (
        <div className='event-slider'>
            <button
                className='arrow left-arrow'
                onClick={prevSlide}
                disabled={currentIndex === 0}
            >
                &#8249;
            </button>
            <div className='event-container'>
                {visibleEvents.map((event) => (
                    <div key={event._id} className='event-card'>
                        <img
                            src={
                                event.Poster ||
                                'https://via.placeholder.com/150'
                            }
                            alt={event.EventName}
                            className='event-image'
                        />
                        <div className='event-info'>
                            <h3 className='event-name'>{event.EventName}</h3>
                            <p className='event-date'>
                                {new Date(event.DateTime).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <button
                className='arrow right-arrow'
                onClick={nextSlide}
                disabled={currentIndex >= events.length - eventsToShow}
            >
                &#8250;
            </button>
        </div>
    );
};

export default EventSlider;
