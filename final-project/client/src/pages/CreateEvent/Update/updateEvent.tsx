import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../createEvent.css";
import { validateEventFormData } from "../../../utils/validateEvent";
import GoogleMap from "../../GoogleMap/GoogleMap";
import Header from "../../Header";

export interface UpdatedEventFormData {
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

export default function UpdateEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState<UpdatedEventFormData>({
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
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  // Fetch event data when the component loads
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3002/events/get-event/${id}`)
        .then((response) => {
          const event = response.data;
          setEventData({
            ArtistName: event.ArtistName,
            EventName: event.EventName,
            Genre: event.Genre,
            Description: event.Description,
            Location: event.Location,
            DateTime: new Date(event.DateTime).toISOString().slice(0, 16),
            TicketPrice: event.TicketPrice,
            MaxAttendees: event.MaxAttendees,
            Poster: null,
          });
          setPosterPreview(event.Poster);
        })
        .catch((error) => {
          console.error("Error fetching event data:", error);
        });
    }
  }, [id]);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
    setEventData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const posterFile = e.target.files?.[0] || null;
    setEventData((prevData) => ({ ...prevData, poster: posterFile }));

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

    const validationErrors = validateEventFormData(eventData);
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      const location = await geocodeLocation(eventData.Location);
      console.log("Geocoded location:", location);

      const formData = new FormData();
      Object.entries(eventData).forEach(([key, value]) => {
        if (value !== null) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Optional: Log the contents of formData
      for (const [key, val] of formData.entries()) {
        console.log(`${key}:`, val);
      }

      const response = await axios.put(
        `http://localhost:3002/events/update-event/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Event updated successfully:", response.data);
      alert("Event updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };

  return (
    <>
      <Header />
      <div className="parent-cont">
        <div className="container">
          <h2>Update Event</h2>
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
                {[
                  "Rock",
                  "Pop",
                  "Jazz",
                  "Classical",
                  "Hip-Hop",
                  "EDM",
                  "Country",
                  "Reggae",
                  "Blues",
                  "Soul-RnB",
                  "Folk",
                  "Latin",
                  "Metal",
                  "Punk",
                  "World_Music",
                  "Gospel",
                ].map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
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
                value={eventData.DateTime}
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
                <img src={posterPreview} alt="Poster Preview" width="200" />
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

            <button type="submit">Update Event</button>
          </form>
        </div>
        <div className="map-cont">
          <GoogleMap coordinates={coordinates} mapHeight="80vh" />
        </div>
      </div>
    </>
  );
}
