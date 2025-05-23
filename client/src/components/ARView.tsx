import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { monuments } from "../data/monuments";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useAudio } from "../lib/stores/useAudio";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useModelLoader } from "../hooks/useModelLoader";
import { toast } from "sonner";
import { OrbitControls } from "@react-three/drei";

const ARScene = ({ modelPath }: { modelPath: string }) => {
  const model = useModelLoader(modelPath);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.005);
    }, 16);
    
    return () => clearInterval(interval);
  }, []);

  if (!model) return null;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <primitive 
        object={model.scene} 
        position={[0, -0.5, -1]} 
        scale={0.5} 
        rotation={[0, rotation, 0]} 
      />
    </>
  );
};

const ARView = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute<{ id: string }>("/monument/:id/ar");
  const { setSelectedMonument, selectedMonument } = useAppContext();
  const audio = useAudio();
  const [cameraAccess, setCameraAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!match) return;
    
    const monument = monuments.find(m => m.id === params.id);
    if (monument) {
      setSelectedMonument(monument);
    } else {
      setLocation("/");
    }

    // Simulate checking for camera/AR access
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setCameraAccess(true);
        toast.success("Camera access granted");
      })
      .catch(() => {
        setCameraAccess(false);
        toast.error("Camera access denied");
      });
  }, [match, params?.id]);

  const handleBack = () => {
    audio.playHit();
    if (selectedMonument) {
      setLocation(`/monument/${selectedMonument.id}`);
    } else {
      setLocation("/");
    }
  };

  if (!selectedMonument) return null;

  return (
    <div className="w-full h-full relative overflow-auto">
      {cameraAccess === false && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-80 p-4">
          <Card className="w-[90%] max-w-md">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Camera Access Required</h2>
              <p className="mb-6">
                Please allow camera access to use the AR feature.
                This demo will show a simulated AR experience instead.
              </p>
              <div className="flex justify-center">
                <Button onClick={handleBack}>Go Back</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-full"
      >
        {/* Virtual environment for the monument */}
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ 
            alpha: true, 
            antialias: true,
            outputColorSpace: THREE.SRGBColorSpace 
          }}
        >
          <ARScene modelPath={selectedMonument.primaryModel} />
          <OrbitControls enableZoom={false} />
        </Canvas>
        
        {/* Camera feed overlay (simulated) */}
        <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-b from-blue-50/20 to-blue-100/20"></div>

        <div className="absolute top-4 left-4 z-10">
          <Button variant="secondary" onClick={handleBack}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
            Back
          </Button>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <Button 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-md"
            onClick={() => toast.info("AR mode is simulated in this demo")}
          >
            Start AR
          </Button>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 p-2 rounded-md z-10 text-center">
          <h3 className="font-semibold">{selectedMonument.name}</h3>
          <p className="text-sm">This is a simulated AR experience of the monument</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ARView;
