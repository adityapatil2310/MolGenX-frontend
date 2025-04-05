import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import CompoundResults from "@/components/CompoundResults";
import ProteinStructure from "@/components/ProteinStructure";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProteinInput from "@/components/ProteinInput";
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
	const [showWeightsDialog, setShowWeightsDialog] = useState(false);
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
		setIsLoading(true);
		setError(null);
		// Close the weights dialog
		setShowWeightsDialog(false);

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

			// The API returns optimized_compounds as a JSON string, so we need to parse it
			let parsedOptimizedCompounds = [];

			if (responseData.optimized_compounds) {
				try {
					// Try to parse the optimized_compounds string if it's a string
					if (typeof responseData.optimized_compounds === "string") {
						parsedOptimizedCompounds = JSON.parse(
							responseData.optimized_compounds
						);
					} else {
						// If it's already an array, use it directly
						parsedOptimizedCompounds =
							responseData.optimized_compounds;
					}

					console.log("Parsed compounds:", parsedOptimizedCompounds);
				} catch (parseError) {
					console.error(
						"Error parsing optimized_compounds:",
						parseError
					);
				}
			}

			// Create a proper optimizationResponse object with parsed compounds
			const formattedResponse = {
				...responseData,
				optimized_compounds: parsedOptimizedCompounds,
				// Also parse optimized_variants if present and a string
				optimized_variants:
					responseData.optimized_variants &&
					typeof responseData.optimized_variants === "string"
						? JSON.parse(responseData.optimized_variants)
						: responseData.optimized_variants || [],
			};

			// Store the complete optimization response with properly parsed arrays
			setOptimizationResponse(formattedResponse);

			// Map the parsed compounds to our application's Compound interface
			if (
				parsedOptimizedCompounds &&
				Array.isArray(parsedOptimizedCompounds)
			) {
				setCompounds(
					parsedOptimizedCompounds.map((compound: any) => ({
						id:
							compound.rank?.toString() ||
							Math.random().toString(36).substring(7),
						name:
							compound.name || `Compound-${compound.rank || ""}`,
						formula: compound.smiles || "",
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

				toast({
					title: "Search Complete",
					description: `Found ${parsedOptimizedCompounds.length} optimized compounds for your protein`,
				});
			} else {
				setCompounds([]);
				setError("No compound data found in the API response");

				toast({
					title: "No Compounds Found",
					description:
						"The search completed but no compounds were found",
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
									<ProteinInput
										value={proteinInput}
										onChange={setProteinInput}
										onExampleClick={fillExampleData}
										disabled={isLoading}
									/>

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
							className="glass rounded-2xl p-6 h-full"
						>
							<ProteinStructure proteinSequence={proteinInput} />
						</motion.div>
					</div>
				</div>

				{/* Optimization Weights Dialog */}
				<Dialog
					open={showWeightsDialog}
					onOpenChange={setShowWeightsDialog}
				>
					<DialogContent className="sm:max-w-[500px]">
						<DialogHeader>
							<DialogTitle>Optimization Weights</DialogTitle>
							<DialogDescription>
								Adjust the importance of different properties
								for compound optimization. Higher values give
								more importance to that property.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="space-y-2">
								<Label
									htmlFor="druglikeness"
									className="flex justify-between"
								>
									<span>Drug Likeliness</span>
									<span className="text-muted-foreground">
										{optimizationWeights.druglikeness.toFixed(
											1
										)}
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
										{optimizationWeights.synthetic_accessibility.toFixed(
											1
										)}
									</span>
								</Label>
								<Slider
									id="synthetic_accessibility"
									value={[
										optimizationWeights.synthetic_accessibility,
									]}
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
										{optimizationWeights.lipinski_violations.toFixed(
											1
										)}
									</span>
								</Label>
								<Slider
									id="lipinski_violations"
									value={[
										optimizationWeights.lipinski_violations,
									]}
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
										{optimizationWeights.toxicity.toFixed(
											1
										)}
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
									<span>Binding Affinity</span>
									<span className="text-muted-foreground">
										{optimizationWeights.binding_affinity.toFixed(
											1
										)}
									</span>
								</Label>
								<Slider
									id="binding_affinity"
									value={[
										optimizationWeights.binding_affinity,
									]}
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
										{optimizationWeights.solubility.toFixed(
											1
										)}
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
