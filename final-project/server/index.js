import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.get('/api/map', (req, res) => {
  res.json({
    apiKey: process.env.VITE_GOOGLE_MAP_API_KEY,
    mapId: process.env.VITE_GOOGLE_MAP_ID,
    position: { lat: 55.605, lng: 13.0038 }, //*It will update late on. Malmö coordinates
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
