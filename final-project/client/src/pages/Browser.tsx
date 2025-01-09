import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./Browser.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Browser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [concerts, setConcerts] = useState<any[]>([]);
  const [filteredConcerts, setFilteredConcerts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3002/Browser/events")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setConcerts(response.data);
          setFilteredConcerts(response.data); // Initialize filtered list
        }
      })
      .catch((error) => {
        console.error("Error fetching concerts:", error);
        alert("Failed to load concerts. Please try again later.");
      });
  }, []);

  const calculateRelevance = (eventName: string, query: string) => {
    const normalizedEventName = eventName.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    return normalizedEventName.indexOf(normalizedQuery);
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setFilteredConcerts(concerts); // Reset to all concerts if search is empty
      return;
    }
  
    const searchResults = concerts
      .filter((concert) =>
        concert.EventName.toLowerCase().includes(trimmedQuery.toLowerCase())
      )
      .sort((a, b) => {
        const relevanceA = calculateRelevance(a.EventName, trimmedQuery);
        const relevanceB = calculateRelevance(b.EventName, trimmedQuery);
        return relevanceA - relevanceB; // Closer matches come first
      });
  
    setFilteredConcerts(searchResults);
  };
  

  const handleClick = (id: string) => {
    navigate(`/ticket/${id}`);
  };

  return (
    <div className="browser-container">
      {/* Gradient Header */}
      <div className="gradient-header"></div>

      <div className="content-container">
        {/* Title */}
        <h1 className="fw-bold text-center">Browse All Concerts</h1>

        {/* Search Section */}
        <div className="search-section mt-4 text-center">
          <div className="input-group mb-3 mx-auto" style={{ maxWidth: "400px" }}>
            <input
              type="text"
              className="form-control rounded-search"
              placeholder="Search by event, artist, or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="custom-btn" type="button" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        {/* Near You Section */}
        {!searchQuery && (
          <>
            <h2 className="text-center mt-5">Near You</h2>
            <div className="row mt-3 near-you justify-content-center">
              {concerts.slice(0, 4).map((concert, index) => (
                <div key={index} className="col-12 col-md-2 mb-3">
                  <div className="concert-card">
                    <img src={concert.Poster} alt={`Poster of ${concert.EventName}`} />
                    <div className="concert-info">
                      <h5>{concert.EventName}</h5>
                      <p>{concert.Location}</p>
                      <p>{format(new Date(concert.DateTime), "dd/MM/yyyy HH:mm")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Search Results Section */}
        {searchQuery && (
          <h2 className="text-center mt-4">
            {filteredConcerts.length > 0
              ? `Results for "${searchQuery}"`
              : `No results found for "${searchQuery}"`}
          </h2>
        )}

        {/* Concert List Section */}
        <div className="concert-list mt-3">
          <div className="table-wrapper mx-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Artist</th>
                  <th>Event</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredConcerts.map((concert, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={concert.Poster}
                          alt={`Poster of ${concert.EventName}`}
                          className="table-poster me-2"
                        />
                        <span>{concert.ArtistName}</span>
                      </div>
                    </td>
                    <td>{concert.EventName}</td>
                    <td>{concert.Location}</td>
                    <td>
                      {format(new Date(concert.DateTime), "dd/MM/yyyy HH:mm")}
                    </td>
                    <td>
                      <button
                        onClick={() => handleClick(concert._id)}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browser;
