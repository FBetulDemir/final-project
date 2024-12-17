import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register.tsx';
import React from 'react';
import Browser from './components/Browser';

const App = () => {
  return (
    <Router>
      <Browser /> {/* Componente Browser visible en todas las páginas */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
