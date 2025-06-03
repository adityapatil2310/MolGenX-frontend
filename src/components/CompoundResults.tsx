import React, { useState,useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Compound, OptimizationResponse } from "@/pages/ProteinSearch";

interface CompoundResultsProps {
    compounds: Compound[];
    optimizationResponse: OptimizationResponse | null;
}

interface UnifiedCompound {
    id: string;
    type: string;
    name: string;
    formula: string; // SMILES
    score: number;
    molecularWeight: number;
    likeliness: number; // druglikeness
    toxicity: number;
    binding_affinity: number;
    synthetic_accessibility: number;
    lipinski_violations: number;
    solubility: number;
    structure: string; // SMILES
    rank: number;
    explanation?: string;
    visualData?: {
        images: {
            "2d": string;
        };
        models: {
            pdb: string;
        };
    };
}

const CompoundResults: React.FC<CompoundResultsProps> = ({
    compounds,
    optimizationResponse,
}) => {
    // Create a unified list of compounds from the API response
    // The API now returns a single array already sorted by score
    const allCompounds = useMemo(() => {
        if (!compounds || compounds.length === 0) {
            return [];
        }

        // Map the compounds to our UnifiedCompound interface
        return compounds.map(compound => {
            // Find the compound explanation if available
            const explanationKey = `compound_${compound.rank}`;
            const explanation = optimizationResponse?.compound_explanations?.[explanationKey] || null;

            // Find visualization data if available
            const visualData = optimizationResponse?.compound_visualization ? 
                optimizationResponse.compound_visualization.compounds.find(
                    (vis) => vis.id === compound.rank
                ) : null;

            return {
                id: compound.rank.toString(),
                type: "compound",
                name: `Compound-${compound.rank}`,
                formula: compound.formula || compound.structure,
                score: compound.score,
                molecularWeight: compound.molecularWeight,
                likeliness: compound.likeliness,
                toxicity: compound.toxicity,
                binding_affinity: compound.binding_affinity,
                synthetic_accessibility: compound.synthetic_accessibility,
                lipinski_violations: compound.lipinski_violations,
                solubility: compound.solubility,
                structure: compound.structure,
                rank: compound.rank,
                explanation: explanation,
                visualData: visualData
            };
        });
    }, [compounds, optimizationResponse]);

    const [selectedCompound, setSelectedCompound] = useState<UnifiedCompound | null>(
        allCompounds.length > 0 ? allCompounds[0] : null
    );

	const viewerRefs = useRef<{[key: string]: boolean}>({});
    
    // Initialize 3D viewer when selectedCompound changes
    useEffect(() => {
        if (!selectedCompound?.visualData?.models?.pdb) return;
        
        const viewerId = `molecule-viewer-${selectedCompound.id}`;
        
        // Check if we already processed this viewer
        if (viewerRefs.current[viewerId]) return;
        
        // Make sure 3Dmol.js is available
        if (window.$3Dmol) {
            try {
				// Create the viewer for this specific compound
                const viewer = window.$3Dmol.createViewer(
                    document.getElementById(viewerId),
                    { backgroundColor: 'white' }
                );
                
                // Add the model from PDB data
                viewer.addModel(selectedCompound.visualData.models.pdb, 'pdb');
                
                // Set the style
                viewer.setStyle({}, {"stick": {"radius": 0.2, "colorscheme": "cyanCarbon"}});
                viewer.addStyle({"atom": "C"}, {"sphere": {"radius": 0.4, "color": "cyan"}});
                viewer.addStyle({"atom": "O"}, {"sphere": {"radius": 0.4, "color": "red"}});
                viewer.addStyle({"atom": "N"}, {"sphere": {"radius": 0.4, "color": "blue"}});
                viewer.addStyle({"atom": "S"}, {"sphere": {"radius": 0.4, "color": "yellow"}});
                viewer.addStyle({"atom": "Cl"}, {"sphere": {"radius": 0.4, "color": "green"}});
                viewer.addStyle({"atom": "Br"}, {"sphere": {"radius": 0.4, "color": "brown"}});
                
                // Zoom to fit the molecule
                viewer.zoomTo();
                
                // Render the molecule
                viewer.render();
				// Mark this viewer as processed
                viewerRefs.current[viewerId] = true;
            } catch (error) {
                console.error("Error rendering 3D molecule:", error);
            }
        } else {
            console.error("3Dmol library not loaded");
        }
    }, [selectedCompound]);
                

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-8 space-y-8"
        >
            <div className="flex flex-col gap-8">
                <h2 className="text-3xl font-bold tracking-tight">Results</h2>
                <p className="text-muted-foreground">
                    Showing {allCompounds.length} compounds ranked by overall score
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Compound List - Updated to extend full height */}
    <div className="lg:col-span-1 flex flex-col">
        <div className="sticky top-4 overflow-auto flex-grow border rounded-md shadow-sm bg-card">
            <div className="p-4 border-b">
                <h3 className="font-medium">Compounds List</h3>
            </div>
            <div className="grid gap-2 p-3">
                {allCompounds.map((compound) => (
                    <Card
                        key={compound.id}
                        className={`cursor-pointer transition-all hover:bg-muted/50 ${
                            selectedCompound?.id === compound.id
                                ? "border-primary bg-muted/30"
                                : ""
                        }`}
                        onClick={() => setSelectedCompound(compound)}
                    >
						<CardContent className="p-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium">
                                        {compound.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline">
                                            Score: {compound.score.toFixed(2)}
                                        </Badge>
                                        <p className="text-sm text-muted-foreground truncate max-w-[120px]">
                                            {compound.formula}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant={selectedCompound?.id === compound.id ? "default" : "outline"}>
                                    Rank: {compound.rank}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
					))}
            </div>
        </div>
    </div>                      

                    {/* Compound Details and Visualization */}
                    <div className="lg:col-span-2">
                        {selectedCompound && (
                            <div className="grid grid-cols-1 gap-6">
                                {/* Compound Properties */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>Compound {selectedCompound.rank} Properties</CardTitle>
                                            <Badge variant="default">
                                                Score: {selectedCompound.score.toFixed(2)}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Name
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedCompound.name}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        SMILES
                                                    </TableCell>
                                                    <TableCell className="break-all">
                                                        {selectedCompound.structure}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Score
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-semibold">
                                                            {selectedCompound.score.toFixed(2)}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Molecular Weight
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedCompound.molecularWeight.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Binding Affinity
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedCompound.binding_affinity.toFixed(4)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Druglikeness
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedCompound.likeliness.toFixed(4)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Toxicity
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedCompound.toxicity.toFixed(4)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Synthetic Accessibility
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedCompound.synthetic_accessibility.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Lipinski Violations
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedCompound.lipinski_violations}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Solubility
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedCompound.solubility.toFixed(4)}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                                
                                {/* Compound Explanation */}
                                {selectedCompound.explanation && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Compound Analysis</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="whitespace-pre-line">
                                                {selectedCompound.explanation}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

								{/* Compound Visualization */}
								<Card>
									<CardHeader>
										<CardTitle>Visualization</CardTitle>
									</CardHeader>
									<CardContent className="flex flex-col items-center justify-center">
										{selectedCompound.visualData ? (
											<div className="flex flex-col items-center space-y-8">
												{/* 2D Structure */}
												<div className="w-full bg-white p-4 rounded-lg">
													<h3 className="text-sm font-medium mb-2">2D Structure</h3>
													<img
														src={selectedCompound.visualData.images["2d"]}
														alt={`2D structure of ${selectedCompound.name}`}
														className="max-w-full h-auto mx-auto"
													/>
												</div>

												    {/* 3D Structure - Simpler approach with direct div */}
													<div className="w-full bg-white p-4 rounded-lg">
														<h3 className="text-sm font-medium mb-2">3D Structure</h3>
														<div 
															id={`molecule-viewer-${selectedCompound.id}`} 
															style={{ width: '100%', height: '400px', position: 'relative' }}
														>
															{/* This div will be replaced with the 3Dmol viewer by the useEffect */}
														</div>
														
														<p className="text-xs text-muted-foreground mt-2">
															SMILES: {selectedCompound.structure}
														</p>
													</div>
											</div>
										) : (
											<div className="text-center text-muted-foreground">
												<p>No visualization data available.</p>
												<p className="text-sm mt-2">
													Enable 3D visualizations in the search settings to view molecule structures.
												</p>
											</div>
										)}
									</CardContent>
								</Card>
								</div>
						)}
					</div>
				</div>
				</div>
                                                
                            

            {/* Overall Explanation */}
            {optimizationResponse?.explanation && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Overall Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-line">
                            {optimizationResponse.explanation}
                        </p>
                    </CardContent>
                </Card>
            )}
            
            {/* Table View of All Compounds */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>All Compounds (Ranked)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-20">Rank</TableHead>
                                    <TableHead>SMILES</TableHead>
                                    <TableHead className="w-20">Score</TableHead>
                                    <TableHead className="w-24">Druglikeness</TableHead>
                                    <TableHead className="w-20">Toxicity</TableHead>
                                    <TableHead className="w-28">Binding Affinity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allCompounds.map((compound) => (
                                    <TableRow 
                                        key={compound.id} 
                                        className={`cursor-pointer ${selectedCompound?.id === compound.id ? "bg-muted/50" : ""}`}
                                        onClick={() => setSelectedCompound(compound)}
                                    >
                                        <TableCell className="font-medium">
                                            {compound.rank}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs break-all">
                                            {compound.structure}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {compound.score.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {compound.likeliness.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {compound.toxicity.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {compound.binding_affinity.toFixed(4)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CompoundResults;