import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { monuments } from '../data/monuments';
import { useLocation } from 'wouter';
import { useAudio } from '../lib/stores/useAudio';

const LeafletMap = () => {
  const [, setLocation] = useLocation();
  const audio = useAudio();

  // Create custom icon for monuments
  const createCustomIcon = (isUNESCO: boolean = false) => {
    return new Icon({
      iconUrl: isUNESCO 
        ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png'
        : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  const handleMarkerClick = (monumentId: string) => {
    const monument = monuments.find(m => m.id === monumentId);
    if (monument) {
      audio.playHit();
      setLocation(`/monument/${monumentId}`);
    }
  };

  return (
    <div className="h-full w-full relative z-10">
      <MapContainer 
        center={[20.5937, 78.9629]} // Center of India
        zoom={5} 
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {monuments.map(monument => (
          <Marker 
            key={monument.id}
            position={[monument.coordinates[1], monument.coordinates[0]]} // Leaflet uses [lat, lng] format
            icon={createCustomIcon(monument.UNESCO || false)}
            eventHandlers={{
              click: () => handleMarkerClick(monument.id)
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-orange-800">{monument.name}</h3>
                <p className="text-sm text-gray-600">{monument.city}, {monument.state}</p>
                <p className="text-xs mt-1 text-gray-500">Built: {monument.yearBuilt}</p>
                {monument.UNESCO && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                    UNESCO Heritage
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Information overlay */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-orange-200 max-w-xs">
        <h3 className="font-medium text-orange-800 text-sm mb-1">Interactive Map</h3>
        <p className="text-xs text-orange-700/80">
          Click on markers to explore India's historical monuments. Gold markers represent UNESCO World Heritage sites.
        </p>
      </div>
    </div>
  );
};

export default LeafletMap;