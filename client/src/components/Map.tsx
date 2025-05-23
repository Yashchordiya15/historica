import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { monuments } from "../data/monuments";
import { useLocation } from "wouter";
import { useAudio } from "../lib/stores/useAudio";
// Removed useAppContext import as we're using a local implementation
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const Map = () => {
  const [, setLocation] = useLocation();
  const [showIntro, setShowIntro] = useState(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisitedHistorica');
    return !hasVisited; // Show intro only if they haven't visited
  });
  const [zoom, setZoom] = useState(1);
  // Use a default function instead of context until we fix the context issue
  const setSelectedMonument = (monument: any) => {
    // This is a temporary workaround
    console.log("Selected monument:", monument.name);
    // The real logic will be handled in the destination component
  };
  const audio = useAudio();

  useEffect(() => {
    // Try to autoplay background music (may be blocked by browsers)
    try {
      const bgMusic = audio.backgroundMusic;
      if (bgMusic) {
        bgMusic.play().catch(err => {
          console.log("Background music auto-play prevented:", err);
        });
      }
    } catch (error) {
      console.error("Error playing background music:", error);
    }
  }, []);

  const handleMarkerClick = (monumentId: string) => {
    const monument = monuments.find(m => m.id === monumentId);
    if (monument) {
      setSelectedMonument(monument);
      audio.playHit();
      setLocation(`/monument/${monumentId}`);
    }
  };

  const handleZoomIn = () => {
    if (zoom >= 2) return;
    setZoom(zoom * 1.2);
  };

  const handleZoomOut = () => {
    if (zoom <= 0.5) return;
    setZoom(zoom / 1.2);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-amber-50 via-orange-50 to-orange-100">
      {/* Decorative map elements */}
      <div className="absolute inset-0 opacity-10 z-0 overflow-hidden">
        <div className="absolute w-1/3 h-1/3 rounded-full bg-orange-300 blur-3xl top-1/3 left-10"></div>
        <div className="absolute w-1/4 h-1/4 rounded-full bg-yellow-300 blur-2xl bottom-1/4 right-1/4"></div>
        <div className="absolute w-1/5 h-1/5 rounded-full bg-red-300 blur-xl top-1/4 right-1/3"></div>
      </div>

      {showIntro && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-b from-orange-900/80 to-amber-800/80 backdrop-blur-sm"
        >
          <Card className="w-[90%] max-w-2xl bg-white/90 backdrop-blur-md border-orange-200 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden opacity-25">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-orange-400 blur-2xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-yellow-400 blur-2xl"></div>
            </div>
            <CardContent className="p-8 relative z-10">
              <motion.div 
                initial={{ y: -50 }} 
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                    <line x1="9" x2="9" y1="3" y2="18"/>
                    <line x1="15" x2="15" y1="6" y2="21"/>
                  </svg>
                </div>

                <motion.h1 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold text-center mb-2 text-orange-800 tracking-tight"
                >
                  Historica
                </motion.h1>
                
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-32 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mb-6"
                ></motion.div>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                className="text-lg text-center mb-8 text-orange-700 leading-relaxed"
              >
                Embark on a breathtaking journey through India's magnificent architectural wonders.
                Explore historical monuments in AR and VR, and travel through time to witness their
                evolution across centuries.
              </motion.p>
              
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.7 } }}
                className="flex justify-center"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-none px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                  onClick={() => {
                    // Set localStorage to remember user has visited
                    localStorage.setItem('hasVisitedHistorica', 'true');
                    setShowIntro(false);
                    audio.playSuccess();
                  }}
                >
                  Begin Your Journey
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div 
        className="absolute top-4 right-4 z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-orange-200 flex flex-col gap-2">
          <Button 
            onClick={handleZoomIn} 
            variant="ghost" 
            size="icon"
            className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </Button>
          
          <Button 
            onClick={handleZoomOut} 
            variant="ghost" 
            size="icon"
            className="h-10 w-10 rounded-full bg-white hover:bg-orange-50 text-orange-900 border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </Button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-full overflow-hidden"
      >
        <div className="relative" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
          {/* India Map with Enhanced Styling */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Colorful effects */}
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="15" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                
                <linearGradient id="indiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="30%" stopColor="#7C3AED" />
                  <stop offset="70%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
                
                <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                </radialGradient>
                
                <linearGradient id="indiaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#EC4899" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.8" />
                </linearGradient>
                
                <pattern id="dotPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="1" fill="white" fillOpacity="0.3" />
                </pattern>
              </defs>
              
              {/* Background glow effect */}
              <circle cx="400" cy="400" r="300" fill="url(#glowGradient)" opacity="0.5" />
              
              {/* Shadow effect */}
              <path 
                d="M380,160 L420,160 L460,175 L500,190 L520,210 L540,235 L560,265 L575,300 L585,340 L590,380 L590,420 L585,460 L575,500 L560,535 L545,565 L525,590 L500,610 L470,625 L435,640 L400,645 L365,640 L330,625 L300,610 L275,590 L255,565 L240,535 L225,500 L215,460 L210,420 L210,380 L215,340 L225,300 L240,265 L260,235 L280,210 L300,190 L340,175 L380,160 M455,175 L470,185 L485,195 M460,175 L475,150 L490,140 L505,135 M505,135 L530,145 L550,165 M440,635 L450,655 L460,670 M365,640 L375,655 L385,665 M385,665 L400,670 L415,665 M210,380 L190,385 L170,375 L160,360 M160,360 L155,330 L165,300 M590,380 L610,385 L625,375 L635,360 M635,360 L640,330 L630,300" 
                fill="#00000025"
                transform="translate(8, 8)"
              />
              
              {/* Map outline glow */}
              <path 
                d="M400,150 L430,155 L460,165 L485,180 L505,195 L520,210 L532,225 
                L545,245 L555,265 L565,290 L575,315 L580,340 L585,365 L588,390 
                L590,415 L588,440 L585,465 L580,490 L573,515 L565,540 L555,560 
                L545,575 L532,590 L520,602 L505,615 L490,625 L475,633 L460,638 
                L445,643 L430,645 L415,647 L400,648 L385,647 L370,645 L355,643 
                L340,638 L325,633 L310,625 L295,615 L280,602 L268,590 L255,575 
                L245,560 L235,540 L227,515 L220,490 L215,465 L212,440 L210,415 
                L212,390 L215,365 L220,340 L225,315 L235,290 L245,265 L255,245 
                L268,225 L280,210 L295,195 L315,180 L340,165 L370,155 L400,150" 
                stroke="url(#indiaGlow)" 
                strokeWidth="10" 
                strokeOpacity="0.8"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#glow)"
              />
              
              {/* Main map outline - Detailed India shape */}
              <path 
                d="M372,150 L395,140 L415,135 L435,132 L450,130 L465,135 L480,145 
                L492,160 L500,175 L505,190 L510,205 L518,222 L525,240 
                L535,255 L545,270 L552,285 L557,300 L562,315 L569,330 
                L576,345 L583,360 L589,375 L593,390 L594,402 L595,415 
                L594,430 L592,445 L589,460 L584,475 L578,490 L572,505 
                L565,520 L557,535 L548,550 L540,562 L530,575 L520,585 
                L509,597 L495,608 L482,615 L470,620 L458,623 L445,625 
                L430,626 L415,627 L400,628 L385,627 L370,626 L355,625 
                L340,623 L327,620 L315,616 L300,610 L285,600 L270,589 
                L258,575 L245,560 L235,543 L225,525 L217,505 L212,485 
                L208,465 L205,445 L202,425 L200,405 L202,385 L205,365 
                L210,345 L215,325 L220,305 L228,290 L235,275 L245,260 
                L255,245 L268,230 L280,215 L293,200 L308,187 L325,175 
                L345,165 L360,155 L372,150"
                fill="url(#indiaGradient)" 
                stroke="white"
                strokeWidth="2.5"
              />
              
              {/* Add detailed map regions */}
              <path 
                d="M450,132 L465,120 L475,105 L490,95 L505,90 L520,89 
                L535,92 L550,100 L562,112 L570,125 L575,140 L570,155 
                L560,165 L548,175 L535,180 L520,182 L507,177 L495,165"
                stroke="white"
                strokeWidth="1.5"
                fill="url(#indiaGradient)"
                fillOpacity="0.8"
                strokeLinejoin="round"
              />
              
              {/* Western Coast */}
              <path 
                d="M208,465 L195,470 L185,480 L180,495 L175,510 L178,525 
                L185,540 L195,553 L205,565 L215,575 L225,582 L233,590"
                stroke="white"
                strokeWidth="1.5"
                fill="url(#indiaGradient)"
                fillOpacity="0.8"
                strokeLinejoin="round"
              />
              
              {/* Eastern Coast */}
              <path 
                d="M580,490 L590,500 L598,510 L605,520 L610,532 L612,545 
                L608,558 L600,570 L590,580 L580,588 L570,595 L560,600 L550,605"
                stroke="white"
                strokeWidth="1.5"
                fill="url(#indiaGradient)"
                fillOpacity="0.8"
                strokeLinejoin="round"
              />
              
              {/* Southern Peninsula */}
              <path 
                d="M400,628 L405,635 L410,645 L412,655 L415,665 L415,675 
                L412,685 L405,695 L398,702 L390,708 L380,710 L370,708 
                L362,702 L355,695 L350,685 L350,675 L352,665 L355,655 L360,645 L365,635 L370,628"
                stroke="white"
                strokeWidth="1.5"
                fill="url(#indiaGradient)"
                fillOpacity="0.8"
                strokeLinejoin="round"
              />
              
              {/* Kashmir Region - More Detailed */}
              <path 
                d="M440,165 L450,155 L460,145 L470,135 L480,125 L492,115 L505,110 
                L520,108 L535,110 L550,115 L562,125 L572,135 L578,145 L580,160 
                L565,175 L550,185 L535,195 L520,203 L505,208"
                stroke="white"
                strokeWidth="2.5"
                fill="url(#indiaGradient)"
                strokeLinejoin="round"
              />
              
              {/* North Eastern States */}
              <path 
                d="M580,265 L595,260 L610,255 L625,250 L640,248 L655,250 L665,255 
                L675,265 L680,280 L682,295 L680,310 L675,325 L665,335 L655,340 
                L640,338 L625,330 L610,320 L595,310 L585,300"
                stroke="white" 
                strokeWidth="2.5"
                fill="url(#indiaGradient)"
                strokeLinejoin="round"
              />
              
              {/* Gujarat Peninsula - More Detailed */}
              <path 
                d="M210,380 L195,385 L180,390 L165,385 L153,375 L145,360 L140,345 
                L138,330 L140,315 L145,300 L155,290 L165,283 L180,280 L195,283 
                L205,290"
                stroke="white"
                strokeWidth="2.5"
                fill="url(#indiaGradient)"
                strokeLinejoin="round"
              />
              
              {/* Southern Peninsula */}
              <path 
                d="M400,648 L410,655 L420,665 L428,680 L430,695 L428,710 L420,720 
                L410,725 L400,728 L390,725 L380,720 L372,710 L370,695 L372,680 
                L380,665 L390,655 L400,648"
                stroke="white"
                strokeWidth="2.5"
                fill="url(#indiaGradient)"
                strokeLinejoin="round"
              />
              
              {/* Major states borders - simplified */}
              <path 
                d="M320,300 L480,300 M350,380 L450,380 M320,460 L480,460
                M400,200 L400,600 M320,300 L320,460 M480,300 L480,460"
                stroke="rgba(255,255,255,0.4)" 
                strokeWidth="1.5" 
                strokeDasharray="8,8" 
                fill="none"
              />
              
              {/* Decorative Coastal outline glow */}
              <path 
                d="M400,150 L430,155 L460,165 L485,180 L505,195 L520,210 L532,225 
                L545,245 L555,265 L565,290 L575,315 L580,340 L585,365 L588,390 
                L590,415 L588,440 L585,465 L580,490 L573,515 L565,540 L555,560 
                L545,575 L532,590 L520,602 L505,615 L490,625 L475,633 L460,638 
                L445,643 L430,645 L415,647 L400,648 L385,647 L370,645 L355,643 
                L340,638 L325,633 L310,625 L295,615 L280,602 L268,590 L255,575 
                L245,560 L235,540 L227,515 L220,490 L215,465 L212,440 L210,415 
                L212,390 L215,365 L220,340 L225,315 L235,290 L245,265 L255,245 
                L268,225 L280,210 L295,195 L315,180 L340,165 L370,155 L400,150"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="6"
                filter="url(#glow)"
                fill="none"
              />
              
              {/* Dot pattern overlay */}
              <path 
                d="M380,160 L420,160 L460,175 L500,190 L520,210 L540,235 L560,265 L575,300 L585,340 L590,380 L590,420 L585,460 L575,500 L560,535 L545,565 L525,590 L500,610 L470,625 L435,640 L400,645 L365,640 L330,625 L300,610 L275,590 L255,565 L240,535 L225,500 L215,460 L210,420 L210,380 L215,340 L225,300 L240,265 L260,235 L280,210 L300,190 L340,175 L380,160" 
                fill="url(#dotPattern)" 
              />
              
              {/* Major cities with colorful markers */}
              <circle cx="350" cy="250" r="4" fill="#EC4899" />
              <circle cx="350" cy="250" r="8" fill="#EC4899" fillOpacity="0.3" />
              
              <circle cx="450" cy="350" r="4" fill="#F59E0B" />
              <circle cx="450" cy="350" r="8" fill="#F59E0B" fillOpacity="0.3" />
              
              <circle cx="400" cy="550" r="4" fill="#10B981" />
              <circle cx="400" cy="550" r="8" fill="#10B981" fillOpacity="0.3" />
              
              <circle cx="500" cy="450" r="4" fill="#3B82F6" />
              <circle cx="500" cy="450" r="8" fill="#3B82F6" fillOpacity="0.3" />
              
              <circle cx="300" cy="450" r="4" fill="#8B5CF6" />
              <circle cx="300" cy="450" r="8" fill="#8B5CF6" fillOpacity="0.3" />
              
              {/* State boundaries (simplified) */}
              <path 
                d="M350,300 L450,300 M300,400 L500,400 M400,200 L400,600" 
                stroke="white" 
                strokeWidth="1" 
                strokeDasharray="5,5" 
                strokeOpacity="0.5"
              />
            </svg>
          </div>
          
          {/* Monument Markers */}
          <div className="absolute inset-0">
            {monuments.map(monument => (
              <div
                key={monument.id}
                className="absolute cursor-pointer transition-all duration-300 hover:scale-125"
                style={{
                  // More accurate placement of monuments on the India map
                  // Longitude (x): Scale from 68-97 longitude range to fit the map width
                  // Latitude (y): Scale from 8-37 latitude range to fit the map height
                  left: `${((monument.coordinates[0] - 68) / (97 - 68)) * 590 + 210}px`,
                  top: `${(1 - ((monument.coordinates[1] - 8) / (37 - 8))) * 560 + 160}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleMarkerClick(monument.id)}
              >
                <div className="relative group">
                  {/* We'll use a simpler approach with hardcoded colors based on index */}
                  {(() => {
                    // Determine color variant based on monument ID's first character
                    // Use the character code for deterministic color selection
                    const idFirstChar = monument.id.charAt(0);
                    const variant = idFirstChar.charCodeAt(0) % 5; // 5 different color variants
                    
                    // Define marker based on variant
                    switch(variant) {
                      case 0:
                        return (
                          <>
                            <div className="absolute inset-0 rounded-full bg-pink-500 opacity-50 animate-ping"></div>
                            <div className="relative w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full border-2 border-white shadow-lg z-10 transition-transform group-hover:scale-125"></div>
                            <div className="absolute -inset-2 border-2 border-pink-400/30 rounded-full group-hover:scale-110 transition-transform"></div>
                          </>
                        );
                      case 1:
                        return (
                          <>
                            <div className="absolute inset-0 rounded-full bg-purple-500 opacity-50 animate-ping"></div>
                            <div className="relative w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full border-2 border-white shadow-lg z-10 transition-transform group-hover:scale-125"></div>
                            <div className="absolute -inset-2 border-2 border-purple-400/30 rounded-full group-hover:scale-110 transition-transform"></div>
                          </>
                        );
                      case 2:
                        return (
                          <>
                            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-50 animate-ping"></div>
                            <div className="relative w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full border-2 border-white shadow-lg z-10 transition-transform group-hover:scale-125"></div>
                            <div className="absolute -inset-2 border-2 border-blue-400/30 rounded-full group-hover:scale-110 transition-transform"></div>
                          </>
                        );
                      case 3:
                        return (
                          <>
                            <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-50 animate-ping"></div>
                            <div className="relative w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full border-2 border-white shadow-lg z-10 transition-transform group-hover:scale-125"></div>
                            <div className="absolute -inset-2 border-2 border-emerald-400/30 rounded-full group-hover:scale-110 transition-transform"></div>
                          </>
                        );
                      case 4:
                      default:
                        return (
                          <>
                            <div className="absolute inset-0 rounded-full bg-amber-500 opacity-50 animate-ping"></div>
                            <div className="relative w-6 h-6 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full border-2 border-white shadow-lg z-10 transition-transform group-hover:scale-125"></div>
                            <div className="absolute -inset-2 border-2 border-amber-400/30 rounded-full group-hover:scale-110 transition-transform"></div>
                          </>
                        );
                    }
                  })()}
                  
                  {/* Monument name tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white shadow-lg text-gray-800 font-medium text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20">
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-white"></div>
                    {monument.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center"
      >
        <div className="px-5 py-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 backdrop-blur-md rounded-xl shadow-xl border border-indigo-200 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full opacity-20 blur-xl"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            
            <div className="flex flex-col items-start">
              <span className="text-xs text-indigo-600 font-semibold">INDIA HISTORICA</span>
              <p className="text-gray-800 font-medium">
                Click monuments to explore AR/VR experiences & time travel
              </p>
            </div>
          </div>
          
          {/* Interactive button */}
          <motion.div 
            className="absolute -right-1 -bottom-1 w-12 h-12 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Map;
