import { useState, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { toast } from "sonner";
import * as THREE from "three";

// Preload fallback model to avoid errors
useGLTF.preload("/models/taj_mahal.glb");

/**
 * Custom hook to load 3D models with error handling and fallback
 */
export function useModelLoader(modelPath: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  
  // Use the actual model path or fallback if there was an error
  const modelUrl = useFallback ? "/models/taj_mahal.glb" : modelPath;
  
  // Load model with react-three-fiber's useGLTF
  const model = useGLTF(modelUrl, true);
  
  useEffect(() => {
    setIsLoading(true);
    setUseFallback(false);
    
    // Simulate model loading with a small delay
    const timer = setTimeout(() => {
      try {
        // Check if model has loaded successfully
        if (model) {
          setIsLoading(false);
          console.log(`Model loaded: ${modelPath}`);
        } else {
          throw new Error("Failed to load model");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error loading model";
        setError(errorMessage);
        setIsLoading(false);
        toast.error(`Failed to load model: ${errorMessage}. Using fallback.`);
        console.error("Model loading error:", err);
        setUseFallback(true);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [modelPath, model]);
  
  // Create a simple fallback model if everything else fails
  const fallbackModel = useMemo(() => {
    if (!error) return null;
    
    console.warn("Using emergency fallback model for:", modelPath);
    
    // Create a simple cube as fallback
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const mesh = new THREE.Mesh(geometry, material);
    const group = new THREE.Group();
    group.add(mesh);
    
    return { scene: group };
  }, [error, modelPath]);
  
  if (error && !useFallback) {
    return fallbackModel;
  }
  
  return isLoading ? null : model;
}
