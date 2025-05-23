import { useState } from 'react';
import Map from './Map'; // The existing stylized map
import LeafletMap from './LeafletMap'; // Our new OpenStreetMap integration
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const MapSwitcher = () => {
  const [mapType, setMapType] = useState<'stylized' | 'satellite'>('stylized');

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div className="w-full h-full">
        {mapType === 'stylized' ? (
          <Map />
        ) : (
          <LeafletMap />
        )}
      </div>

      {/* Map type switcher */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="bg-white/90 backdrop-blur-md rounded-full p-1 shadow-lg border border-orange-200 flex">
          <Button
            variant={mapType === 'stylized' ? 'default' : 'ghost'}
            onClick={() => setMapType('stylized')}
            className={`rounded-full px-4 ${
              mapType === 'stylized' 
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                : 'text-orange-700 hover:bg-orange-50'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2"
            >
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
              <line x1="9" x2="9" y1="3" y2="18"/>
              <line x1="15" x2="15" y1="6" y2="21"/>
            </svg>
            Artistic Map
          </Button>
          <Button
            variant={mapType === 'satellite' ? 'default' : 'ghost'}
            onClick={() => setMapType('satellite')}
            className={`rounded-full px-4 ${
              mapType === 'satellite' 
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                : 'text-orange-700 hover:bg-orange-50'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2"
            >
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Real Map
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default MapSwitcher;