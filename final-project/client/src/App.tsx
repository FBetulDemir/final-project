import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import GenrePage from './components/GenrePage';

function App() {
    return (
        <>
            <div className='landing-page'>
                <LandingPage />
            </div>
        </>
    );
}

export default App;
