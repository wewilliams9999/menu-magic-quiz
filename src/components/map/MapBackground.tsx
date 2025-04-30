
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

interface MapBackgroundProps {
  children: React.ReactNode;
}

const MapBackground: React.FC<MapBackgroundProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [scale, setScale] = useState(1);
  
  // Increase scale level (zoom in)
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 1.8));
  };
  
  // Decrease scale level (zoom out)
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.8));
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <div className="relative bg-white dark:bg-gray-900 aspect-[4/3] md:aspect-[16/9] overflow-hidden">
        {/* Nashville map with modern styling */}
        <motion.div 
          className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Stylized map elements */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              {/* Cumberland River representation */}
              <path
                d="M25,10 C40,15 45,25 50,40 C55,55 65,65 80,70"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-blue-500 dark:text-blue-400"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                style={{
                  animation: "dash 3s linear forwards",
                }}
              />
            </svg>
          </div>
          
          {/* Map texture overlay */}
          <div 
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmOGY4ZjgiPjwvcmVjdD4KPC9zdmc+')] opacity-30 dark:opacity-10"
          ></div>
          
          {/* Main roads simplified */}
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-400/20 dark:bg-gray-600/20 transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-400/20 dark:bg-gray-600/20 transform -translate-y-1/2"></div>
            <div className="absolute w-[1px] h-full bg-gray-400/10 dark:bg-gray-600/10 left-1/4 transform -translate-x-1/2"></div>
            <div className="absolute w-[1px] h-full bg-gray-400/10 dark:bg-gray-600/10 left-3/4 transform -translate-x-1/2"></div>
            <div className="absolute w-full h-[1px] bg-gray-400/10 dark:bg-gray-600/10 top-1/4 transform -translate-y-1/2"></div>
            <div className="absolute w-full h-[1px] bg-gray-400/10 dark:bg-gray-600/10 top-3/4 transform -translate-y-1/2"></div>
          </div>
        </motion.div>

        {/* Children components (bubbles, markers etc) with scaling */}
        <div 
          className="absolute inset-0 z-10 overflow-hidden"
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease'
          }}
        >
          {children}
        </div>
        
        {/* Map overlay gradient for better depth */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-red-900/5 to-transparent pointer-events-none"></div>
        
        {/* Nashville label */}
        <div className="absolute bottom-3 right-3 text-sm font-bold text-gray-400/30 dark:text-gray-600/30 pointer-events-none">
          NASHVILLE
        </div>

        {/* Zoom controls for mobile */}
        {isMobile && (
          <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1">
            <Button 
              size="icon" 
              variant="secondary" 
              className="w-8 h-8 rounded-full bg-red-500/70 backdrop-blur-md hover:bg-red-600 text-white"
              onClick={zoomIn}
            >
              <ZoomIn size={16} />
            </Button>
            <Button 
              size="icon" 
              variant="secondary"
              className="w-8 h-8 rounded-full bg-red-500/70 backdrop-blur-md hover:bg-red-600 text-white"
              onClick={zoomOut}
            >
              <ZoomOut size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapBackground;
