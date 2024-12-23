import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri =
            process.env.MONGODB_URI || 'mongodb://localhost:27017/showtime';
        if (!uri) throw new Error('MongoDB URI is not defined');

        await mongoose.connect(uri);

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

export const Genres = {
    ROCK: 'Rock',
    POP: 'Pop',
    JAZZ: 'Jazz',
    CLASSICAL: 'Classical',
    HIP_HOP: 'Hip-Hop',
    EDM: 'EDM',
    COUNTRY: 'Country',
    REGGAE: 'Reggae',
    BLUES: 'Blues',
    SOUL_RNB: 'Soul/R&B',
    FOLK: 'Folk',
    LATIN: 'Latin',
    METAL: 'Metal',
    PUNK: 'Punk',
    WORLD_MUSIC: 'World Music',
    GOSPEL: 'Gospel',
};

// Define the User schema
const userSchema = new mongoose.Schema(
    {
        UserId: {
            type: String,
            required: true,
            unique: true,
        },
        Username: {
            type: String,
            required: true,
            unique: true,
        },
        PasswordHash: {
            type: String,
            required: true,
        },
        Email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        },
        UserType: {
            type: String,
            enum: ['Musician', 'Regular'],
            required: true,
        },
        PreferredRadius: {
            type: Number,
            default: null,
        },
        Latitude: {
            type: Number,
            required: true,
        },
        Longitude: {
            type: Number,
            required: true,
        },
        ProfilePicture: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const eventSchema = new mongoose.Schema(
    {
        EventId: {
            type: String,
            required: true,
            unique: true,
        },
        MusicianId: {
            type: String,
            required: true,
        },
        EventName: {
            type: String,
            required: true,
        },
        Genre: {
            type: String,
            enum: Object.values(Genres),
            required: true,
        },
        Description: {
            type: String,
            default: null,
        },
        Location: {
           type: String,
           required: true,
        },
        Latitude: {
            type: Number,
            required: true,
        },
        Longitude: {
            type: Number,
            required: true,
        },
        DateTime: {
            type: Date,
            required: true,
        },
        TicketPrice: {
            type: Number,
            required: true,
        },
        MaxAttendees: {
            type: Number,
            required: true,
        },
        Poster: {
            type: String,
            default: null,
        },
        CreatedAt: {
            type: Date,
            default: Date.now,
        },
        UpdatedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const ticketSchema = new mongoose.Schema({
    TicketId: {
        type: String,
        required: true,
        unique: true,

    },
    EventId: {
        type: String,
        required: true,
    },
    UserId: {
        type: String,
        required: true,
    },
    PurchaseDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

const Event = mongoose.model('Event', eventSchema);

const User = mongoose.model('User', userSchema);

export default {
    connectDB,
    Event,
    User,
    Ticket,
};
