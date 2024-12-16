import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';

interface MapConfig {
  apiKey: string;
  mapId: string;
  position: {
    lat: number;
    lng: number;
  };
}
const GoogleMap: React.FC<MapConfig> = () => {
  const [mapConfig, setConfig] = useState<MapConfig | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/map');
        if (!response.ok) {
          throw new Error('Failed to fetch map ');
        }
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error('Error fetching map config', error);
      }
    };

    fetchConfig();
  }, []);

  if (!mapConfig) {
    return <p>Loading..</p>;
  }
  return (
    <>
      <APIProvider apiKey={mapConfig.apiKey} language='en'>
        <div style={{ height: '50vh', width: '100%' }}>
          <Map zoom={10} center={mapConfig.position} mapId={mapConfig.mapId}>
            <AdvancedMarker position={mapConfig.position}></AdvancedMarker>
          </Map>
        </div>
      </APIProvider>
    </>
  );
};

export default GoogleMap;
// import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

// const GoogleMap = () => {
//   //* For now I just added Malmö latitude and longitude
//   const position = { lat: Number(55.605), lng: Number(13.0038) };

//   return (
//     <>
//       <APIProvider
//         apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
//         language='en'
//       >
//         <div style={{ height: '50vh', width: '100%' }}>
//           <Map
//             zoom={10}
//             center={position}
//             mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
//           >
//             <AdvancedMarker position={position}></AdvancedMarker>
//           </Map>
//         </div>
//       </APIProvider>
//     </>
//   );
// };

// export default GoogleMap;
