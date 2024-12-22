import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
<<<<<<< HEAD
=======
import { BrowserRouter } from 'react-router-dom';
>>>>>>> betul/landing-page
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
<<<<<<< HEAD
  <StrictMode>
    <App />
  </StrictMode>
=======
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
>>>>>>> betul/landing-page
);
