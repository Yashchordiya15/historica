import { useEffect, useState, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { monuments, Monument } from "../data/monuments";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { Button } from "./ui/button";
import { useAudio } from "../lib/stores/useAudio";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useModelLoader } from "../hooks/useModelLoader";
import { Sky, Stars, OrbitControls, Text } from "@react-three/drei";
import { toast } from "sonner";
import SketchfabModel from "./SketchfabModel";

// Helper functions for model positioning and scaling
const getModelYOffset = (monument: Monument): number => {
  if (monument.id === "sanchi-stupa") return 0.5;
  return 0;
};

const getModelScale = (monument: Monument): number => {
  if (monument.id === "sanchi-stupa") return 2.5;
  return 1.5;
};

// Text component for displaying information
const TextPlane = ({ text, position }: { text: string, position: [number, number, number] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill background
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    context.font = 'bold 32px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      context.fillText(line, canvas.width / 2, canvas.height / 2 + (i - lines.length / 2 + 0.5) * 40);
    });
    
    // Create texture
    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    } else {
      textureRef.current = new THREE.CanvasTexture(canvas);
    }
  }, [text]);
  
  return (
    <>
      <canvas ref={canvasRef} width={512} height={256} style={{ display: 'none' }} />
      <mesh position={position}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial transparent>
          {textureRef.current && <canvasTexture attach="map" args={[canvasRef.current!]} />}
        </meshBasicMaterial>
      </mesh>
    </>
  );
};

// Enhanced 3D Text Label using drei's Text
const InfoLabel = ({ text, position }: { text: string, position: [number, number, number] }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2.2, 0.7]} />
        <meshStandardMaterial color="#000000" opacity={0.6} transparent />
      </mesh>
      <Text
        position={[0, 0, 0]}
        color="white"
        fontSize={0.15}
        maxWidth={2}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
};

