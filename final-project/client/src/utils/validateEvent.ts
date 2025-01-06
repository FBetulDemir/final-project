// Form validation function
import { EventFormData } from "../components/CreateEvent/createEvent";
import { UpdatedEventFormData } from "../components/CreateEvent/Update/updateEvent";

export const validateEventFormData = (
  eventData: EventFormData | UpdatedEventFormData
): { [key: string]: string } => {
  const error: { [key: string]: string } = {};
  if (!eventData.ArtistName) error.ArtistName = "Artist name is required.";
  if (!eventData.EventName) error.eventName = "Event name is required.";
  if (!eventData.Genre) error.genre = "Genre is required.";
  if (!eventData.Description) error.description = "Description is required.";
  if (!eventData.Location) error.location = "Location is required.";
  if (!eventData.DateTime) error.dateTime = "Date and time are required.";
  if (eventData.TicketPrice <= 0)
    error.ticketPrice = "Please Enter Ticket's price.";
  if (eventData.MaxAttendees <= 0)
    error.maxAttendees = "Max attendees must be filled.";
  return error;
};
