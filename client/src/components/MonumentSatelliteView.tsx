import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Monument } from '../data/monuments';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MonumentSatelliteViewProps {
  monument: Monument;
}

const MonumentSatelliteView = ({ monument }: MonumentSatelliteViewProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Create a custom marker icon
  const monumentIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <Card className="border-amber-200 shadow-lg w-full h-full overflow-hidden bg-white/90 backdrop-blur-md">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg text-orange-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-orange-600">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          Satellite View - {monument.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] w-full">
          {isLoaded && (
            <MapContainer 
              center={[monument.coordinates[1], monument.coordinates[0]]} 
              zoom={16} 
              style={{ height: '100%', width: '100%' }}
              attributionControl={true}
            >
              {/* Use a satellite tile layer from OpenStreetMap */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              <Marker 
                position={[monument.coordinates[1], monument.coordinates[0]]}
                icon={monumentIcon}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{monument.name}</h3>
                    <p className="text-sm">{monument.city}, {monument.state}</p>
                    <p className="text-xs mt-1">Built: {monument.yearBuilt}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonumentSatelliteView;