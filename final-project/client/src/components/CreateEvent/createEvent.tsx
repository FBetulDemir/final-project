import { useContext, useState } from "react";
import "./createEvent.css";
import axios from "axios";
import { validateEventFormData } from "./validateEvent";

export interface EventFormData {
  eventName: string;
  genre: string;
  description: string;
  location: string;
  dateTime: Date;
  ticketPrice: number;
  maxAttendees: number;
}

export default function CreateEvent() {
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
  });

  const coordLocation = { latitude: "5", longitude: "5" };
  const [error, setError] = useState<{ [key: string]: string }>({});

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errValidation = validateEventFormData(eventData);
    if (Object.keys(errValidation).length > 0) {
      setError(errValidation);
      return;
    }

    const eventDataToSend = new FormData();
    eventDataToSend.append("EventName", eventData.eventName);
    eventDataToSend.append("Genre", eventData.genre);
    eventDataToSend.append("Description", eventData.description);
    eventDataToSend.append("Latitude", coordLocation.latitude);
    eventDataToSend.append("Longitude", coordLocation.longitude);
    eventDataToSend.append("DateTime", eventData.dateTime);
    eventDataToSend.append("TicketPrice", eventData.ticketPrice.toString());
    eventDataToSend.append("MaxAttendees", eventData.maxAttendees.toString());

    try {
      const response = await axios.post(
        "http://localhost:3002/events/create-event",
        eventDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Event created successfully:", response.data);
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:");
      alert("Failed to create event.");
    }
  };

  return (
    <div className="parent-cont">
      <div className="container">
        <h2 className="{styles.heading}">Create Event</h2>
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

            <fieldset className="{styles.fieldset}">
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

            <fieldset className="{styles.fieldset}">
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

            <fieldset className="{styles.fieldset}">
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

            <fieldset className="{styles.fieldset}">
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

            <fieldset className="{styles.fieldset}">
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

            <fieldset className="{styles.fieldset}">
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

            {/* <fieldset className={styles.fieldset}>
            <legend>Event Image</legend>
            <input
              type="file"
              name="eventImage"
              accept="image/*"
              onChange={handleFileChange}
            />
            {preview && (
              <div className={styles.preview}>
                <img
                  src={preview}
                  alt="Event Preview"
                  className={styles.image}
                />
              </div>
            )}
          </fieldset> */}

            <button type="submit" className="{styles.button}">
              Create Event
            </button>
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
