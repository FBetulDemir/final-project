import React, { useState } from 'react';
import './EventSlider.css';

interface Event {
    id: string;
    name: string;
    location: string;
    date: string;
    image: string;
}

interface EventSliderProps {
    events: Event[];
}

const EventSlider: React.FC<EventSliderProps> = ({ events }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? events.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === events.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className='slider-container'>
            <button className='slider-arrow prev' onClick={handlePrev}>
                &#8249;
            </button>
            <div className='slider'>
                {events.map((event, index) => (
                    <div
                        key={event.id}
                        className={`slider-card ${
                            index === currentIndex ? 'active' : 'inactive'
                        }`}
                        style={{
                            transform: `translateX(${
                                100 * (index - currentIndex)
                            }%)`,
                        }}
                    >
                        <img src={event.image} alt={event.name} />
                        <div className='event-info'>
                            <h3>{event.name}</h3>
                            <p>{event.location}</p>
                            <p>{event.date}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className='slider-arrow next' onClick={handleNext}>
                &#8250;
            </button>
        </div>
    );
};

export default EventSlider;
