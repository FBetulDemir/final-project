
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './Register/Register';
import Login from './Login/Login';
import Browser from './components/Browser';
import Event from './components/CreateEvent/createEvent';
import Ticket from './components/ModalTicket/Ticket';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/browser' element={<Browser />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/events/create' element={<Event />} />
        <Route path='/ticket/events/:id' element={<Ticket />} />
      </Routes>
    </Router>
  );
};


export default App;
