import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GenrePage.css';
import Header from '../Header';

const genres = [
  { name: 'Pop', color: '#FF6F61' },
  { name: 'Rock', color: '#333333' },
  { name: 'Hip-Hop', color: '#FFD700' },
  { name: 'Jazz', color: '#6A5ACD' },
  { name: 'Classical', color: '#8A2BE2' },
  { name: 'Country', color: '#D2B48C' },
  { name: 'Electronic', color: '#32CD32' },
  { name: 'Reggae', color: '#FF69B4' },
  { name: 'Blues', color: '#0000FF' },
  { name: 'Folk', color: '#A0522D' },
  { name: 'R&B', color: '#ADD8E6' },
  { name: 'Metal', color: '#000000' },
];

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
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchEventsByGenre = async (genre: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3002/api/events?genre=${genre}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching events: ${response.statusText}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (genreName) {
      fetchEventsByGenre(genreName);
    }
  }, [genreName]);

  const handleGenreClick = (genre: string) => {
    navigate(`/genre/${genre}`);
  };

  return (
    <div>
      <Header />
      <div className='genre-container'>
        {genres.map((genre) => (
          <button
            key={genre.name}
            onClick={() => handleGenreClick(genre.name)}
            className='genre-button'
            style={{ backgroundColor: genre.color }}
          >
            {genre.name}
          </button>
        ))}
      </div>
      {loading ? (
        <p>Loading events...</p>
      ) : (
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
      )}
    </div>
  );
};

export default GenrePage;
