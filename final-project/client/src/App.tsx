import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
// import Header from './components/Header';

function App() {
    return (
        <>
            <h1>It's ShowTime!</h1>

            <div className='landing-page'>
                <LandingPage />
            </div>
        </>
    );
}

export default App;
