import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register/Register';
import Login from './Login/Login';
import Browser from './pages/Browser';
import CreateEvent from './pages/CreateEvent/createEvent';
import UpdateEvent from './pages/CreateEvent/Update/updateEvent';
import LandingPage from './pages/landing-page/LandingPage';
import GenrePage from './pages/genre-page/GenrePage';
import MusicGenre from './pages/MusicGenre/MusicGenre';
import Ticket from './pages/Ticket/Ticket';
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
