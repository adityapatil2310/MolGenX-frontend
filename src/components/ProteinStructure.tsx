import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ProteinStructureProps {
  proteinSequence: string;
}

interface ProteinData {
  pdb_id: string;
  title: string;
  description: string;
  experimental_method: string;
  resolution: string;
  pdb_content: string;
  html_viewer: string;
}

const ProteinStructure: React.FC<ProteinStructureProps> = ({ proteinSequence }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proteinData, setProteinData] = useState<ProteinData | null>(null);
  const viewerRef = useRef<boolean>(false);
  const viewerId = "protein-3d-viewer";
  
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    // Only fetch if we have a valid 4-character PDB ID
    if (proteinSequence && proteinSequence.length === 4) {
      fetchProteinData(proteinSequence);
    } else {
      // Clear previous protein data if the input is invalid
      setProteinData(null);
    }
  }, [proteinSequence]);

  // Effect to initialize the 3D viewer when protein data is available
  useEffect(() => {
    if (!proteinData?.pdb_content || viewerRef.current) return;

    // Only create the viewer if 3Dmol is available and we haven't already created one
    if (window.$3Dmol && !viewerRef.current) {
      try {
        const viewerElement = document.getElementById(viewerId);
        if (viewerElement) {
          // Clear any existing content
          viewerElement.innerHTML = '';
          
          // Create the viewer
          const viewer = window.$3Dmol.createViewer(
            viewerElement,
            { backgroundColor: 'white' }
          );
          
          // Add the model from PDB data
          viewer.addModel(proteinData.pdb_content, 'pdb');
          
          // Set style for protein visualization
          viewer.setStyle({}, {cartoon: {color: 'spectrum'}});
          viewer.setStyle({hetflag: true}, {stick: {radius: 0.2}});
          
          // Zoom to fit the protein
          viewer.zoomTo();
          
          // Render the protein
          viewer.render();
          
          // Mark viewer as initialized
          viewerRef.current = true;
        }
      } catch (error) {
        console.error("Error rendering 3D protein structure:", error);
        setError("Failed to render protein structure");
      }
    }
  }, [proteinData]);

  // Reset viewerRef when protein changes
  useEffect(() => {
    return () => {
      viewerRef.current = false;
    };
  }, [proteinSequence]);

  const fetchProteinData = async (pdbId: string) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiUrl}/api/protein/${pdbId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch protein data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProteinData(data);
    } catch (err) {
      console.error("Error fetching protein data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch protein data");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 rounded-full border-2 border-t-primary animate-spin"></div>
        <p className="ml-3 text-muted-foreground">Loading protein structure...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
        <p className="text-muted-foreground mt-2">
          Please check the PDB ID and try again
        </p>
      </div>
    );
  }

  // Show empty state for no protein sequence
  if (!proteinSequence) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <img 
        src="/compound-logo.png"
        alt="Molecule structure"
        width="80"
        height="80"
        className="mb-4 opacity-70"
      />
        <h3 className="text-xl font-medium mb-1">No Protein Selected</h3>
        <p className="text-center text-muted-foreground">
          Enter a valid 4-character PDB ID to visualize a protein structure
        </p>
      </div>
    );
  }

  // Show invalid state for incorrect protein sequence format
  if (proteinSequence.length !== 4) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-amber-500">Please enter a valid 4-character PDB ID</p>
      </div>
    );
  }

  // Show actual protein data
  return (
    <div className="h-full flex flex-col">
      {proteinData ? (
        <>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">{proteinData.title || `Protein ${proteinData.pdb_id}`}</h2>
            <p className="text-muted-foreground">{proteinData.description}</p>
            
            <div className="mt-2 grid grid-cols-2 gap-x-4 text-sm">
              <div>
                <span className="font-medium">Method: </span>
                <span>{proteinData.experimental_method || "Not specified"}</span>
              </div>
              <div>
                <span className="font-medium">Resolution: </span>
                <span>{proteinData.resolution || "Not specified"}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-grow bg-white rounded-lg p-4 min-h-[300px]">
            <div 
              id={viewerId}
              style={{ width: '100%', height: '100%', minHeight: '300px', position: 'relative' }}
              className="border border-muted rounded-md"
            />
          </div>
          
          <div className="mt-2 text-xs text-right text-muted-foreground">
            <a 
              href={`https://www.rcsb.org/structure/${proteinData.pdb_id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              View on RCSB PDB →
            </a>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-lg font-medium">Loading protein {proteinSequence}...</p>
          <div className="mt-4 h-8 w-8 rounded-full border-2 border-t-primary animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ProteinStructure;