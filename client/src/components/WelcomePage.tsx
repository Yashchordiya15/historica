import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useAudio } from '../lib/stores/useAudio';

interface WelcomePageProps {
  onBeginJourney: () => void;
}

const WelcomePage = ({ onBeginJourney }: WelcomePageProps) => {
  const audio = useAudio();
  const [showWelcome, setShowWelcome] = useState(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisitedHistorica');
    return !hasVisited; // Show welcome only if they haven't visited
  });

  if (!showWelcome) {
    return null;
  }

  const handleBeginJourney = () => {
    // Set localStorage to remember user has visited
    localStorage.setItem('hasVisitedHistorica', 'true');
    setShowWelcome(false);
    audio.playSuccess();
    onBeginJourney();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-amber-800"
    >
      <div className="w-full max-w-2xl p-8 mx-4 rounded-lg bg-orange-50/95 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
              <line x1="9" x2="9" y1="3" y2="18"/>
              <line x1="15" x2="15" y1="6" y2="21"/>
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-2 text-amber-800">
            Historica
          </h1>
          
          {/* Divider */}
          <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full my-4"></div>

          {/* Description */}
          <p className="text-lg mb-8 text-amber-900 max-w-lg">
            Embark on a breathtaking journey through India's magnificent architectural
            wonders. Explore historical monuments in AR and VR, and travel through
            time to witness their evolution across centuries.
          </p>

          {/* Begin Button */}
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-none px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            onClick={handleBeginJourney}
          >
            Begin Your Journey
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomePage;