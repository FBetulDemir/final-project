import { useParams } from 'react-router-dom';
import GoogleMap from '../GoogleMap/GoogleMap';
import Modal from './Modal';
import './Ticket.css';
import { useEffect, useState } from 'react';

interface EventData {
  _id: string;
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

function Ticket() {
  //* It will connect to Music Genre (frame 4)
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState<boolean>(false);
  const [event, setEvent] = useState<EventData | null>(null);

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

  // console.log(event?.Latitude);
  // console.log(event?.Longitude);
  {
    /* //* Used the same default location as Google Map component  */
  }
  return (
    <>
      <button onClick={() => setOpen(true)}>Modal</button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className='ticket-container'>
          <div className='map-co '>
            <GoogleMap
              coordinates={{
                lat: event?.Latitude ?? 55.605,
                lng: event?.Longitude ?? 13.0038,
              }}
              mapHeight='30vh'
            />
          </div>

          <h1>{event?.EventName}</h1>
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
          <button className='buy-ticket-btn'>Buy Ticket</button>
        </div>
      </Modal>
    </>
  );
}

export default Ticket;
