import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import eventAuth from "./middleware/eventAuthMid.js";
import db from "./db.js";
import multer from "multer";
import path from "path";
import authenticate from "./middleware/auth-middleware.js";

const router = express.Router();
router.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posters");
  },
  filename: (req, file, cb) => {
    cb(null, `Poster_${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/create-event",
  authenticate,
  upload.single("Poster"),
  async (req, res) => {
    console.log("Received request body:", req.body);
    console.log("Logged-in user:", req.user);
    const {
      ArtistName,
      EventName,
      Genre,
      Description,
      Location,
      Latitude,
      Longitude,
      DateTime,
      TicketPrice,
      MaxAttendees,
    } = req.body;
    const posterPath = req.file;

    const musician = req.user;
    // Form Validation
    if (
      !ArtistName ||
      !EventName ||
      !Genre ||
      !Location ||
      !Latitude ||
      !Longitude ||
      !DateTime ||
      !TicketPrice ||
      !MaxAttendees
    ) {
      return res.status(400).send("Missing required fields");
    }

    try {
      // Create a new event

      const newEvent = new db.Event({
        EventId: new mongoose.Types.ObjectId(),
        MusicianId: "musician", // Associate the event with the logged-in musician
        ArtistName,
        EventName,
        Genre,
        Description,
        Location,
        Latitude,
        Longitude,
        DateTime,
        TicketPrice,
        MaxAttendees,
        Poster: posterPath
          ? `http://localhost:3002/uploads/posters/${posterPath.filename}`
          : null,
      });

      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (err) {
      if (err.code === 11000) {
        res.status(400).send("Duplicate Event Id");
      } else {
        res.status(500).send("Error creating event");
      }
      console.log(JSON.stringify(err, 2, null));
    }
  }
);

router.get("/get-events", async (req, res) => {
  try {
    const events = await db.Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).send("Error retrieving events");
  }
});

router.get("/get-event/:id", async (req, res) => {
  const { id } = req.params;
  const event = await db.Event.findById(id);

  if (!event) {
    return res.status(404).send({ error: "Event not found" });
  }

  res.send(event);
});

router.put(
  "/update-event/:id",
  authenticate,
  upload.single("poster"),
  async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // If a file was uploaded, add its path to updates
    if (req.file) {
      updates.poster = `http://localhost:3002/${req.file.path}`;
    }

    // console.log("Updates:", updates);
    // console.log("Event ID:", id);

    try {
      const updatedEvent = await db.Event.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
      if (!updatedEvent) {
        return res.status(404).send("Event not found");
      }
      res.json(updatedEvent);
    } catch (err) {
      console.error("Error updating event:", err);
      res.status(500).send("Error updating event");
    }
  }
);

router.get("/genre/:genre", async (req, res) => {
  const { genre } = req.params;

  try {
    const events = await db.Event.find({ Genre: genre }).sort({ Genre: 1 }); // Ascending order
    if (events.length === 0) {
      return res
        .status(404)
        .json({ message: `No ${genre} events were found!` });
    }
    res.json(events);
  } catch (err) {
    res.status(500).send("Error retrieving");
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await db.Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).send("Event not found");
    }
    res.json(deletedEvent);
  } catch (err) {
    res.status(500).send("Error deleting event");
  }
});

export default router;