// Main VR Scene component
const VRScene = ({ monument }: { monument: Monument }) => {
  const model = useModelLoader(monument.primaryModel);
  const [rotation, setRotation] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 2]);
  const [isExploring, setIsExploring] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const audio = useAudio();
  
  // Create a reference to the model group
  const modelRef = useRef<THREE.Group>(null);

  // Rotate model slowly for a more dynamic scene
  useFrame(() => {
    setRotation(prev => prev + 0.0005);
  });

  // Add keyboard controls for "walking" around the model
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isExploring) return;
      
      const moveSpeed = 0.1;
      switch(e.key) {
        case 'w':
        case 'ArrowUp':
          setPlayerPosition(([x, y, z]) => [x, y, z - moveSpeed]);
          break;
        case 's':
        case 'ArrowDown':
          setPlayerPosition(([x, y, z]) => [x, y, z + moveSpeed]);
          break;
        case 'a':
        case 'ArrowLeft':
          setPlayerPosition(([x, y, z]) => [x - moveSpeed, y, z]);
          break;
        case 'd':
        case 'ArrowRight':
          setPlayerPosition(([x, y, z]) => [x + moveSpeed, y, z]);
          break;
        case 'f':
          // Change fact on F key press
          audio.playHit();
          setFactIndex(prev => (prev + 1) % monument.facts.length);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExploring, monument.facts.length, audio]);

  // Toggle exploration mode
  const toggleExploration = () => {
    setIsExploring(!isExploring);
    if (!isExploring) {
      setPlayerPosition([0, 0, 2]);
    }
  };
  
  // Listen for toggle event from outside the canvas
  useEffect(() => {
    const handleToggleEvent = () => {
      toggleExploration();
    };
    document.addEventListener('toggleExploration', handleToggleEvent);
    
    return () => {
      document.removeEventListener('toggleExploration', handleToggleEvent);
    };
  }, [isExploring]);

  // Time of day cycle
  useEffect(() => {
    const dayNightCycle = setInterval(() => {
      setTimeOfDay(current => {
        switch(current) {
          case 'day': return 'sunset';
          case 'sunset': return 'night';
          case 'night': return 'day';
          default: return 'day';
        }
      });
    }, 60000); // Change every minute
    
    return () => clearInterval(dayNightCycle);
  }, []);

  if (!model) return null;

  // Sky configuration based on time of day
  const getSkyConfig = () => {
    switch(timeOfDay) {
      case 'day':
        return { 
          sunPosition: [0, 1, 0] as [number, number, number], 
          turbidity: 10, 
          rayleigh: 0.5 
        };
      case 'sunset':
        return { 
          sunPosition: [-1, 0.2, 0] as [number, number, number], 
          turbidity: 7, 
          rayleigh: 2 
        };
      case 'night':
        return { 
          sunPosition: [0, -1, 0] as [number, number, number], 
          turbidity: 20, 
          rayleigh: 0.2 
        };
    }
  };

  const skyConfig = getSkyConfig();

  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={timeOfDay === 'night' ? 0.2 : 0.5} />
      <directionalLight 
        position={timeOfDay === 'night' ? [-5, -5, -5] : [5, 5, 5]} 
        intensity={timeOfDay === 'night' ? 0.2 : 1} 
        castShadow 
      />
      
      {/* Moving camera position based on player movement */}
      <group position={playerPosition}>
        {/* Look-at point stays fixed on the monument */}
        {isExploring && (
          <mesh position={[0, 0, -3]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="red" opacity={0.5} transparent />
          </mesh>
        )}
      </group>
      
      {/* Monument model */}
      <group ref={modelRef} position={[0, 0, -5]} rotation={[0, rotation, 0]}>
        <primitive 
          object={model.scene} 
          position={[0, getModelYOffset(monument), 0]} 
          scale={getModelScale(monument)} 
          castShadow
        />
        
        {/* Ground plane with shadow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.01, 0]} receiveShadow>
          <circleGeometry args={[10, 32]} />
          <meshStandardMaterial 
            color={timeOfDay === 'night' ? '#102030' : '#e0e0e0'} 
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      </group>
      
      {/* Environment */}
      <Sky {...skyConfig} />
      <Stars 
        radius={100} 
        depth={50} 
        count={timeOfDay === 'night' ? 8000 : 2000} 
        factor={4} 
        saturation={0} 
        fade
        speed={1}
      />
      
      {/* Information panels floating around the monument */}
      <TextPlane 
        text={`${monument.name}\n${monument.city}, ${monument.state}`}
        position={[0, 1.5, -3]}
      />
      
      <TextPlane 
        text={`Built: ${monument.yearBuilt}\nDynasty: ${monument.dynasty}`}
        position={[-2, 0.8, -4]}
      />
      
      <TextPlane 
        text={monument.facts[factIndex] || 'Historical Site'}
        position={[2, 0.5, -4]}
      />
      
      {/* Floating control panel */}
      <group position={[0, -1.2, -2.5]} rotation={[-Math.PI / 4, 0, 0]}>
        <mesh>
          <boxGeometry args={[2, 0.5, 0.1]} />
          <meshStandardMaterial color="#334455" metalness={0.5} roughness={0.2} />
        </mesh>
        
        <TextPlane
          text={`VR Controls:\nUse arrow keys to move\nPress F to cycle facts\nClick 'Start Exploration' to ${isExploring ? 'stop' : 'start'}`}
          position={[0, 0.05, 0.06]}
        />
      </group>

      {/* Teleport positions in VR mode */}
      <mesh position={[-3, -0.9, -5]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
        <meshStandardMaterial color="#ff9900" />
      </mesh>
      <mesh position={[3, -0.9, -5]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
        <meshStandardMaterial color="#ff9900" />
      </mesh>
      <mesh position={[0, -0.9, -8]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
        <meshStandardMaterial color="#ff9900" />
      </mesh>
    </>
  );
};

// Main VR View component
const VRView = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute<{ id: string }>("/monument/:id/vr");
  const { setSelectedMonument, selectedMonument, setVRMode } = useAppContext();
  const audio = useAudio();
  
  useEffect(() => {
    // Load monument data
    if (!match) return;
    
    const monument = monuments.find(m => m.id === params.id);
    if (monument) {
      setSelectedMonument(monument);
      setVRMode(true); // Activate VR mode in context
    } else {
      setLocation("/");
    }

    // Cleanup
    return () => {
      setVRMode(false);
    };
  }, [match, params?.id, setSelectedMonument, setVRMode, setLocation]);

  const handleBack = () => {
    audio.playHit();
    if (selectedMonument) {
      setLocation(`/monument/${selectedMonument.id}`);
    } else {
      setLocation("/");
    }
  };

  if (!selectedMonument) return null;

  // Special case for Somnath Temple - use Sketchfab model
  if (selectedMonument?.id === 'somnath-temple') {
    return (
      <div className="w-full h-full relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full h-full"
        >
          <div className="w-full h-full">
            <SketchfabModel 
              modelId="b0e8659fe64a42008e1f6fc758c9b053" 
              width="100%" 
              height="100%"
              className="bg-white"
            />
          </div>
          <div className="absolute top-4 left-4 z-10">
            <Button variant="secondary" onClick={handleBack}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
              </svg>
              Back
            </Button>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 p-2 rounded-md z-10 text-center max-w-md">
            <h3 className="font-semibold">{selectedMonument.name} - Interactive 3D Experience</h3>
            <p className="text-sm">
              Detailed Sketchfab model with high-quality texturing
            </p>
            <p className="text-xs mt-1 text-gray-500">
              Use mouse to rotate, zoom and pan around the model
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Standard Three.js model for other monuments
  return (
    <div className="w-full h-full relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-full"
      >
        <Canvas
          camera={{ position: [0, 1.6, 0], fov: 70 }}
          gl={{ 
            antialias: true,
            outputColorSpace: THREE.SRGBColorSpace 
          }}
        >
          {selectedMonument && (
            <>
              <VRScene monument={selectedMonument} />
              <OrbitControls makeDefault />
            </>
          )}
        </Canvas>

        <div className="absolute top-4 left-4 z-10">
          <Button variant="secondary" onClick={handleBack}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
            Back
          </Button>
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button 
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md shadow-md"
            onClick={() => document.dispatchEvent(new CustomEvent('toggleExploration'))}
          >
            Start Exploration
          </Button>
          <Button 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-md"
            onClick={() => toast.info("VR headset mode is simulated in this demo")}
          >
            Enter VR
          </Button>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 p-2 rounded-md z-10 text-center max-w-md">
          <h3 className="font-semibold">{selectedMonument.name} - VR Experience</h3>
          <p className="text-sm">
            Navigate with mouse or use arrow keys in exploration mode
          </p>
          <p className="text-xs mt-1 text-gray-500">
            Press F to cycle through interesting facts
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VRView;
