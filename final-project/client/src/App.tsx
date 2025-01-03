import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register/Register';
import Login from './Login/Login';
import Browser from './components/Browser';
import CreateEvent from './components/CreateEvent/createEvent';
import UpdateEvent from './components/CreateEvent/Update/updateEvent';
import LandingPage from './components/landing-page/LandingPage';
import GenrePage from './components/genre-page/GenrePage';
import MusicGenre from './components/MusicGenre/MusicGenre';
import Ticket from './components/Ticket/Ticket';
import ProtectedRoute from './Login/protectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/browser' element={<Browser />} />
        <Route path='/genre/:genreName' element={<GenrePage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path='/events/create'
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path='/events/update/:id'
          element={
            <ProtectedRoute>
              <UpdateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path='/events/genre/:genre'
          element={
            <ProtectedRoute>
              <MusicGenre />
            </ProtectedRoute>
          }
        />
        <Route
          path='/ticket/:id'
          element={
            <ProtectedRoute>
              <Ticket />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
