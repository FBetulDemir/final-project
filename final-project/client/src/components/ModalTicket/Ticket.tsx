import { useParams } from 'react-router-dom';

//import GoogleMap from '../GoogleMap/GoogleMap';
import Modal from './Modal';
import './Ticket.css';
import { useEffect, useState } from 'react';

interface EventData {
  _id: string;
  eventName: string;
  genre: string;
  description: string;
  location: string;
  dateTime: Date;
  ticketPrice: number;
  maxAttendees: number;
}
// interface GoogleMapProps {
//   coordinates: { lat: number; lng: number } | null;
// }
function Ticket() {
  //* It will connect to Music Genre (frame 4)
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState<boolean>(false);
  //const [loading, setLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<EventData | null>(null);
  //const [coordinate, setCoordinate] = useState<GoogleMapProps | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      //67694fe745a51bfff768c19f
      try {
        const response = await fetch(
          `http://localhost:3002/events/get-event/${id}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch event data');
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
  return (
    <>
      <button onClick={() => setOpen(true)}>Modal</button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className='ticket-container'>
          <div className='map-co'>{/* <GoogleMap /> */}</div>
          <div className='description'>
            <h5>Description</h5>
            <p>{event?.description}</p>
          </div>
          <div className='container-info'>
            <div className='container-date-attendants'>
              <div className='container-info-attendants'>
                <h5>Attendants</h5>
                <p>{event?.maxAttendees}</p>
              </div>
              <div className='container-info-date'>
                <h5>Date</h5>
                {/* <p>{new Date(event?.dateTime).toLocaleDateString()}</p> */}
              </div>
            </div>
            <div className='container-info-location'>
              <h5>Location</h5>
              <p>{event?.location}</p>
            </div>
          </div>
          <h2>Ticket Price: {event?.ticketPrice}</h2>
          <button className='buy-ticket-btn'>Buy Ticket</button>
        </div>
      </Modal>
    </>
  );
}

export default Ticket;
