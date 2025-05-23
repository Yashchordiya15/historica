import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { monuments } from "../data/monuments";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
// Removed useAppContext import as we're using local state
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import SketchfabModel from "./SketchfabModel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAudio } from "../lib/stores/useAudio";
import { useMonumentStore } from "../lib/stores/useMonumentStore";
import MonumentSatelliteView from "./MonumentSatelliteView";

const MonumentDisplay = ({ modelPath }: { modelPath: string }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load model with react-three-fiber's useGLTF
  const { scene } = useGLTF(modelPath);
  
  useEffect(() => {
    // Check if model has loaded successfully
    try {
      if (scene) {
        setLoading(false);
        console.log(`Model loaded: ${modelPath}`);
      } else {
        throw new Error("Failed to load model");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error loading model";
      setError(errorMessage);
      setLoading(false);
      console.error("Model loading error:", err);
    }
  }, [modelPath, scene]);
  
  if (loading) {
    return (
      <>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="grey" />
        </mesh>
        <Environment preset="sunset" />
        <OrbitControls />
      </>
    );
  }
  
  if (error || !scene) {
    return (
      <>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <Environment preset="sunset" />
        <OrbitControls />
      </>
    );
  }
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <primitive 
        object={scene} 
        position={[0, modelPath.includes('sanchi_stupa') ? 0.5 : 0, 0]} 
        scale={modelPath.includes('sanchi_stupa') ? 2.5 : 1.5} 
      />
      <Environment preset="sunset" />
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={0.5} 
        minPolarAngle={Math.PI / 6} 
        maxPolarAngle={Math.PI / 2} 
      />
    </>
  );
};

