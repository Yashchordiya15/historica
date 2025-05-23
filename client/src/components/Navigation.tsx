import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useAudio } from "../lib/stores/useAudio";

interface NavigationItem {
  label: string;
  path: string;
  icon: JSX.Element;
}

const Navigation = () => {
  const [location, setLocation] = useLocation();
  const audio = useAudio();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMute = () => {
    audio.toggleMute();
  };

  const navigateTo = (path: string) => {
    if (path !== location) {
      audio.playHit();
      setLocation(path);
    }
    setIsOpen(false);
  };

  const navigationItems: NavigationItem[] = [
    {
      label: "Map",
      path: "/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a9 9 0 1 0 9 9H3a9 9 0 0 0 9 -9v9a9 9 0 0 0 9 -9A9 9 0 0 0 12 3"/>
        </svg>
      ),
    }
  ];

  return (
    <>
      <motion.div
        className="fixed top-4 right-4 z-50 flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleMute}
          className="bg-background/80 backdrop-blur-sm"
        >
          {audio.isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"></path><path d="m16 16-8-8"></path><path d="M9.9 5.9a9 9 0 0 1 7.07 13.79"></path><path d="M16.1 2.9a13.89 13.89 0 0 1 4.99 3"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2"></path><path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"></path><path d="M18 14h4"></path><path d="M18 10h4"></path><path d="M6 14H2"></path><path d="M6 10H2"></path>
            </svg>
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path><path d="M12 3v6"></path>
          </svg>
        </Button>
      </motion.div>
      
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full z-40 bg-black/50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className="bg-background rounded-lg p-6 w-[90%] max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Historica</h2>
            <p className="mb-6 text-muted-foreground">
              Experience India's rich heritage through AR and VR. Explore historical monuments and travel through time.
            </p>
            
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location === item.path ? "default" : "ghost"}
                  className={cn("w-full justify-start", 
                    location === item.path && "bg-primary")}
                  onClick={() => navigateTo(item.path)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Button>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t flex justify-between">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close Menu
              </Button>
              <Button variant="outline" onClick={toggleMute}>
                {audio.isMuted ? "Unmute Audio" : "Mute Audio"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Navigation;
