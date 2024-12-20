import React, { useState, useEffect } from 'react';  // Importar useState y useEffect
import axios from 'axios';
import './Browser.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Browser = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [concerts, setConcerts] = useState<any[]>([]);

    useEffect(() => {
        // Llamada a la API para obtener los conciertos
        axios.get('/api/concerts')
            .then((response) => {
                console.log('API response:', response);
                if (Array.isArray(response.data)) {
                    setConcerts(response.data);
                } else {
                    console.error('Expected an array, but received:', response.data);
                }
            })
            .catch((error) => {
                console.log('There was an error fetching the concerts:');
                console.log(JSON.stringify(error, null, 2));  // Formatea el error para facilitar la lectura
            });
    }, []);  // El array vacío [] asegura que la llamada se haga solo una vez al cargar el componente.

    const handleSearch = () => {
        console.log('Searching for:', searchQuery);
    };

    return (
        <div>
            {/* Header */}
            <div className="gradient-header w-100"></div>

            <div className="container mt-4 text-center">
                {/* Title */}
                <h1 className="fw-bold">Browse All Concerts</h1>

                {/* Search Section */}
                <div className="search-section mt-4">
                    <div className="input-group mb-3 w-50 mx-auto">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>

                {/* Near You Section */}
                <h2 className="mt-5">Near You</h2>
                <div className="row mt-3 near-you">
                    {concerts.map((concert, index) => (
                        <div key={index} className="col-6 col-md-3 mb-3">
                            <div className="concert-card">
                                <img src={concert.poster} alt={concert.concert} />
                                <div className="concert-info">
                                    <h5>{concert.artist}</h5>
                                    <p>{concert.location}</p>
                                    <p>{concert.date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Browser;
