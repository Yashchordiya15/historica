import { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Route, Switch, useRoute } from "wouter";
import LeafletMap from "./components/LeafletMap";
import MonumentDetail from "./components/MonumentDetail";
import ARView from "./components/ARView";
import VRView from "./components/VRView";
import TimeTravel from "./components/TimeTravel";
import MonumentComparison from "./components/MonumentComparison";
import MonumentSketchfab from "./components/MonumentSketchfab";
import Navigation from "./components/Navigation";
import WelcomePage from "./components/WelcomePage";
import SomnathChatbot from "./components/SomnathChatbot";
// Removed useAppContext import as we're not using it in this component
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import { Toaster } from "sonner";
import { Progress } from "./components/ui/progress";

// Define control keys for navigation
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "rotate", keys: ["KeyR"] },
  { name: "zoom", keys: ["KeyZ"] },
];

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  // Remove context usage from the main component - we'll use it only in child components
  const audio = useAudio();

  useEffect(() => {
    // Load background sound
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    audio.setBackgroundMusic(backgroundMusic);

    // Load success sound
    const successSound = new Audio("/sounds/success.mp3");
    successSound.volume = 0.5;
    audio.setSuccessSound(successSound);

    // Load hit sound
    const hitSound = new Audio("/sounds/hit.mp3");
    hitSound.volume = 0.4;
    audio.setHitSound(hitSound);

    // Simulate loading assets
    let loadedItems = 0;
    const totalItems = 10;
    const interval = setInterval(() => {
      loadedItems++;
      setProgress((loadedItems / totalItems) * 100);
      
      if (loadedItems >= totalItems) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 300);

    return () => {
      clearInterval(interval);
      backgroundMusic.pause();
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-400 via-fuchsia-500 to-indigo-500 overflow-hidden relative">
        {/* Taj Mahal silhouette overlay */}
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="absolute inset-0 z-0 opacity-[0.15] bg-[url('https://i.imgur.com/RG1ey3t.png')] bg-center bg-no-repeat bg-contain"></div>
        
        {/* Animated decorative elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {/* Golden circles representing Indian cultural elements */}
          <div className="absolute top-5 left-5 w-64 h-64 rounded-full border-2 border-dashed border-yellow-300/30 animate-spin" style={{animationDuration: '60s'}}></div>
          <div className="absolute bottom-5 right-5 w-80 h-80 rounded-full border-2 border-dashed border-yellow-300/30 animate-spin" style={{animationDuration: '50s', animationDirection: 'reverse'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-2 border-dashed border-yellow-300/30 animate-spin" style={{animationDuration: '70s'}}></div>
          
          {/* Floating glowing particles */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-float opacity-50"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 8 + 5}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  transform: `scale(${Math.random() * 0.8 + 0.2})`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Main title with Indian cultural motif */}
        <div className="relative z-10 flex flex-col items-center mb-10">
          {/* Decorative Indian mandala pattern */}
          <div className="absolute -top-24 w-64 h-64 opacity-20">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" stroke="white" strokeWidth="0.5">
                <circle cx="50" cy="50" r="40" />
                <circle cx="50" cy="50" r="35" />
                <circle cx="50" cy="50" r="30" />
                <circle cx="50" cy="50" r="25" />
                <circle cx="50" cy="50" r="20" />
                <circle cx="50" cy="50" r="15" />
                <path d="M50,10 L50,90 M10,50 L90,50 M22,22 L78,78 M22,78 L78,22" />
                <path d="M50,10 Q70,30 90,50 Q70,70 50,90 Q30,70 10,50 Q30,30 50,10" />
                <path d="M25,25 Q50,0 75,25 Q100,50 75,75 Q50,100 25,75 Q0,50 25,25" />
              </g>
            </svg>
          </div>
          
          <h1 className="text-8xl font-bold mb-2 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-tight font-serif">
            HISTORICA
          </h1>
          
          {/* Decorative divider with Indian cultural motif */}
          <div className="relative flex items-center w-80 my-4">
            <div className="flex-grow border-t-2 border-white/40"></div>
            <span className="px-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" className="opacity-60">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </span>
            <div className="flex-grow border-t-2 border-white/40"></div>
          </div>
          
          <h2 className="text-3xl text-white/90 font-light tracking-widest uppercase">India's Timeless Monuments</h2>
        </div>
        
        {/* Glass card with stylized loading experience */}
        <div className="relative max-w-lg w-full mx-4 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20 z-10 overflow-hidden">
          {/* Card shine effect */}
          <div className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-gradient-to-br from-white/40 to-transparent rounded-full transform rotate-45 blur-xl"></div>
          
          {/* Loading content */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-white flex items-center">
              <span className="w-2 h-6 bg-yellow-300 mr-4"></span>
              Unlocking Wonders
            </h3>
            <div className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
              {Math.round(progress)}%
            </div>
          </div>
          
          {/* Stylized progress bar */}
          <div className="h-1.5 w-full bg-white/20 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 rounded-full"
              style={{ width: `${progress}%`, backgroundSize: '200% 100%', animation: 'shimmer 2s infinite linear' }}
            ></div>
          </div>
          
          {/* Monument loading indicators */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className={`flex items-center ${progress > 25 ? 'text-white' : 'text-white/40'}`}>
              <div className={`w-3 h-3 rounded-full mr-3 ${progress > 25 ? 'bg-yellow-300' : 'bg-white/20'}`}></div>
              <span>Taj Mahal</span>
            </div>
            <div className={`flex items-center ${progress > 50 ? 'text-white' : 'text-white/40'}`}>
              <div className={`w-3 h-3 rounded-full mr-3 ${progress > 50 ? 'bg-yellow-300' : 'bg-white/20'}`}></div>
              <span>Qutub Minar</span>
            </div>
            <div className={`flex items-center ${progress > 75 ? 'text-white' : 'text-white/40'}`}>
              <div className={`w-3 h-3 rounded-full mr-3 ${progress > 75 ? 'bg-yellow-300' : 'bg-white/20'}`}></div>
              <span>Red Fort</span>
            </div>
            <div className={`flex items-center ${progress > 90 ? 'text-white' : 'text-white/40'}`}>
              <div className={`w-3 h-3 rounded-full mr-3 ${progress > 90 ? 'bg-yellow-300' : 'bg-white/20'}`}></div>
              <span>Sun Temple</span>
            </div>
          </div>
          
          {/* Inspirational message */}
          <p className="mt-8 text-white/70 text-sm italic border-l-2 border-yellow-300/50 pl-4">
            "The past becomes the doorway to the future when we embrace our heritage."
          </p>
        </div>
        
        {/* Feature indicators */}
        <div className="flex gap-20 mt-12 relative z-10">
          <div className="flex flex-col items-center group">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/30 flex items-center justify-center mb-3 group-hover:bg-white/20 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                <path d="M2 12h20"></path>
              </svg>
            </div>
            <span className="text-white/80 uppercase text-xs tracking-wider font-light">Explore</span>
          </div>
          
          <div className="flex flex-col items-center group">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/30 flex items-center justify-center mb-3 group-hover:bg-white/20 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"></path>
                <path d="M17 7v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2Z"></path>
                <path d="M10 19v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z"></path>
              </svg>
            </div>
            <span className="text-white/80 uppercase text-xs tracking-wider font-light">Discover</span>
          </div>
          
          <div className="flex flex-col items-center group">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/30 flex items-center justify-center mb-3 group-hover:bg-white/20 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h10"></path>
                <path d="m9 4 8 8-8 8"></path>
                <path d="M12 2v20"></path>
              </svg>
            </div>
            <span className="text-white/80 uppercase text-xs tracking-wider font-light">Time Travel</span>
          </div>
        </div>
        
        {/* Bottom attribution */}
        <div className="absolute bottom-5 text-white/50 text-xs z-10">
          HISTORICA — EXPLORE INDIA'S CULTURAL HERITAGE — {new Date().getFullYear()}
        </div>
      </div>
    );
  }

  return (
    <KeyboardControls map={controls}>
      <div className="h-screen w-screen overflow-hidden relative">
        {/* Welcome Page overlay that only shows on first visit */}
        <WelcomePage onBeginJourney={() => {}} />
        
        <Navigation />
        
        <Toaster position="top-right" richColors />
        
        {/* Somnath Temple Chatbot */}
        <SomnathChatbot />
        
        <main className="w-full h-full">
          <Switch>
            <Route path="/" component={LeafletMap} />
            <Route path="/monument/:id" component={MonumentDetail} />
            <Route path="/monument/:id/ar" component={ARView} />
            <Route path="/monument/:id/vr" component={VRView} />
            <Route path="/monument/:id/timetravel" component={TimeTravel} />
            <Route path="/monument/:id/compare" component={MonumentComparison} />
            <Route path="/monument/:id/sketchfab" component={MonumentSketchfab} />
          </Switch>
        </main>
      </div>
    </KeyboardControls>
  );
}

export default App;
