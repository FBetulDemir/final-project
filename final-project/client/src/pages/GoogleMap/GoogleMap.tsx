import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

interface GoogleMapProps {
  coordinates: { lat: number; lng: number };
  mapHeight: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ coordinates, mapHeight }) => {
  //* For now I just added Malmö latitude and longitude
  const defaultPosition = { lat: 55.605, lng: 13.0038 };

  return (
    <>
      <APIProvider
        apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
        language='en'
      >
        <div style={{ height: mapHeight, width: '100%' }}>
          <Map
            zoom={8}
            center={
              coordinates.lat !== 0 && coordinates.lng !== 0
                ? coordinates
                : defaultPosition
            }
            mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
          >
            <AdvancedMarker position={coordinates}></AdvancedMarker>
          </Map>
        </div>
      </APIProvider>
    </>
  );
};

export default GoogleMap;
