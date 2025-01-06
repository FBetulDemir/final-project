import { useEffect, useState, useRef } from "react";
import "./createEvent.css";
import axios from "axios";
import { validateEventFormData } from "../../utils/validateEvent";
import GoogleMap from "../GoogleMap/GoogleMap";
import { useNavigate } from "react-router-dom";

export interface EventFormData {
  ArtistName: string;
  EventName: string;
  Genre: string;
  Description: string;
  Location: string;
  DateTime: string;
  TicketPrice: number;
  MaxAttendees: number;
  Poster: File | null;
}

export default function CreateEvent() {
  const datetimeString = "yyyy-MM-ddThh:mm:ssZ";
  const dateObject = new Date(datetimeString);
  const navigate = useNavigate();

  const [eventData, setEventData] = useState<EventFormData>({
    ArtistName: "",
    EventName: "",
    Genre: "",
    Description: "",
    Location: "",
    DateTime: "",
    TicketPrice: 0,
    MaxAttendees: 0,
    Poster: null,
  });

  const cancelTokenRef = useRef<ReturnType<
    typeof axios.CancelToken.source
  > | null>(null);

  useEffect(() => {
    if (!eventData.Location) return;

    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("New request initiated");
    }

    const cancelTokenSource = axios.CancelToken.source();
    cancelTokenRef.current = cancelTokenSource;

    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              address: eventData.Location,
              key: import.meta.env.VITE_GEOCODING_API_KEY,
            },
            cancelToken: cancelTokenSource.token,
          }
        );

        if (response.data.status === "OK") {
          const location = response.data.results[0].geometry.location;
          setCoordinates({ lat: location.lat, lng: location.lng });
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error in geocoding:", err);
        }
      }
    };
    fetchCoordinates();

    return () => {
      cancelTokenRef.current = null;
    };
  }, [eventData.Location]);

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
    setEventData({ ...eventData, Poster: posterFile });

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errValidation = validateEventFormData(eventData);
    if (Object.keys(errValidation).length > 0) {
      setError(errValidation);
      return;
    }

    try {
      const { lat, lng } = await geocodeLocation(eventData.Location);

      console.log("Latitude:", lat, "Longitude:", lng);

      const eventDataToSend = new FormData();
      eventDataToSend.append("ArtistName", eventData.ArtistName);
      eventDataToSend.append("EventName", eventData.EventName);
      eventDataToSend.append("Genre", eventData.Genre);
      eventDataToSend.append("Description", eventData.Description);
      eventDataToSend.append("Location", eventData.Location);
      eventDataToSend.append("Latitude", lat);
      eventDataToSend.append("Longitude", lng);
      eventDataToSend.append("DateTime", eventData.DateTime);
      eventDataToSend.append("TicketPrice", eventData.TicketPrice.toString());
      eventDataToSend.append("MaxAttendees", eventData.MaxAttendees.toString());

      if (eventData.Poster) {
        eventDataToSend.append("Poster", eventData.Poster);
      }

      // Log the FormData entries to see what's inside
      for (const [key, value] of eventDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(
        "http://localhost:3002/events/create-event",
        eventDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Event created successfully:", response.data);

      alert("Event created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error creating event:", JSON.stringify(err, null, 2));
      alert("Failed to create event.");
    }
  };

  return (
    <div className="parent-cont">
      <div className="container">
        <h2>Create Event</h2>
        <div className="">
          <form onSubmit={handleSubmit} className="event-form">
            <fieldset>
              <label>Artist Name</label>
              <input
                type="text"
                name="ArtistName"
                value={eventData.ArtistName}
                onChange={handleChange}
              />
              {error.ArtistName && (
                <span className="error">{error.ArtistName}</span>
              )}
            </fieldset>
            <fieldset>
              <label>Event Name</label>
              <input
                type="text"
                name="EventName"
                value={eventData.EventName}
                onChange={handleChange}
              />
              {error.eventName && (
                <span className="error">{error.eventName}</span>
              )}
            </fieldset>

            <fieldset>
              <label>Genre</label>
              <select
                name="Genre"
                value={eventData.Genre}
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
                name="Description"
                value={eventData.Description}
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
                name="Location"
                value={eventData.Location}
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
                name="DateTime"
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
                name="Poster"
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
                name="TicketPrice"
                value={eventData.TicketPrice}
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
                name="MaxAttendees"
                value={eventData.MaxAttendees}
                onChange={handleChange}
              />
              {error.maxAttendees && (
                <span className="error">{error.maxAttendees}</span>
              )}
            </fieldset>
            <button type="submit">Create Event</button>
          </form>
        </div>
      </div>
      <div className="map-cont">
        <GoogleMap coordinates={coordinates} mapHeight="80vh" />
      </div>
    </div>
  );
}
