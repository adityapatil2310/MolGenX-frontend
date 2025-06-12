import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import CompoundResults from "@/components/CompoundResults";
import ProteinStructure from "@/components/ProteinStructure";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProteinInput from "@/components/ProteinInput";
import { Link } from "react-router-dom";
import Header from "../components/Header"; 
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export interface Compound {
    id: string;
    name: string;
    formula: string;
    molecularWeight: number;
    toxicity: number;
    likeliness: number;
    binding_affinity: number;
    structure: string;
    synthetic_accessibility: number;
    lipinski_violations: number;
    solubility: number;
    rank: number;
    score: number;
    requested_affinity?: number;
    visualData?: {
        images: {
            "2d": string;
        };
        models: {
            pdb: string;
        };
    };
}

export interface OptimizationWeights {
    druglikeness: number;
    synthetic_accessibility: number;
    lipinski_violations: number;
    toxicity: number;
    binding_affinity: number;
    solubility: number;
}

export interface OptimizationResponse {
    optimized_compounds: any[];
    explanation: string;
    compound_explanations?: {
        [key: string]: string;
    };
    compound_visualization?: {
        compounds: {
            id: number;
            images: {
                "2d": string;
            };
            models: {
                pdb: string;
            };
        }[];
    };
    requested_parameters?: {
        num_compounds: number;
        binding_affinity: number;
    };
}

