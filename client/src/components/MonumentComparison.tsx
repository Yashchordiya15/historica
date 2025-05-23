import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Stats, Environment } from "@react-three/drei";
import { useParams, useLocation, Link } from "wouter";
import { monuments } from "../data/monuments";
import { Monument } from "../data/monuments";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ChevronLeft, Info, Clock, Home, Eye } from "lucide-react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

// Component for model loading with error handling
const Model = ({ url, position, scale = 1, rotation = [0, 0, 0] }: { 
  url: string; 
  position: [number, number, number]; 
  scale?: number;
  rotation?: [number, number, number];
}) => {
  const [error, setError] = useState<string | null>(null);
  
  // Use try-catch to handle loading errors
  try {
    const { scene } = useGLTF(url) as GLTF & { scene: THREE.Group };
    
    // Adjust position and scale for Sanchi Stupa
    const isSanchiStupa = url.includes('sanchi_stupa');
    
    return (
      <primitive 
        object={scene} 
        position={[
          position[0], 
          isSanchiStupa ? position[1] + 0.5 : position[1], 
          position[2]
        ]} 
        scale={[
          isSanchiStupa ? scale * 1.5 : scale, 
          isSanchiStupa ? scale * 1.5 : scale, 
          isSanchiStupa ? scale * 1.5 : scale
        ]} 
        rotation={rotation} 
        castShadow 
        receiveShadow 
      />
    );
  } catch (err: any) {
    // Set error if model fails to load
    useEffect(() => {
      setError(err.message || "Failed to load model");
      console.error("Model loading error:", err);
    }, [err]);

    return (
      <Html center>
        <div className="bg-red-100 text-red-700 p-2 rounded text-sm max-w-xs text-center">
          <p className="font-bold">Error loading model</p>
          <p className="text-xs">{error || "Unknown error"}</p>
        </div>
      </Html>
    );
  }
};

// Preload the models
const usePreloadModels = (monument: Monument | undefined) => {
  useEffect(() => {
    if (monument) {
      // Preload all time period models
      useGLTF.preload(monument.primaryModel);
      useGLTF.preload(monument.historicalModels.past);
      useGLTF.preload(monument.historicalModels.ancient);
    }
  }, [monument]);
};

const MonumentComparison = () => {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const monument = monuments.find(m => m.id === params.id);
  const [showStats, setShowStats] = useState(false);
  
  usePreloadModels(monument);

  // Handle case when monument is not found
  if (!monument) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Monument not found</h2>
        <Button onClick={() => setLocation("/")}>
          <Home className="mr-2 h-4 w-4" /> Return to Map
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header with navigation */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm border-b p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => setLocation(`/monument/${monument.id}`)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-xl font-bold">{monument.name}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{monument.city}, {monument.state}</span>
              {monument.UNESCO && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                  UNESCO Heritage
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowStats(!showStats)}
            className={showStats ? "bg-slate-100" : ""}
          >
            <Info className="h-4 w-4 mr-1" /> {showStats ? "Hide Stats" : "Show Stats"}
          </Button>
        </div>
      </div>
      
      {/* Comparison title */}
      <div className="bg-amber-50 py-2 px-4 border-b border-amber-200">
        <div className="flex items-center justify-center">
          <Clock className="h-4 w-4 mr-2 text-amber-700" />
          <h2 className="text-amber-800 font-medium">Timeline Comparison View</h2>
        </div>
      </div>
      
      {/* Main content with comparison */}
      <div className="flex-1 grid grid-cols-3 h-full">
        {/* Ancient model - left */}
        <div className="relative h-full border-r border-gray-200 overflow-auto">
          <div className="absolute top-0 left-0 right-0 bg-indigo-100 text-indigo-800 py-1 px-3 text-center z-10 font-medium">
            Original Construction ({monument.yearBuilt})
          </div>
          <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
            {showStats && <Stats />}
            <ambientLight intensity={0.5} />
            <directionalLight
              castShadow
              position={[2.5, 8, 5]}
              intensity={1.5}
              shadow-mapSize={[1024, 1024]}
            >
              <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
            </directionalLight>
            <Suspense fallback={null}>
              <Model url={monument.historicalModels.ancient} position={[0, 0, 0]} scale={2.5} rotation={[0, -Math.PI / 4, 0]} />
              <Environment preset="city" />
            </Suspense>
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true} 
              minDistance={2}
              maxDistance={10}
            />
          </Canvas>
        </div>
        
        {/* Past model - middle */}
        <div className="relative h-full border-r border-gray-200 overflow-auto">
          <div className="absolute top-0 left-0 right-0 bg-orange-100 text-orange-800 py-1 px-3 text-center z-10 font-medium">
            ~100 Years Ago
          </div>
          <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
            {showStats && <Stats />}
            <ambientLight intensity={0.5} />
            <directionalLight
              castShadow
              position={[2.5, 8, 5]}
              intensity={1.5}
              shadow-mapSize={[1024, 1024]}
            >
              <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
            </directionalLight>
            <Suspense fallback={null}>
              <Model url={monument.historicalModels.past} position={[0, 0, 0]} scale={2.5} rotation={[0, -Math.PI / 4, 0]} />
              <Environment preset="city" />
            </Suspense>
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              minDistance={2}
              maxDistance={10}
            />
          </Canvas>
        </div>
        
        {/* Present model - right */}
        <div className="relative h-full overflow-auto">
          <div className="absolute top-0 left-0 right-0 bg-emerald-100 text-emerald-800 py-1 px-3 text-center z-10 font-medium">
            Present Day
          </div>
          <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
            {showStats && <Stats />}
            <ambientLight intensity={0.5} />
            <directionalLight
              castShadow
              position={[2.5, 8, 5]}
              intensity={1.5}
              shadow-mapSize={[1024, 1024]}
            >
              <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
            </directionalLight>
            <Suspense fallback={null}>
              <Model url={monument.primaryModel} position={[0, 0, 0]} scale={2.5} rotation={[0, -Math.PI / 4, 0]} />
              <Environment preset="city" />
            </Suspense>
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              minDistance={2}
              maxDistance={10}
            />
          </Canvas>
        </div>
      </div>
      
      {/* Information footer */}
      <div className="bg-gray-50 p-3 border-t border-gray-200 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4 text-gray-500" />
            <span>Rotate, zoom, and pan each model to compare architectural changes over time.</span>
          </div>
          <div className="flex space-x-2">
            <Link href={`/monument/${monument.id}/vr`}>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                View in VR
              </Button>
            </Link>
            <Link href={`/monument/${monument.id}/ar`}>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                View in AR
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonumentComparison;