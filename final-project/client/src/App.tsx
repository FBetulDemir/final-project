import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register/Register';
import Login from './Login/Login';
import Browser from './components/Browser';
import CreateEvent from './components/CreateEvent/createEvent';
import UpdateEvent from "./components/CreateEvent/Update/updateEvent";
import LandingPage from './components/landing-page/LandingPage';
import GenrePage from './components/genre-page/GenrePage';
import GoogleMap from "./components/GoogleMap/GoogleMap";
import ProtectedRoute from './Login/protectedRoute';

const App = () => {
    return (
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Protected Routes */}
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <LandingPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/browser" 
                        element={
                            <ProtectedRoute>
                                <Browser />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/genre/:genreName" 
                        element={
                            <ProtectedRoute>
                                <GenrePage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/events/create" 
                        element={
                            <ProtectedRoute>
                                <CreateEvent />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/events/update/:id" 
                        element={
                            <ProtectedRoute>
                                <UpdateEvent />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/map" 
                        element={
                            <ProtectedRoute>
                                <GoogleMap />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
    );
};

export default App;