const ProteinSearch: React.FC = () => {
    const [proteinInput, setProteinInput] = useState("");
    const [proteinSequence, setProteinSequence] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [compounds, setCompounds] = useState<Compound[]>([]);
    const [optimizationResponse, setOptimizationResponse] =
        useState<OptimizationResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showWeightsDialog, setShowWeightsDialog] = useState(false);
    const [generateVisualizations, setGenerateVisualizations] = useState(true);
    const [numCompounds, setNumCompounds] = useState<number>(20);
    const [bindingAffinity, setBindingAffinity] = useState<number>(0.7);
    const { toast } = useToast();

    // Fixed API URL - make sure this matches your environment variables
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const [optimizationWeights, setOptimizationWeights] =
        useState<OptimizationWeights>({
            druglikeness: 1.0,
            synthetic_accessibility: 0.8,
            lipinski_violations: 0.7,
            toxicity: 1.2,
            binding_affinity: 1.5,
            solubility: 0.6,
        });

    // Sample data for Human Haemoglobin
    const humanHaemoglobinExample = "1HHO"; // PDB ID for Human Haemoglobin

    const fillExampleData = () => {
        setProteinInput(humanHaemoglobinExample);
    };

    const handleSearchButtonClick = () => {
        if (!proteinInput.trim() || proteinInput.length !== 4) {
            setError("Please enter a valid PDB ID (4 characters)");
            toast({
                title: "Invalid PDB ID",
                description: "Please enter a valid 4-character PDB ID",
                variant: "destructive",
            });
            return;
        }

        // Show the weights dialog
        setShowWeightsDialog(true);
    };

    const handleSearch = async () => {
        setCompounds([]);
        setOptimizationResponse(null);
        
        setIsLoading(true);
        setError(null);
        
        // Close the weights dialog
        setShowWeightsDialog(false);

        // Prepare the request payload according to the required format
        const requestPayload = {
            pdb_id: proteinInput,
            protein: proteinSequence,  // Add protein sequence if available
            weights: optimizationWeights,
            generate_visualizations: generateVisualizations,
            num_compounds: numCompounds,
            binding_affinity: bindingAffinity
        };

        console.log("Sending request to:", `${apiUrl}/api/optimize`);
        console.log("Request body:", requestPayload);

        try {
            // Call the optimize API endpoint
            const optimizeResponse = await fetch(`${apiUrl}/api/optimize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include", // Include cookies if needed
                body: JSON.stringify(requestPayload),
            });

            console.log("Response status:", optimizeResponse.status);

            // Try to get response text for debugging
            const responseText = await optimizeResponse.text();
            console.log("Response text:", responseText);

            if (!optimizeResponse.ok) {
                throw new Error(
                    `Optimization failed: ${optimizeResponse.status} ${optimizeResponse.statusText}. Response: ${responseText}`
                );
            }

            // Parse the JSON from the text response
            const responseData = responseText ? JSON.parse(responseText) : {};
            console.log("Parsed response data:", responseData);

            // Process the optimized compounds
            if (responseData.optimized_compounds) {
                // Parse the optimized_compounds if it's a string
                let parsedCompounds;
                
                try {
                    if (typeof responseData.optimized_compounds === "string") {
                        parsedCompounds = JSON.parse(responseData.optimized_compounds);
                    } else {
                        parsedCompounds = responseData.optimized_compounds;
                    }
                    
                    console.log("Parsed compounds:", parsedCompounds);
                    
                    // Create a properly formatted response object
                    const formattedResponse = {
                        ...responseData,
                        optimized_compounds: parsedCompounds,
                    };
                    
                    // Save the response to state
                    setOptimizationResponse(formattedResponse);
                    
                    // If we have compounds and they're in an array, map them to our format
                    if (parsedCompounds && Array.isArray(parsedCompounds)) {
                        const mappedCompounds = parsedCompounds.map((compound) => {
                            // Find visualization data if available
                            const visualData = generateVisualizations && 
                                formattedResponse.compound_visualization ? 
                                formattedResponse.compound_visualization.compounds.find(
                                    (vis) => vis.id === compound.rank
                                ) : null;
                                
                            // Create a compound object in our application's format
                            return {
                                id: compound.rank.toString(),
                                name: `Compound-${compound.rank}`,
                                formula: compound.smiles || "",
                                molecularWeight: compound.molecular_weight || 0,
                                likeliness: compound.druglikeness || 0,
                                toxicity: compound.toxicity || 0,
                                binding_affinity: bindingAffinity, // Use user-specified value
                                synthetic_accessibility: compound.synthetic_accessibility || 0,
                                lipinski_violations: compound.lipinski_violations || 0,
                                solubility: compound.solubility || 0,
                                structure: compound.smiles || "",
                                rank: compound.rank,
                                score: compound.score,
                                requested_affinity: bindingAffinity,
                                visualData: visualData
                            };
                        });
                        
                        // Save the mapped compounds to state
                        setCompounds(mappedCompounds);
                        
                        // Show success toast
                        toast({
                            title: "Search Complete",
                            description: `Found ${parsedCompounds.length} optimized compounds for your protein`,
                        });
                    } else {
                        // If no compounds were found or the format is unexpected
                        setCompounds([]);
                        setError("No compound data found in the API response");
                        
                        toast({
                            title: "No Compounds Found",
                            description: "The search completed but no compounds were found",
                            variant: "destructive",
                        });
                    }
                } catch (error) {
                    console.error("Error processing compounds:", error);
                    setError("Error processing the optimization results");
                    
                    toast({
                        title: "Processing Error",
                        description: "There was a problem processing the optimization results",
                        variant: "destructive",
                    });
                }
            } else {
                // If there are no optimized compounds in the response
                setCompounds([]);
                setError("No compound data found in the API response");
                
                toast({
                    title: "No Compounds Found",
                    description: "The search completed but no compounds were found",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Optimization error:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to find optimized compounds"
            );
            
            toast({
                title: "Optimization Failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to find optimized compounds",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 overflow-hidden">
            <Header /> 
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4"
                    >
                        Protein-Compound Compatibility
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Input a protein sequence or identifier to discover
                        potential drug compounds with high binding affinity.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    <div className="lg:col-span-5">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <ProteinInput
                                        value={proteinInput}
                                        onChange={setProteinInput}
                                        onExampleClick={fillExampleData}
                                        disabled={isLoading}
                                    />

                                    {/* Optimization Parameters Preview */}
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <p className="font-medium">
                                            Generation Parameters:
                                        </p>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                            <div>
                                                Compounds: {numCompounds}
                                            </div>
                                            <div>
                                                Binding Affinity: {bindingAffinity.toFixed(1)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Optimization Weights Preview */}
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <p className="font-medium">
                                            Optimization Weights:
                                        </p>
                                        <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                                            <div>
                                                Druglikeness:{" "}
                                                {optimizationWeights.druglikeness.toFixed(
                                                    1
                                                )}
                                            </div>
                                            <div>
                                                Synth. Access:{" "}
                                                {optimizationWeights.synthetic_accessibility.toFixed(
                                                    1
                                                )}
                                            </div>
                                            <div>
                                                Lipinski:{" "}
                                                {optimizationWeights.lipinski_violations.toFixed(
                                                    1
                                                )}
                                            </div>
                                            <div>
                                                Toxicity:{" "}
                                                {optimizationWeights.toxicity.toFixed(
                                                    1
                                                )}
                                            </div>
                                            <div>
                                                Binding:{" "}
                                                {optimizationWeights.binding_affinity.toFixed(
                                                    1
                                                )}
                                            </div>
                                            <div>
                                                Solubility:{" "}
                                                {optimizationWeights.solubility.toFixed(
                                                    1
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full"
                                        onClick={handleSearchButtonClick}
                                        disabled={
                                            isLoading ||
                                            proteinInput.length !== 4
                                        }
                                    >
                                        Find Optimized Compounds
                                    </Button>
                                    {error && (
                                        <p className="text-sm text-red-500">
                                            {error}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="glass rounded-2xl p-6 h-full min-h-[400px]"
                        >
                            <ProteinStructure proteinSequence={proteinInput} />
                        </motion.div>
                    </div>
                </div>

                <Dialog
                    open={showWeightsDialog}
                    onOpenChange={setShowWeightsDialog}
                >
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Optimization Settings</DialogTitle>
                            <DialogDescription>
                                Adjust the generation parameters and property weights
                                for compound optimization.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {/* Generation parameters */}
                            <div className="space-y-4 border-b pb-4 mb-2">
                                <h3 className="font-medium">Generation Parameters</h3>
                                
                                {/* Number of compounds slider */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="numCompounds"
                                        className="flex justify-between"
                                    >
                                        <span>Number of Compounds</span>
                                        <span className="text-muted-foreground">
                                            {numCompounds}
                                        </span>
                                    </Label>
                                    <Slider
                                        id="numCompounds"
                                        value={[numCompounds]}
                                        min={5}
                                        max={50}
                                        step={1}
                                        onValueChange={(val) => setNumCompounds(val[0])}
                                    />
                                </div>
                                
                                {/* Binding affinity slider */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="bindingAffinity"
                                        className="flex justify-between"
                                    >
                                        <span>Target Binding Affinity</span>
                                        <span className="text-muted-foreground">
                                            {bindingAffinity.toFixed(1)}
                                        </span>
                                    </Label>
                                    <Slider
                                        id="bindingAffinity"
                                        value={[bindingAffinity]}
                                        min={0.1}
                                        max={1.0}
                                        step={0.1}
                                        onValueChange={(val) => setBindingAffinity(val[0])}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Higher values indicate stronger binding (normalized scale)
                                    </p>
                                </div>
                            </div>

                            {/* Generate visualizations toggle */}
                            <div className="flex items-center justify-between">
                                <Label htmlFor="generate_visualizations">
                                    Generate 3D Visualizations
                                </Label>
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="checkbox" 
                                        id="generate_visualizations"
                                        checked={generateVisualizations}
                                        onChange={(e) => setGenerateVisualizations(e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="generate_visualizations" className="text-sm text-muted-foreground">
                                        {generateVisualizations ? "Enabled" : "Disabled"}
                                    </Label>
                                </div>
                            </div>

                            {/* Optimization weight sliders */}
                            <h3 className="font-medium mt-2">Optimization Weights</h3>
                            
                            <div className="space-y-2">
                                <Label
                                    htmlFor="druglikeness"
                                    className="flex justify-between"
                                >
                                    <span>Druglikeness</span>
                                    <span className="text-muted-foreground">
                                        {optimizationWeights.druglikeness.toFixed(1)}
                                    </span>
                                </Label>
                                <Slider
                                    id="druglikeness"
                                    value={[optimizationWeights.druglikeness]}
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    onValueChange={(val) =>
                                        setOptimizationWeights({
                                            ...optimizationWeights,
                                            druglikeness: val[0],
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="synthetic_accessibility"
                                    className="flex justify-between"
                                >
                                    <span>Synthetic Accessibility</span>
                                    <span className="text-muted-foreground">
                                        {optimizationWeights.synthetic_accessibility.toFixed(1)}
                                    </span>
                                </Label>
                                <Slider
                                    id="synthetic_accessibility"
                                    value={[optimizationWeights.synthetic_accessibility]}
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    onValueChange={(val) =>
                                        setOptimizationWeights({
                                            ...optimizationWeights,
                                            synthetic_accessibility: val[0],
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="lipinski_violations"
                                    className="flex justify-between"
                                >
                                    <span>Lipinski Violations</span>
                                    <span className="text-muted-foreground">
                                        {optimizationWeights.lipinski_violations.toFixed(1)}
                                    </span>
                                </Label>
                                <Slider
                                    id="lipinski_violations"
                                    value={[optimizationWeights.lipinski_violations]}
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    onValueChange={(val) =>
                                        setOptimizationWeights({
                                            ...optimizationWeights,
                                            lipinski_violations: val[0],
                                        })
                                    }
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label
                                    htmlFor="toxicity"
                                    className="flex justify-between"
                                >
                                    <span>Toxicity</span>
                                    <span className="text-muted-foreground">
                                        {optimizationWeights.toxicity.toFixed(1)}
                                    </span>
                                </Label>
                                <Slider
                                    id="toxicity"
                                    value={[optimizationWeights.toxicity]}
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    onValueChange={(val) =>
                                        setOptimizationWeights({
                                            ...optimizationWeights,
                                            toxicity: val[0],
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="binding_affinity"
                                    className="flex justify-between"
                                >
                                    <span>Binding Weight</span>
                                    <span className="text-muted-foreground">
                                        {optimizationWeights.binding_affinity.toFixed(1)}
                                    </span>
                                </Label>
                                <Slider
                                    id="binding_affinity"
                                    value={[optimizationWeights.binding_affinity]}
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    onValueChange={(val) =>
                                        setOptimizationWeights({
                                            ...optimizationWeights,
                                            binding_affinity: val[0],
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="solubility"
                                    className="flex justify-between"
                                >
                                    <span>Solubility</span>
                                    <span className="text-muted-foreground">
                                        {optimizationWeights.solubility.toFixed(1)}
                                    </span>
                                </Label>
                                <Slider
                                    id="solubility"
                                    value={[optimizationWeights.solubility]}
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    onValueChange={(val) =>
                                        setOptimizationWeights({
                                            ...optimizationWeights,
                                            solubility: val[0],
                                        })
                                    }
                                />
                            </div>    
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowWeightsDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSearch} disabled={isLoading}>
                                {isLoading ? "Processing..." : "Find Compounds"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Separator className="mb-12 opacity-30" />

                {/* Show results when compounds are available */}
                {compounds.length > 0 && (
                    <CompoundResults 
                        compounds={compounds} 
                        optimizationResponse={optimizationResponse}
                    />
                )}
                {/* Show loading state */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12"
                    >
                        <div className="h-12 w-12 rounded-full border-4 border-t-primary animate-spin mb-4"></div>
                        <p className="text-lg text-muted-foreground">
                            Processing your request...
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            This may take a few moments as we compute optimized compounds
                        </p>
                    </motion.div>
                )}
            </motion.div>

            <footer className="py-6">
                <div className="container mx-auto px-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center items-center"
                  >
                    <p className="text-sm text-gray-600">
                      Made with <span className="text-red-500">❤</span> by Cloud Catalysts
                    </p>
                  </motion.div>
                </div>
            </footer>
        </div>
    );
};

export default ProteinSearch;