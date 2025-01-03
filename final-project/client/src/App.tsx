import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register/Register';
import Login from './Login/Login';
import Browser from './components/Browser';
import CreateEvent from './components/CreateEvent/createEvent';
import UpdateEvent from './components/CreateEvent/Update/updateEvent';
import LandingPage from './components/landing-page/LandingPage';
import GenrePage from './components/genre-page/GenrePage';
import GoogleMap from "./components/GoogleMap/GoogleMap";
import ProtectedRoute from './Login/protectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path='/' element={<Home />} /> */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/browser' element={<Browser />} />
        <Route path='/genre/:genreName' element={<GenrePage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/events/create' element={<CreateEvent />} />
        <Route path='/events/update/:id' element={<UpdateEvent />} />
        <Route path='/events/genre/:genre' element={<MusicGenre />} />
        {/* <Route path="/map" element={<GoogleMap />} /> */}
        <Route path='/ticket/:id' element={<Ticket />} />
      </Routes>
    </Router>
  );
};

export default App;
