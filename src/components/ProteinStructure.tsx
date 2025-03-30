
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingIndicator from "@/components/ui-elements/LoadingIndicator";

interface ProteinStructureProps {
  proteinSequence: string;
}

const ProteinStructure: React.FC<ProteinStructureProps> = ({ proteinSequence }) => {
  const [loading, setLoading] = useState(false);
  const [structure, setStructure] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!proteinSequence) {
      setStructure(null);
      setError(null);
      return;
    }

    const fetchStructure = async () => {
      setLoading(true);
      setError(null);

      try {
        // In a real app, this would fetch the actual protein structure from an API
        // For now, we'll simulate loading and then show a placeholder
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // This is where you would make an actual API call in a real app
        if (proteinSequence.length > 0) {
          // Placeholder structure - replace with actual API call
          setStructure("/placeholder.svg");
        } else {
          setStructure(null);
        }
      } catch (err) {
        console.error("Error fetching protein structure:", err);
        setError("Failed to load protein structure visualization");
        setStructure(null);
      } finally {
        setLoading(false);
      }
    };

    if (proteinSequence) {
      fetchStructure();
    }
  }, [proteinSequence]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Protein Structure</h3>
        {proteinSequence && (
          <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {proteinSequence.length > 10 
              ? `${proteinSequence.substring(0, 10)}...` 
              : proteinSequence}
          </div>
        )}
      </div>

      <div className="flex-grow flex items-center justify-center relative overflow-hidden rounded-lg bg-white/50 dark:bg-black/20">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <LoadingIndicator message="Loading protein structure..." />
            </motion.div>
          )}

          {!loading && !structure && !error && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-6"
            >
              <p className="text-muted-foreground">
                Enter a protein sequence or identifier to visualize its structure.
              </p>
            </motion.div>
          )}

          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-6 text-destructive"
            >
              <p>{error}</p>
            </motion.div>
          )}

          {!loading && structure && (
            <motion.div
              key="structure"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-full h-full flex items-center justify-center p-4"
            >
              <motion.img
                src={structure}
                alt="Protein Structure Visualization"
                className="max-w-full max-h-full object-contain"
                animate={{ 
                  rotateY: [0, 360],
                }}
                transition={{ 
                  duration: 30,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {structure && !loading && (
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            3D visualization of protein structure. Rotate to explore different binding sites.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProteinStructure;
