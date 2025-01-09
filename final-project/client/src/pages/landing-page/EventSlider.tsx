import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EventSlider.css";

interface Event {
  _id: string;
  ArtistName: string;
  EventName: string;
  Poster: string;
  DateTime: string;
  MusicianId: string; // Add this field to check ownership
}

interface Props {
  events: Event[];
  Username: string | null; // Pass the current user's ID as a prop
}

const EventSlider: React.FC<Props> = ({ events, Username }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
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

  const visibleEvents = events.slice(currentIndex, currentIndex + eventsToShow);

  const handleUpdateClick = (eventId: string) => {
    navigate(`/events/update/${eventId}`);
  };

  return (
    <div className="event-slider">
      {/* Left Arrow */}
      <button
        className="arrow left-arrow"
        onClick={prevSlide}
        disabled={currentIndex === 0}
      >
        &#8249;
      </button>

      {/* Events Container */}
      <div className="event-container">
        {visibleEvents.map((event) => (
          <div key={event._id} className="event-card">
            <img
              src={event.Poster || "https://via.placeholder.com/200x150"}
              alt={event.EventName}
              className="event-image"
            />
            <div className="event-info">
              <h3 className="event-name">{event.EventName}</h3>
              <p className="event-date">
                {new Date(event.DateTime).toLocaleDateString()}
              </p>
              <p>{event.ArtistName}</p>
              {event.ArtistName === Username && (
                <button
                  onClick={() => handleUpdateClick(event._id)}
                  className="update-button"
                >
                  Update
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        className="arrow right-arrow"
        onClick={nextSlide}
        disabled={currentIndex >= events.length - eventsToShow}
      >
        &#8250;
      </button>
    </div>
  );
};

export default EventSlider;
