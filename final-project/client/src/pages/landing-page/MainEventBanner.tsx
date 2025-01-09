import React from "react";
import "./MainEventBanner.css";

interface MainEventBannerProps {
  eventName: string;
  location: string;
  date: string;
  poster: string;
}

const MainEventBanner: React.FC<MainEventBannerProps> = ({
  eventName,
  location,
  date,
  poster,
}) => {
  return (
    <div className="main-event-banner">
      <img src={poster} alt={eventName} className="banner-image" />
      <div className="banner-details">
        <h1>{eventName}</h1>
        <p>{location}</p>
      </div>
      <div className="ban-date">
        <p>{date}</p>
      </div>
    </div>
  );
};

export default MainEventBanner;
