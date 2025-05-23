import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Monument } from "../data/monuments";

interface MonumentMarkerProps {
  monument: Monument;
  onClick: () => void;
}

const MonumentMarker: React.FC<MonumentMarkerProps> = ({ monument, onClick }) => {
  // Get marker color based on monument location/state
  const markerStyle = useMemo(() => {
    // Map different regions to different colors
    const regionColors: Record<string, { bg: string, ring: string, glow: string }> = {
      "Uttar Pradesh": { bg: "bg-amber-500", ring: "ring-amber-300", glow: "amber" },
      "Delhi": { bg: "bg-emerald-600", ring: "ring-emerald-300", glow: "emerald" },
      "Odisha": { bg: "bg-indigo-600", ring: "ring-indigo-300", glow: "indigo" },
      "Maharashtra": { bg: "bg-purple-600", ring: "ring-purple-300", glow: "purple" },
      "Karnataka": { bg: "bg-sky-500", ring: "ring-sky-300", glow: "sky" },
      "Rajasthan": { bg: "bg-rose-600", ring: "ring-rose-300", glow: "rose" },
      // Default color if state doesn't match
      "default": { bg: "bg-red-600", ring: "ring-red-300", glow: "red" }
    };
    
    const style = regionColors[monument.state] || regionColors.default;
    return style;
  }, [monument.state]);
  
  // UNESCO badges get a gold border
  const isUNESCO = monument.UNESCO;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: Math.random() * 0.5 
      }}
      onClick={onClick}
      style={{ cursor: "pointer" }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      className="absolute"
    >
      {/* Pulsing glow effect for marker */}
      <div className={`absolute inset-0 rounded-full animate-pulse opacity-50 ${markerStyle.bg}`} style={{ filter: 'blur(6px)' }}></div>
      
      {/* The main marker dot */}
      <div className={`relative w-5 h-5 ${markerStyle.bg} rounded-full border-2 ring-2 ${markerStyle.ring} shadow-lg ${isUNESCO ? 'border-yellow-300' : 'border-white'}`}>
        {isUNESCO && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-600 animate-ping"></div>
        )}
      </div>
      
      {/* The monument name label */}
      <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-${markerStyle.glow}-900/90 to-${markerStyle.glow}-700/90 text-white text-xs px-2.5 py-1.5 rounded-full whitespace-nowrap font-medium shadow-md`}>
        {monument.name}
      </div>
    </motion.div>
  );
};

export default memo(MonumentMarker);
