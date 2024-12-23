import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../createEvent.css";
import { validateEventFormData } from "../validateEvent";
import { EventFormData } from "../createEvent";

export default function UpdateEvent() {
  const { id } = useParams<{ id: string }>();

  const datetimeString = "yyyy-MM-ddThh:mm:ssZ";
  const dateObject = new Date(datetimeString);

  const [eventData, setEventData] = useState<EventFormData>({
    eventName: "",
    genre: "",
    description: "",
    location: "",
    dateTime: dateObject,
    ticketPrice: 0,
    maxAttendees: 0,
    poster: null,
  });
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  }>();
  const geocodeLocation = async (address: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: address,
            key: import.meta.env.VITE_GEOCODING_API_KEY,
          },
        }
      );

      if (response.data.status === "OK") {
        const location = response.data.results[0].geometry.location;
        setCoordinates({ lat: location.lat, lng: location.lng });
        return location;
      } else {
        throw new Error("Geocoding failed. Check the address.");
      }
    } catch (error) {
      console.error("Error in geocoding:", error);
      alert("Failed to fetch location. Please check the address.");
      throw error;
    }
  };

  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [error, setError] = useState<{ [key: string]: string }>({});

  // Fetch event data when the component loads
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3002/events/get-event/${id}`)
        .then((response) => {
          const event = response.data;
          setEventData({
            eventName: event.EventName,
            genre: event.Genre,
            description: event.Description,
            location: event.Location,
            dateTime: new Date(event.DateTime).toISOString().slice(0, 16),
            ticketPrice: event.TicketPrice,
            maxAttendees: event.MaxAttendees,
            poster: eventData.poster,
          });
          setPosterPreview(event.Poster);
        })
        .catch((error) => {
          console.error("Error fetching event data:", error);
        });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errValidation = validateEventFormData(eventData);
    if (Object.keys(errValidation).length > 0) {
      setError(errValidation);
      return;
    }

    const { lat, lng } = await geocodeLocation(eventData.location);
    console.log(lat, lng);
    // console.log("Event Data:", eventData);

    // const eventDataToSend = new FormData;

    // console.log(eventDataToSend);
    console.log("Form submitted");
    console.log("Event Data:", eventData);

    try {
      const response = await axios.put(
        `http://localhost:3002/events/update-event/${id}`,
        eventData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("This is eventdatato send", eventDataToSend);
      console.log("Event updated successfully:", response.data);
      alert("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };

  return (
    <div className="parent-cont">
      <div className="container">
        <h2>Update Event</h2>
        <div className="">
          <form onSubmit={handleSubmit} className="event-form">
            <fieldset className="{styles.fieldset}">
              <label>Event Name</label>
              <input
                type="text"
                name="eventName"
                value={eventData.eventName}
                onChange={handleChange}
              />
              {error.eventName && (
                <span className="error">{error.eventName}</span>
              )}
            </fieldset>

            <fieldset>
              <label>Genre</label>
              <select
                name="genre"
                value={eventData.genre}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select a Genre
                </option>
                <option value="Rock">Rock</option>
                <option value="Pop">Pop</option>
                <option value="Jazz">Jazz</option>
                <option value="Classical">Classical</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="EDM">EDM</option>
                <option value="Country">Country</option>
                <option value="Reggae">Reggae</option>
                <option value="Blues">Blues</option>
                <option value="Soul/R&B">Soul/R&B</option>
                <option value="Folk">Folk</option>
                <option value="Latin">Latin</option>
                <option value="Metal">Metal</option>
                <option value="Punk">Punk</option>
                <option value="World Music">World Music</option>
                <option value="Gospel">Gospel</option>
              </select>
              {error.genre && <span className="error">{error.genre}</span>}
            </fieldset>

            <fieldset>
              <label>Description</label>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleChange}
              />
              {error.description && (
                <span className="error">{error.description}</span>
              )}
            </fieldset>

            <fieldset>
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={eventData.location}
                onChange={handleChange}
              />
              {error.location && (
                <span className="error">{error.location}</span>
              )}
            </fieldset>

            <fieldset>
              <label>Date and Time</label>
              <input
                type="datetime-local"
                name="dateTime"
                value={eventData.dateTime}
                onChange={handleChange}
              />
              {error.dateTime && (
                <span className="error">{error.dateTime}</span>
              )}
            </fieldset>
            <fieldset>
              <label>Event Poster</label>
              <input
                type="file"
                name="poster"
                accept="image/*"
                onChange={handlePosterChange}
              />
              {posterPreview && (
                <div>
                  <img src={posterPreview} alt="Poster Preview" width="200" />
                </div>
              )}
            </fieldset>
            <fieldset>
              <label>Ticket Price</label>
              <input
                type="number"
                name="ticketPrice"
                value={eventData.ticketPrice}
                onChange={handleChange}
              />
              {error.ticketPrice && (
                <span className="error">{error.ticketPrice}</span>
              )}
            </fieldset>

            <fieldset>
              <label>Max Attendees</label>
              <input
                type="number"
                name="maxAttendees"
                value={eventData.maxAttendees}
                onChange={handleChange}
              />
              {error.maxAttendees && (
                <span className="error">{error.maxAttendees}</span>
              )}
            </fieldset>
            <button type="submit">Update Event</button>
          </form>
        </div>
      </div>
      <div className="map-cont">
        <div className="map">
          <h1>MAP HERE</h1>
        </div>
      </div>
    </div>
  );
}
