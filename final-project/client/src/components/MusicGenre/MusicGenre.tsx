import './MusicGenre.css';
import musicGenreImage from '../../assets/music-genre.png';
import Header from '../Header';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Event {
  _id: string;
  EventName: string;
  Location: string;
  DateTime: string;
}

const MusicGenre: React.FC = () => {
  const { genre } = useParams<{ genre: string }>();
  const [events, setEvents] = useState<Event[]>([]);
  //* To connect Ticket component by ID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/events/genre/${genre}`
        );
        if (!response.ok) {
          throw new Error('failed to fetch data');
        }
        const data: Event[] = await response.json();
        setEvents(data);
        console.log('Fetched Events:', data);
      } catch (error) {
        console.error('Error message:', error);
      }
    };
    fetchData();
  }, [genre]);
  const handleEventClick = (id: string) => {
    navigate(`/ticket/${id}`);
    // console.log(id);
  };

  return (
    <>
      <Header />

      <div className='body'>
        <div className='text-container'>
          <h1>Music Genre: {genre}</h1>
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event._id}
                className='info-container '
                onClick={() => handleEventClick(event._id)}
              >
                <img
                  src={musicGenreImage}
                  alt='a shadow man playing guitar'
                  className='img'
                />
                <h2 className='event-name'>{event.EventName}</h2>
                <div className='date-container'>
                  <h3>Location: {event.Location}</h3>
                  <h3>Time: {new Date(event.DateTime).toLocaleString()}</h3>
                </div>
              </div>
            ))
          ) : (
            <p>Loading event details</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MusicGenre;
