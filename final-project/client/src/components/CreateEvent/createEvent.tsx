import { useEffect, useState, useRef } from 'react';
import './createEvent.css';
import axios from 'axios';
import { validateEventFormData } from './validateEvent';
import GoogleMap from '../GoogleMap/GoogleMap';

export interface EventFormData {
  eventName: string;
  genre: string;
  description: string;
  location: string;
  dateTime: Date;
  ticketPrice: number;
  maxAttendees: number;
  poster: File | null;
}

export default function CreateEvent() {
  const datetimeString = 'yyyy-MM-ddThh:mm:ssZ';
  const dateObject = new Date(datetimeString);

  const [eventData, setEventData] = useState<EventFormData>({
    eventName: '',
    genre: '',
    description: '',
    location: '',
    dateTime: dateObject,
    ticketPrice: 0,
    maxAttendees: 0,
    poster: null,
  });

  const cancelTokenRef = useRef<ReturnType<
    typeof axios.CancelToken.source
  > | null>(null);

  useEffect(() => {
    if (!eventData.location) return;

    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('New request initiated');
    }

    const cancelTokenSource = axios.CancelToken.source();
    cancelTokenRef.current = cancelTokenSource;

    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              address: eventData.location,
              key: import.meta.env.VITE_GEOCODING_API_KEY,
            },
            cancelToken: cancelTokenSource.token,
          }
        );

        if (response.data.status === 'OK') {
          const location = response.data.results[0].geometry.location;
          setCoordinates({ lat: location.lat, lng: location.lng });
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('Error in geocoding:', err);
        }
      }
    };
    fetchCoordinates();

    return () => {
      cancelTokenRef.current = null;
    };
  }, [eventData.location]);

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    // console.log(`Field: ${name}, Value: ${value}`);
    setEventData({ ...eventData, [name]: value });
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const posterFile = e.target.files?.[0] || null;
    setEventData({ ...eventData, poster: posterFile });

    if (posterFile) {
      const reader = new FileReader();
      reader.onload = () => setPosterPreview(reader.result as string);
      reader.readAsDataURL(posterFile);
    } else {
      setPosterPreview(null);
    }
  };

  const geocodeLocation = async (location: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: location,
            key: import.meta.env.VITE_GEOCODING_API_KEY,
          },
        }
      );

      if (response.data.status === 'OK') {
        const location = response.data.results[0].geometry.location;
        setCoordinates({ lat: location.lat, lng: location.lng });
        return location;
      } else {
        throw new Error('Geocoding failed. Check the address.');
      }
    } catch (error) {
      console.error('Error in geocoding:', error);
      alert('Failed to fetch location. Please check the address.');
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errValidation = validateEventFormData(eventData);
    if (Object.keys(errValidation).length > 0) {
      setError(errValidation);
      return;
    }

    const { lat, lng } = await geocodeLocation(eventData.location);

    console.log(lat, lng);

    const eventDataToSend = new FormData();
    eventDataToSend.append('EventName', eventData.eventName);
    eventDataToSend.append('Genre', eventData.genre);
    eventDataToSend.append('Description', eventData.description);
    eventDataToSend.append('Location', eventData.location);
    eventDataToSend.append('Latitude', lat);
    eventDataToSend.append('Longitude', lng);
    eventDataToSend.append('DateTime', eventData.dateTime);
    eventDataToSend.append('TicketPrice', eventData.ticketPrice.toString());
    eventDataToSend.append('MaxAttendees', eventData.maxAttendees.toString());

    if (eventData.poster) {
      eventDataToSend.append('Poster', eventData.poster);
    }
    console.log(eventDataToSend);
    try {
      const response = await axios.post(
        'http://localhost:3002/events/create-event',
        eventDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Event created successfully:', response.data);
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:');
      alert('Failed to create event.');
    }
  };

  return (
    <div className='parent-cont'>
      <div className='container'>
        <h2>Create Event</h2>
        <div className=''>
          <form onSubmit={handleSubmit} className='event-form'>
            <fieldset>
              <label>Event Name</label>
              <input
                type='text'
                name='eventName'
                value={eventData.eventName}
                onChange={handleChange}
              />
              {error.eventName && (
                <span className='error'>{error.eventName}</span>
              )}
            </fieldset>

            <fieldset>
              <label>Genre</label>
              <select
                name='genre'
                value={eventData.genre}
                onChange={handleChange}
              >
                <option value='' disabled>
                  Select a Genre
                </option>
                <option value='Rock'>Rock</option>
                <option value='Pop'>Pop</option>
                <option value='Jazz'>Jazz</option>
                <option value='Classical'>Classical</option>
                <option value='Hip-Hop'>Hip-Hop</option>
                <option value='EDM'>EDM</option>
                <option value='Country'>Country</option>
                <option value='Reggae'>Reggae</option>
                <option value='Blues'>Blues</option>
                <option value='Soul/R&B'>Soul/R&B</option>
                <option value='Folk'>Folk</option>
                <option value='Latin'>Latin</option>
                <option value='Metal'>Metal</option>
                <option value='Punk'>Punk</option>
                <option value='World Music'>World Music</option>
                <option value='Gospel'>Gospel</option>
              </select>
              {error.genre && <span className='error'>{error.genre}</span>}
            </fieldset>

            <fieldset>
              <label>Description</label>
              <textarea
                name='description'
                value={eventData.description}
                onChange={handleChange}
              />
              {error.description && (
                <span className='error'>{error.description}</span>
              )}
            </fieldset>

            <fieldset>
              <label>Location</label>
              <input
                type='text'
                name='location'
                value={eventData.location}
                onChange={handleChange}
              />
              {error.location && (
                <span className='error'>{error.location}</span>
              )}
            </fieldset>

            <fieldset>
              <label>Date and Time</label>
              <input
                type='datetime-local'
                name='dateTime'
                value={eventData.dateTime}
                onChange={handleChange}
              />
              {error.dateTime && (
                <span className='error'>{error.dateTime}</span>
              )}
            </fieldset>
            <fieldset>
              <label>Event Poster</label>
              <input
                type='file'
                name='poster'
                accept='image/*'
                onChange={handlePosterChange}
              />
              {posterPreview && (
                <div>
                  <img src={posterPreview} alt='Poster Preview' width='200' />
                </div>
              )}
            </fieldset>
            <fieldset>
              <label>Ticket Price</label>
              <input
                type='number'
                name='ticketPrice'
                value={eventData.ticketPrice}
                onChange={handleChange}
              />
              {error.ticketPrice && (
                <span className='error'>{error.ticketPrice}</span>
              )}
            </fieldset>

            <fieldset>
              <label>Max Attendees</label>
              <input
                type='number'
                name='maxAttendees'
                value={eventData.maxAttendees}
                onChange={handleChange}
              />
              {error.maxAttendees && (
                <span className='error'>{error.maxAttendees}</span>
              )}
            </fieldset>
            <button type='submit'>Create Event</button>
          </form>
        </div>
      </div>
      <div className='map-cont'>
        <GoogleMap coordinates={coordinates} mapHeight='80vh' />
      </div>
    </div>
  );
}
