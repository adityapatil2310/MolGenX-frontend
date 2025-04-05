import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import CompoundResults from "@/components/CompoundResults";
import ProteinStructure from "@/components/ProteinStructure";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
	optimized_variants: any[];
	variants_explanation: string;
}

const ProteinSearch: React.FC = () => {
	const [proteinInput, setProteinInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [compounds, setCompounds] = useState<Compound[]>([]);
	const [optimizationResponse, setOptimizationResponse] =
		useState<OptimizationResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
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

	const handleSearch = async () => {
		if (!proteinInput.trim()) {
			setError("Please enter a protein sequence or identifier");
			toast({
				title: "Input Required",
				description: "Please enter a protein sequence or identifier",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);
		setError(null);

		console.log("Sending request to:", `${apiUrl}/api/optimize`);
		console.log("Request body:", {
			protein: proteinInput,
			weights: optimizationWeights,
		});

		try {
			// Call the optimize API endpoint
			const optimizeResponse = await fetch(`${apiUrl}/api/optimize`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				credentials: "include", // Include cookies if needed
				body: JSON.stringify({
					protein: proteinInput,
					weights: optimizationWeights,
				}),
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

			// Store the complete optimization response
			setOptimizationResponse(responseData);

			// Also update compounds for backward compatibility
			if (responseData.optimized_compounds) {
				setCompounds(
					responseData.optimized_compounds.map((compound: any) => ({
						id:
							compound.id ||
							Math.random().toString(36).substring(7),
						name:
							compound.name ||
							`Compound-${Math.random()
								.toString(36)
								.substring(7)}`,
						formula: compound.formula || compound.smiles || "",
						molecularWeight: compound.molecular_weight || 0,
						likeliness: compound.druglikeness || 0,
						toxicity: compound.toxicity || 0,
						binding_affinity: compound.binding_affinity || 0,
						synthetic_accessibility:
							compound.synthetic_accessibility || 0,
						lipinski_violations: compound.lipinski_violations || 0,
						solubility: compound.solubility || 0,
						structure: compound.smiles || "",
					}))
				);
			}

			toast({
				title: "Search Complete",
				description: "Found optimized compounds for your protein",
			});
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
		<div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-7xl mx-auto"
			>
				<div className="text-center mb-16">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.7 }}
						className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3"
					>
						Drug Discovery Platform
					</motion.div>
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
									<div className="space-y-2">
										<label className="text-sm font-medium">
											Enter Protein Sequence or PDB ID
										</label>
										<Textarea
											placeholder="Try Human Haemoglobin: 1HHO or MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTT..."
											value={proteinInput}
											onChange={(e) =>
												setProteinInput(e.target.value)
											}
											className="h-32"
										/>
										<div className="flex items-center justify-between">
											<p className="text-xs text-muted-foreground">
												Paste a protein amino acid
												sequence or PDB ID to find
												optimized compounds. Try Human
												Haemoglobin (PDB: 1HHO).
											</p>
											<Button
												variant="outline"
												size="sm"
												onClick={fillExampleData}
												className="text-xs"
											>
												Try Human Haemoglobin
											</Button>
										</div>
									</div>

									<Button
										className="w-full"
										onClick={handleSearch}
										disabled={isLoading}
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
							className="glass rounded-2xl p-6 h-full"
						>
							<ProteinStructure proteinSequence={proteinInput} />
						</motion.div>
					</div>
				</div>

				<Separator className="mb-12 opacity-30" />

				<CompoundResults
					compounds={compounds}
					isLoading={isLoading}
					proteinInput={proteinInput}
					optimizationResponse={optimizationResponse}
					weights={optimizationWeights}
				/>
			</motion.div>
		</div>
	);
};

export default ProteinSearch;
