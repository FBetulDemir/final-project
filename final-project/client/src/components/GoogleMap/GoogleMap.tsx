import './GoogleMap.css';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const GoogleMap = () => {
  //* For now I just added Malmö latitude and longitude
  const position = { lat: Number(55.605), lng: Number(13.0038) };
  return (
    <>
      <APIProvider
        apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
        language='en'
      >
        <div style={{ height: '50vh', width: '100%' }}>
          <Map
            zoom={9}
            center={position}
            mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
          >
            <AdvancedMarker position={position}></AdvancedMarker>
          </Map>
        </div>
      </APIProvider>
    </>
  );
};

export default GoogleMap;
