import React from 'react';
import './GenreGrid.css';
import { useNavigate } from 'react-router-dom';

const genres = [
  { name: 'Pop', color: '#c71f37', route: '/events/genre/pop', size: 'large' },
  {
    name: 'Punk',
    color: '#8b0000',
    route: '/events/genre/punk',
    size: 'small',
  },
  {
    name: 'Blues',
    color: '#0033cc',
    route: '/events/genre/blues',
    size: 'small',
  },
  {
    name: 'Hip-Hop',
    color: '#d4af37',
    route: '/events/genre/hiphop',
    size: 'small',
  },
  {
    name: 'Reggae',
    color: '#228b22',
    route: '/events/genre/reggae',
    size: 'medium',
  },
  {
    name: 'R&B/ Soul',
    color: '#800080',
    route: '/events/genre/rnb',
    size: 'medium',
  },
];

const GenreGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleGenreClick = (genre: string) => {
    navigate(`events/genre/${genre}`);
  };

  return (
    <div className='genre-grid'>
      {genres.map((genre) => (
        <div
          key={genre.name}
          className={`genre-item-${genre.size}`}
          style={{ backgroundColor: genre.color }}
          onClick={() => handleGenreClick(genre.name)}
        >
          <span className='genre-name'>{genre.name}</span>
        </div>
      ))}
    </div>
  );
};

export default GenreGrid;
