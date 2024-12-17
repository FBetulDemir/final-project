import './MusicGenre.css';
import musicGenreImage from '../../assets/music-genre.png';
interface Genre {
  name: string;
  location: string;
  time: string;
}

//*Adding event data for now
const events: Genre[] = [
  { name: 'Concert 1', location: 'Malmö', time: '17:00PM' },
  { name: 'Concert 2', location: 'Stockholm', time: '11:00AM' },
  { name: 'Concert 3', location: 'Lund', time: '12:00PM' },
];
const MusicGenre: React.FC = () => {
  //* I will get header from the landing page
  //* All data comes from another components, so just create Front End
  return (
    <>
      <div className='text-container'>
        <h1>Music-Genre</h1>
        {events.map((event, index) => (
          <div key={index} className='info-container '>
            <div className='name-img-container'>
              <h2>{event.name}</h2>
              <img
                src={musicGenreImage}
                alt='a shadow man playing guitar'
                className='img'
              />
            </div>
            <div className='date-container'>
              <h3>Location: {event.location}</h3>
              <h3>Time: {event.time}</h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MusicGenre;
