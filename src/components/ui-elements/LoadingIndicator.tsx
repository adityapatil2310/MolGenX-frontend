
import React from "react";
import { motion } from "framer-motion";

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center mb-4">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute w-10 h-10 rounded-full bg-primary/10"
        />
        
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
            rotate: 360
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-8 h-8"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-primary">
            <path
              d="M12 4.75V6.25M17.127 6.873L16.073 7.927M19.25 12H17.75M17.127 17.127L16.073 16.073M12 19.25V17.75M7.927 16.073L6.873 17.127M4.75 12H6.25M7.927 7.927L6.873 6.873"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-muted-foreground text-center"
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingIndicator;
