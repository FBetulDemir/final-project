import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    artist: { type: String, required: true },
    concert: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    date: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    description: { type: String },
    poster: { type: String }, // URL de la imagen del póster
});

const Event = mongoose.model('Event', EventSchema);
export default Event;
