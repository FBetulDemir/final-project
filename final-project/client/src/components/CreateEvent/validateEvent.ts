// Form validation function
import { EventFormData } from "./createEvent.tsx";

export const validateEventFormData = (
  eventData: EventFormData
): { [key: string]: string } => {
  const error: { [key: string]: string } = {};
  if (!eventData.eventName) error.eventName = "Event name is required.";
  if (!eventData.genre) error.genre = "Genre is required.";
  if (!eventData.description) error.description = "Description is required.";
  if (!eventData.location) error.location = "Location is required.";
  if (!eventData.dateTime) error.dateTime = "Date and time are required.";
  if (eventData.ticketPrice <= 0)
    error.ticketPrice = "Please Enter Ticket's price.";
  if (eventData.maxAttendees <= 0)
    error.maxAttendees = "Max attendees must be filled.";
  return error;
};