const MonumentDetail = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute<{ id: string }>("/monument/:id");
  // Default params variable to an empty object with id to avoid null checks
  const safeParams = params || { id: "" };
  // Temporarily replace context with local state
  const [selectedMonument, setSelectedMonument] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const audio = useAudio();
  const { incrementVisitCount, getVisitCount } = useMonumentStore();

  useEffect(() => {
    if (!match) return;
    
    const monument = monuments.find(m => m.id === safeParams.id);
    if (monument) {
      setSelectedMonument(monument);
      incrementVisitCount(monument.id);
    } else {
      setLocation("/");
    }
  }, [match, safeParams.id]);

  const handleARView = () => {
    audio.playHit();
    setLocation(`/monument/${safeParams.id}/ar`);
  };

  const handleVRView = () => {
    audio.playHit();
    setLocation(`/monument/${safeParams.id}/vr`);
  };

  const handleTimeTravel = () => {
    audio.playSuccess();
    setLocation(`/monument/${safeParams.id}/timetravel`);
  };

  const handleComparisonView = () => {
    audio.playSuccess();
    setLocation(`/monument/${safeParams.id}/compare`);
  };
  
  const handleSketchfabView = () => {
    audio.playSuccess();
    setLocation(`/monument/${safeParams.id}/sketchfab`);
  };

  const handleBackToMap = () => {
    audio.playHit();
    setLocation("/");
  };

  if (!selectedMonument) return null;

  const visitCount = getVisitCount(selectedMonument.id);

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-gradient-to-tr from-amber-50 via-orange-50 to-amber-100">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20 z-0">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-orange-400 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-red-400 blur-3xl"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="w-full md:w-1/2 h-[40vh] md:h-full relative overflow-auto"
      >
        {/* Canvas backdrop with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-800/30 to-red-900/30 backdrop-blur-sm z-0 rounded-lg md:rounded-r-none rounded-b-none md:rounded-b-lg m-2 md:ml-2 md:my-2 md:mr-0"></div>
        
        {/* Time Travel Controls at the top */}
        <div className="absolute top-6 left-6 right-6 flex justify-center z-20">
          <div className="inline-flex bg-white/90 backdrop-blur-md rounded-lg border border-amber-200 shadow-md overflow-hidden">
            <button 
              onClick={handleTimeTravel}
              className="px-4 py-2 text-sm font-medium flex items-center bg-white text-amber-800 hover:bg-amber-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-amber-600">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Ancient (Original)
            </button>
            <div className="w-px bg-amber-200"></div>
            <button 
              onClick={handleTimeTravel}
              className="px-4 py-2 text-sm font-medium flex items-center bg-white text-amber-800 hover:bg-amber-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-amber-600">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Past Century
            </button>
            <div className="w-px bg-amber-200"></div>
            <button 
              onClick={handleTimeTravel}
              className="px-4 py-2 text-sm font-medium flex items-center bg-gradient-to-br from-amber-500 to-orange-600 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Present Day
            </button>
          </div>
        </div>

        {selectedMonument.id === 'somnath-temple' ? (
          <div className="relative w-full h-full z-10 rounded-lg md:rounded-r-none rounded-b-none md:rounded-b-lg overflow-hidden">
            <div className="absolute inset-0">
              <SketchfabModel 
                modelId="af914f8e413a49b791772f0afbeae4a5" 
                width="100%" 
                height="100%" 
                autoLoad={true} 
                className="bg-white"
              />
              {/* Custom frame around the model to hide UI elements */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-amber-800 via-amber-700 to-transparent z-20"></div>
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-amber-800 via-amber-700 to-transparent z-20"></div>
              <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-amber-800 via-amber-700 to-transparent z-20"></div>
              <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-amber-800 via-amber-700 to-transparent z-20"></div>
              
              {/* Corners for better coverage */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-800/90 to-transparent z-20"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-800/90 to-transparent z-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-800/90 to-transparent z-20"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-800/90 to-transparent z-20"></div>
            </div>
          </div>
        ) : (
          <Canvas shadows camera={{ position: [0, 2, 5], fov: 45 }} className="z-10 rounded-lg md:rounded-r-none rounded-b-none md:rounded-b-lg overflow-hidden">
            <MonumentDisplay modelPath={selectedMonument.primaryModel} />
          </Canvas>
        )}
        
        <div className="absolute bottom-6 left-6 flex flex-wrap gap-2 z-20">
          <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-orange-800 hover:bg-white/90 border-orange-200 shadow-md px-3 py-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M3 11l18-5v12L3 14v-3z"></path>
              <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
            </svg>
            Visits: {visitCount}
          </Badge>
          {selectedMonument.UNESCO && (
            <Badge variant="outline" className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300 shadow-md px-3 py-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
              UNESCO Heritage
            </Badge>
          )}
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
        className="w-full md:w-1/2 h-[60vh] md:h-full overflow-y-auto p-4 relative z-10"
      >
        <Card className="h-full border-amber-200 shadow-xl overflow-y-auto bg-white/90 backdrop-blur-md">
          {/* Decorative header accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
          
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-orange-700">
                  {selectedMonument.name}
                </CardTitle>
                <CardDescription className="text-orange-700/80 flex items-center mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {selectedMonument.city}, {selectedMonument.state}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleBackToMap}
                className="rounded-full h-10 w-10 bg-white hover:bg-orange-50 border-orange-200 text-orange-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 1 0 9 9H3a9 9 0 0 0 9 -9v9a9 9 0 0 0 9 -9A9 9 0 0 0 12 3"/></svg>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4 p-1 bg-gradient-to-r from-amber-100/50 via-orange-100/50 to-red-100/50 rounded-lg">
                <TabsTrigger 
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="history"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"/>
                    <path d="M12 8v4l2 2"/>
                  </svg>
                  History
                </TabsTrigger>
                <TabsTrigger 
                  value="visit"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                    <path d="M3 9h18"/>
                    <path d="M9 21V9"/>
                  </svg>
                  Visit Info
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="bg-white/70 backdrop-blur-sm border border-amber-100 rounded-xl p-4 shadow-sm">
                  <p className="text-orange-900 leading-relaxed">{selectedMonument.description}</p>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-200 shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3 shadow-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <path d="m3 8 4-4 4 4"/>
                        <path d="M7 4v16"/>
                        <path d="M17 8V4h4v4"/>
                        <path d="M21 8H17"/>
                        <path d="M14 12h4v4h-4z"/>
                        <path d="M17 20v-4"/>
                        <path d="M14 20h4"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-amber-900">Quick Facts</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedMonument.facts.map((fact: string, index: number) => (
                      <div key={index} className="flex items-start bg-white/60 p-3 rounded-lg border border-amber-100">
                        <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="text-orange-800">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-center p-3 bg-gradient-to-r from-amber-100/50 via-orange-100/50 to-red-100/50 rounded-lg border border-amber-200 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600 mr-2">
                    <path d="M12 22v-9.4a.6.6 0 0 0-.6-.6H6"></path>
                    <path d="M11 7V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3"></path>
                    <path d="M11 15H6a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h5"></path>
                    <path d="M18 15h2a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2"></path>
                    <path d="M18 22V4"></path>
                  </svg>
                  <p className="text-orange-800 font-medium text-sm">Explore the history tab to discover this monument's heritage!</p>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-amber-900">Built During</h3>
                    </div>
                    <p className="text-orange-800 font-medium pl-10">{selectedMonument.yearBuilt}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                          <path d="M2 20h.01"></path>
                          <path d="M7 20v-4"></path>
                          <path d="M12 20v-8"></path>
                          <path d="M17 20V8"></path>
                          <path d="M22 4v16"></path>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-amber-900">Dynasty</h3>
                    </div>
                    <p className="text-orange-800 font-medium pl-10">{selectedMonument.dynasty}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border border-amber-200 shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <path d="M3 12h4l3 8l4-16l3 8h4"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-amber-900">Historical Significance</h3>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-amber-100">
                    <p className="text-orange-800 leading-relaxed">
                      <span className="font-semibold text-red-800">{selectedMonument.name}</span> stands as a testament to the rich cultural heritage of India.
                      It represents the architectural brilliance of the <span className="font-semibold text-orange-800">{selectedMonument.dynasty}</span> period and
                      has witnessed numerous historical events throughout centuries.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      <div className="bg-amber-100/70 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="m12 6 4 6-4 6-4-6 4-6"/>
                        </svg>
                        Architectural Marvel
                      </div>
                      <div className="bg-amber-100/70 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M12 13V7"/>
                          <path d="m15 10-3-3-3 3"/>
                          <rect width="18" height="18" x="3" y="3" rx="2"/>
                          <path d="M3 9h18"/>
                          <path d="M3 15h18"/>
                        </svg>
                        Cultural Heritage
                      </div>
                      <div className="bg-amber-100/70 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M12 22v-6"/>
                          <path d="M9 8V2h6v6"/>
                          <path d="M5 12v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/>
                          <circle cx="12" cy="17" r="5"/>
                        </svg>
                        Historical Significance
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={handleTimeTravel}
                    className="group relative bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 hover:border-amber-300 hover:from-amber-100 hover:to-orange-200 text-amber-800 px-8 py-3 rounded-xl overflow-hidden transition-all duration-300"
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 flex justify-center overflow-hidden opacity-20">
                      <div className="w-24 h-24 rounded-full bg-amber-500 blur-xl absolute group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                    
                    {/* Icon with animated ring */}
                    <div className="relative z-10 flex items-center">
                      <div className="relative mr-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-inner">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                        </div>
                        <div className="absolute inset-0 border-2 border-amber-400 rounded-full animate-ping opacity-40"></div>
                      </div>
                      
                      <div className="flex flex-col items-start">
                        <span className="text-sm opacity-70">Discover How It Looked</span>
                        <span className="text-lg font-bold">Time Travel Experience</span>
                      </div>
                    </div>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="visit" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-amber-900">Visiting Hours</h3>
                    </div>
                    <p className="text-orange-800 font-medium pl-10">{selectedMonument.visitingHours}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="M7 15h0M12 15h0" />
                          <path d="M7 8h10" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-amber-900">Entry Fee</h3>
                    </div>
                    <p className="text-orange-800 font-medium pl-10">{selectedMonument.entryFee || "Free entry"}</p>
                  </div>
                </div>
                
                {/* Add Satellite View */}
                <div className="mt-4 mb-6 border border-amber-200 rounded-xl overflow-hidden shadow-lg">
                  <div className="h-[300px]">
                    <MonumentSatelliteView monument={selectedMonument} />
                  </div>
                </div>
                
                <div className="mt-4 bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border border-amber-200 shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <circle cx="16" cy="14" r="2"></circle>
                        <path d="M16 14v-4"></path>
                        <path d="M8 14h3"></path>
                        <path d="M8 10h3"></path>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-orange-800">Best Time to Visit</h3>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-amber-100">
                    <p className="text-orange-800">
                      The best time to visit {selectedMonument.name} is during the months of <span className="font-semibold">October to March</span>
                      when the weather is pleasant. Early morning visits are recommended to avoid crowds.
                    </p>
                    
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
                        const isRecommended = index < 3 || index > 8;
                        return (
                          <div 
                            key={month} 
                            className={`text-center py-2 px-1 rounded ${isRecommended 
                              ? 'bg-gradient-to-br from-green-50 to-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-gray-50 text-gray-500 border border-gray-200'}`}
                          >
                            {month}
                            {isRecommended && (
                              <div className="mt-1 flex justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6 9 17l-5-5"/>
                                </svg>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col md:flex-row gap-4 border-t border-amber-100 pt-6 pb-4">
            <div className="w-full md:w-auto flex flex-col gap-4">
              <h3 className="font-semibold text-amber-900 flex items-center text-sm mb-0 md:mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-amber-600">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M12 18v-6"></path>
                  <path d="M8 18v-1"></path>
                  <path d="M16 18v-3"></path>
                </svg>
                Experience Options
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <Button 
                  variant="default" 
                  onClick={handleARView}
                  className="relative overflow-hidden group bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 border-none px-5 py-4 h-auto rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {/* Animated ray background */}
                  <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    <div className="w-48 h-48 bg-gradient-to-r from-amber-400 to-orange-200 blur-xl rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="relative mr-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner transform group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                      <path d="M21 4c0 9.941-8.059 18-18 18M14 4.5v1M14 10.5v1M14 16.5v1M9.5 18h1M3.5 18h1M3 13.054C4.285 13.29 5.5 14.353 5.5 16M21 22h-6M21 7V3h-4M3 7V3h4"/>
                    </svg>
                  </div>
                  <div className="flex flex-col items-start relative z-10">
                    <span className="text-xs opacity-80">Experience In</span>
                    <span className="text-lg font-bold">Augmented Reality</span>
                  </div>
                </Button>
                
                <Button 
                  variant="secondary" 
                  onClick={handleVRView}
                  className="group relative overflow-hidden bg-white border border-amber-200 text-orange-700 hover:bg-orange-50 px-5 py-4 h-auto rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {/* Animated circle background */}
                  <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-gradient-to-r from-amber-200 to-orange-100 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-30"></div>
                  
                  <div className="relative mr-3 w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-inner transform group-hover:rotate-12 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                      <path d="M6 5.341A8 8 0 1 0 18 5.334M9 9h.01M15 9h.01"/>
                      <rect width="20" height="12" x="2" y="6" rx="2"/>
                    </svg>
                  </div>
                  <div className="flex flex-col items-start relative z-10">
                    <span className="text-xs opacity-80">Experience In</span>
                    <span className="text-lg font-bold">Virtual Reality</span>
                  </div>
                </Button>
              </div>
              
              <Button
                onClick={handleTimeTravel}
                className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 hover:border-amber-300 hover:from-amber-100 hover:to-orange-200 text-amber-800 px-5 py-4 h-auto w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* Time ripple effect */}
                <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-400/30 absolute group-hover:scale-[4] transition-transform duration-1000 opacity-0 group-hover:opacity-40"></div>
                  <div className="w-12 h-12 rounded-full border-4 border-amber-400/30 absolute group-hover:scale-[3] transition-transform duration-700 delay-100 opacity-0 group-hover:opacity-40"></div>
                  <div className="w-8 h-8 rounded-full border-4 border-amber-400/30 absolute group-hover:scale-[2] transition-transform duration-500 delay-200 opacity-0 group-hover:opacity-40"></div>
                </div>
                
                {/* Icon with animated ring */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div className="absolute inset-0 border-2 border-amber-400/60 rounded-full animate-ping"></div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs opacity-80">Explore Through</span>
                    <span className="text-lg font-bold">Time Travel</span>
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={handleComparisonView}
                className="group relative overflow-hidden bg-gradient-to-br from-violet-50 to-purple-100 border-purple-200 hover:border-purple-300 hover:from-violet-100 hover:to-purple-200 text-purple-800 px-5 py-4 h-auto w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300 mt-4"
              >
                {/* Comparison ripple effect */}
                <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-400/30 absolute group-hover:scale-[4] transition-transform duration-1000 opacity-0 group-hover:opacity-40"></div>
                  <div className="w-12 h-12 rounded-full border-4 border-purple-400/30 absolute group-hover:scale-[3] transition-transform duration-700 delay-100 opacity-0 group-hover:opacity-40"></div>
                </div>
                
                {/* Icon with animated split */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <path d="M7 22V2m10 20V2M2 12h20M2 7h5m10 0h5M2 17h5m10 0h5"/>
                      </svg>
                    </div>
                    <div className="absolute inset-0 border-2 border-purple-400/60 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs opacity-80">Compare Across</span>
                    <span className="text-lg font-bold">Time Periods</span>
                  </div>
                </div>
              </Button>
              
              {/* Sketchfab Button - Only show for monuments that have Sketchfab integration */}
              {selectedMonument.id === "somnath-temple" && (
                <Button
                  onClick={handleSketchfabView}
                  className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200 hover:border-blue-300 hover:from-blue-100 hover:to-cyan-200 text-blue-800 px-5 py-4 h-auto w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300 mt-4"
                >
                  {/* Sketchfab ripple effect */}
                  <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-400/30 absolute group-hover:scale-[4] transition-transform duration-1000 opacity-0 group-hover:opacity-40"></div>
                    <div className="w-12 h-12 rounded-full border-4 border-blue-400/30 absolute group-hover:scale-[3] transition-transform duration-700 delay-100 opacity-0 group-hover:opacity-40"></div>
                  </div>
                  
                  {/* Icon with animated glow */}
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="relative mr-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.29 7 12 12 20.71 7"></polyline>
                          <line x1="12" y1="22" x2="12" y2="12"></line>
                        </svg>
                      </div>
                      <div className="absolute inset-0 border-2 border-blue-400/60 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xs opacity-80">View Detailed</span>
                      <span className="text-lg font-bold">Sketchfab Model</span>
                    </div>
                  </div>
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default MonumentDetail;