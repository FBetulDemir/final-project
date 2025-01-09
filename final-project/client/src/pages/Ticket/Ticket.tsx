import { useParams, useNavigate } from 'react-router-dom';
import GoogleMap from '../GoogleMap/GoogleMap';
import './Ticket.css';
import { useEffect, useState } from 'react';

interface EventData {
  _id: string;
  ArtistName: string;
  EventName: string;
  Genre: string;
  Description: string;
  Location: string;
  DateTime: Date;
  TicketPrice: number;
  MaxAttendees: number;
  Latitude: number | undefined;
  Longitude: number | undefined;
}

const Ticket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/events/get-event/${id}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch ${response.status}`);
        }
        const data: EventData = await response.json();
        setEvent(data);
        console.log(data);
      } catch (error) {
        console.error('Error message:', error);
      }
    };
    fetchData();
  }, [id]);

  //*Go back to previous page
  const onClose = () => {
    navigate(-1);
  };
  const openMessage = () => {
    alert('Thank you very much for buying the ticket.');
    navigate('/');
  };
  // console.log(event?.Latitude);
  // console.log(event?.Longitude);

  return (
    <div className='ticket-container' onClick={onClose}>
      <div
        className='modal-container'
        onClick={(e) => e.stopPropagation()} //* Prevent closing when clicking inside the modal
      >
        <button className='x-btn' onClick={onClose}>
          X
        </button>

        {event ? (
          <>
            <div
              className='map-co ' //* Used the same default location as Google Map component
            >
              <GoogleMap
                coordinates={{
                  lat: event?.Latitude ?? 55.605,
                  lng: event?.Longitude ?? 13.0038,
                }}
                mapHeight='30vh'
              />
            </div>

            <h2 className='event-name-ticket'>{event?.EventName}</h2>

            <h3 className='artist-name-ticket'>Artist:{event?.ArtistName}</h3>
            <div className='description'>
              <h5>Description</h5>
              <p>{event?.Description}</p>
            </div>
            <div className='container-info'>
              <div className='container-info-attendants'>
                <h5>Attendants</h5>
                <p>{event?.MaxAttendees}</p>
              </div>
              <div className='container-info-date'>
                <h5>Date</h5>
                <p>{new Date(event?.DateTime).toLocaleDateString()}</p>
              </div>
              <div className='container-info-location'>
                <h5>Location</h5>
                <p>{event?.Location}</p>
              </div>
            </div>

            <h2 className='ticket-title'>
              Ticket Price: {event?.TicketPrice} kr
            </h2>

            <button
              type='button'
              className='btn-ticket btn-secondary '
              style={{ marginTop: '10px' }}
              onClick={openMessage}
            >
              Buy Ticket
            </button>
          </>
        ) : (
          <p>Loading event details</p>
        )}
      </div>
    </div>
  );
};

export default Ticket;
