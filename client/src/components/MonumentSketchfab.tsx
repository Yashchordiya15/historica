import React, { useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { useAudio } from '../hooks/useAudio';
import { Monument } from '../data/monuments';
import { Button } from './ui/button';
import SketchfabModel from './SketchfabModel';
import { monuments } from '../data/monuments';

const MonumentSketchfab = () => {
  const audio = useAudio();
  const [match, params] = useRoute<{ id: string }>('/monument/:id/sketchfab');
  const [, setLocation] = useLocation();
  const [loading, setLoading] = React.useState(true);
  const [modelId, setModelId] = React.useState<string | null>(null);

  // Get the monument from the ID in the URL
  const monument = match && params ? monuments.find(m => m.id === params.id) : null;

  useEffect(() => {
    if (monument) {
      // For Somnath Temple, use the specific Sketchfab model ID
      if (monument.id === 'somnath-temple') {
        setModelId('b0e8659fe64a42008e1f6fc758c9b053');
      }
      
      setLoading(false);
    }
  }, [monument]);

  const handleBack = () => {
    audio.playHit();
    setLocation(`/monument/${params?.id}`);
  };

  if (!monument) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p>Monument not found</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-tr from-blue-900 via-indigo-900 to-violet-900 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20 z-0">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-blue-400 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-violet-400 blur-3xl"></div>
      </div>
      
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="text-white hover:bg-white/20 gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          Back
        </Button>
        <div className="text-white text-lg font-medium">
          {monument.name} - Sketchfab Model
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="h-full w-full z-10 relative pb-16 flex flex-col items-center justify-center"
      >
        {loading ? (
          <div className="text-white flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
            <p>Loading Sketchfab model...</p>
          </div>
        ) : modelId ? (
          <div className="w-full h-full max-w-7xl mx-auto px-4">
            <div className="rounded-xl overflow-hidden h-full">
              <SketchfabModel 
                modelId={modelId} 
                width="100%" 
                height="100%" 
                autoLoad={true}
                className="bg-white"
              />
            </div>
          </div>
        ) : (
          <div className="text-white text-center p-8 bg-red-900/30 backdrop-blur-sm rounded-xl max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-red-400">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h3 className="text-xl font-bold mb-2">Model Unavailable</h3>
            <p>The Sketchfab model for this monument is currently unavailable.</p>
            <Button 
              variant="outline" 
              onClick={handleBack} 
              className="mt-4 bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              Return to Monument
            </Button>
          </div>
        )}
      </motion.div>
      
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-4 flex justify-center">
        <div className="text-white/70 text-sm">
          3D model provided by Sketchfab contributors
        </div>
      </div>
    </div>
  );
};

export default MonumentSketchfab;