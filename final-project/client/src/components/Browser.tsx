import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Asegúrate de tener axios importado
import './Browser.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Browser = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [concerts, setConcerts] = useState<any[]>([]);

    // Fetch concerts from the backend
    useEffect(() => {
        // Llamada a la API para obtener los conciertos
        axios.get('/api/concerts')
            .then((response) => {
                // Asumiendo que la respuesta es un array de conciertos
                setConcerts(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the concerts:", error);
            });
    }, []);  // El array vacío [] asegura que la llamada se haga solo una vez al cargar el componente.

    const handleSearch = () => {
        // Implementar la lógica de búsqueda aquí
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

                {/* Concerts Table */}
                <div className="table-responsive mt-5">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Artist Name</th>
                                <th scope="col">Venue</th>
                                <th scope="col">Address</th>
                                <th scope="col">Date</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2].map((item) => (
                                <tr key={item}>
                                    <td>
                                        <img
                                            src="https://via.placeholder.com/50"
                                            alt="Placeholder"
                                            className="me-2 rounded"
                                        />
                                        Artist Name
                                    </td>
                                    <td>Lorem Ipsum Hall</td>
                                    <td>Lorem Ipsum street 35</td>
                                    <td>01/01 - 0000</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Browser;
