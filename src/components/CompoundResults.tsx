import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
	Download,
	ExternalLink,
	Info,
	Filter,
	ArrowUpDown,
	Sparkles,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import LoadingIndicator from "@/components/ui-elements/LoadingIndicator";
import {
	Compound,
	OptimizationResponse,
	OptimizationWeights,
} from "@/pages/ProteinSearch";
import "./CompoundResutls.css";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export interface CompoundResultsProps {
	compounds: Compound[];
	isLoading: boolean;
	proteinInput: string;
	optimizationResponse: OptimizationResponse | null;
	weights: OptimizationWeights;
}

// Define the OptimizedCompound interface that extends Compound
export interface OptimizedCompound extends Compound {
	metrics: {
		druglikeness: number;
		synthetic_accessibility: number;
		lipinski_violations: number;
		toxicity: number;
		binding_affinity: number;
		solubility: number;
	};
}

const apiUrl = import.meta.env.VITE_API_URL;

const CompoundResults: React.FC<CompoundResultsProps> = ({
	compounds,
	isLoading,
	proteinInput,
	optimizationResponse,
	weights,
}) => {
	const hasResults = compounds.length > 0;
	const [displayedCompounds, setDisplayedCompounds] = useState(compounds);
	const [filterOpen, setFilterOpen] = useState(false);
	const [sortOpen, setSortOpen] = useState(false);
	const [optimizationOpen, setOptimizationOpen] = useState(false);
	const [isOptimizing, setIsOptimizing] = useState(false);
	const [optimizedCompounds, setOptimizedCompounds] = useState<
		OptimizedCompound[]
	>([]);
	const [explanation, setExplanation] = useState("");
	const [showOptimized, setShowOptimized] = useState(false);
	const { toast } = useToast();

	const [optimizationWeights, setOptimizationWeights] =
		useState<OptimizationWeights>({
			druglikeness: 1.0,
			synthetic_accessibility: 0.8,
			lipinski_violations: 0.7,
			toxicity: 1.2,
			binding_affinity: 1.5,
			solubility: 0.6,
		});

	const [filters, setFilters] = useState({
		minLikeliness: 0,
		maxToxicity: 10,
		minBindingAffinity: 0,
		sortBy: "likeliness-desc" as
			| "likeliness-desc"
			| "likeliness-asc"
			| "toxicity-asc"
			| "toxicity-desc"
			| "binding-desc"
			| "binding-asc",
	});

	// Update displayed compounds when filters change or when switching between original/optimized
	useEffect(() => {
		if (!compounds.length && !optimizedCompounds.length) return;

		const sourceCompounds = showOptimized ? optimizedCompounds : compounds;

		let filtered = [...sourceCompounds].filter(
			(compound) =>
				compound.likeliness >= filters.minLikeliness &&
				compound.toxicity <= filters.maxToxicity &&
				compound.binding_affinity >= filters.minBindingAffinity
		);

		// Sort based on selected option
		switch (filters.sortBy) {
			case "likeliness-desc":
				filtered.sort((a, b) => b.likeliness - a.likeliness);
				break;
			case "likeliness-asc":
				filtered.sort((a, b) => a.likeliness - b.likeliness);
				break;
			case "toxicity-desc":
				filtered.sort((a, b) => b.toxicity - a.toxicity);
				break;
			case "toxicity-asc":
				filtered.sort((a, b) => a.toxicity - b.toxicity);
				break;
			case "binding-desc":
				filtered.sort(
					(a, b) => b.binding_affinity - a.binding_affinity
				);
				break;
			case "binding-asc":
				filtered.sort(
					(a, b) => a.binding_affinity - b.binding_affinity
				);
				break;
		}

		setDisplayedCompounds(filtered);
	}, [compounds, optimizedCompounds, filters, showOptimized]);

	// Function to call the optimization API
	const optimizeCompounds = async () => {
		if (!proteinInput) {
			toast({
				title: "Missing Protein Data",
				description:
					"Please enter a protein sequence or identifier first.",
				variant: "destructive",
			});
			return;
		}

		setIsOptimizing(true);

		try {
			const response = await fetch(`${apiUrl}/api/optimize`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					protein: proteinInput,
					weights: optimizationWeights,
				}),
			});

			if (!response.ok) {
				throw new Error(
					`Error: ${response.status} ${response.statusText}`
				);
			}

			const data = await response.json();

			// Transform API data to match our compound interface
			const transformedCompounds = data.optimized_compounds.map(
				(compound: any) => ({
					id: compound.id || Math.random().toString(36).substr(2, 9),
					name: compound.name || `Compound-${compound.id || ""}`,
					formula: compound.smiles || compound.formula || "",
					likeliness: compound.metrics?.druglikeness || 0,
					toxicity: compound.metrics?.toxicity || 0,
					binding_affinity: compound.metrics?.binding_affinity || 0,
					molecularWeight: compound.metrics?.molecular_weight || 0,
					structure:
						compound.visualization_url ||
						compound.structure ||
						"https://placeholder.com/molecule.svg",
					metrics: {
						druglikeness: compound.metrics?.druglikeness || 0,
						synthetic_accessibility:
							compound.metrics?.synthetic_accessibility || 0,
						lipinski_violations:
							compound.metrics?.lipinski_violations || 0,
						toxicity: compound.metrics?.toxicity || 0,
						binding_affinity:
							compound.metrics?.binding_affinity || 0,
						solubility: compound.metrics?.solubility || 0,
					},
				})
			);

			setOptimizedCompounds(transformedCompounds);
			setExplanation(data.explanation || "");
			setShowOptimized(true);

			toast({
				title: "Optimization Complete",
				description: `Found ${transformedCompounds.length} optimized compounds for your target.`,
			});
		} catch (error) {
			console.error("Optimization error:", error);
			toast({
				title: "Optimization Failed",
				description:
					error instanceof Error
						? error.message
						: "Failed to optimize compounds",
				variant: "destructive",
			});
		} finally {
			setIsOptimizing(false);
			setOptimizationOpen(false);
		}
	};

	// Animation variants
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	};

	if (isLoading || isOptimizing) {
		return (
			<div className="flex flex-col items-center justify-center py-24">
				<LoadingIndicator
					message={
						isOptimizing
							? "Optimizing compounds for your target..."
							: "Searching for compatible compounds..."
					}
				/>
			</div>
		);
	}

	if (
		!hasResults &&
		!optimizedCompounds.length &&
		!isLoading &&
		!isOptimizing
	) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="text-center py-24"
			>
				<p className="text-muted-foreground">
					Enter a protein sequence or identifier and click search to
					find compatible compounds.
				</p>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="pb-16"
		>
			<div className="mb-10 text-center">
				<h2 className="text-2xl font-semibold mb-2">
					{showOptimized
						? "Optimized Compounds"
						: "Compatible Compounds"}
				</h2>
				<p className="text-muted-foreground">
					{displayedCompounds.length ===
					(showOptimized
						? optimizedCompounds.length
						: compounds.length)
						? `We found ${
								showOptimized
									? optimizedCompounds.length
									: compounds.length
						  } compounds with potential binding affinity.`
						: `Showing ${displayedCompounds.length} of ${
								showOptimized
									? optimizedCompounds.length
									: compounds.length
						  } compounds.`}
				</p>

				{explanation && showOptimized && (
					<div className="mt-4 p-4 bg-primary/5 rounded-md text-sm text-left max-h-64 overflow-y-auto">
						<h3 className="font-medium mb-2">AI Analysis:</h3>
						<p>{explanation}</p>
					</div>
				)}

				{/* Add optimization settings button */}
				<div className="mt-4">
					<Dialog
						open={optimizationOpen}
						onOpenChange={setOptimizationOpen}
					>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="gap-1"
							>
								<Sparkles className="h-4 w-4" />
								<span>Optimization Settings</span>
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[500px]">
							<DialogHeader>
								<DialogTitle>Optimization Settings</DialogTitle>
								<DialogDescription>
									Adjust parameters for compound optimization
									during search.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="space-y-2">
									<Label htmlFor="druglikeness">
										Drug Likeliness (
										{optimizationWeights.druglikeness.toFixed(
											1
										)}
										)
									</Label>
									<Slider
										id="druglikeness"
										value={[
											optimizationWeights.druglikeness,
										]}
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
									<Label htmlFor="synthetic_accessibility">
										Synthetic Accessibility (
										{optimizationWeights.synthetic_accessibility.toFixed(
											1
										)}
										)
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
									<Label htmlFor="lipinski_violations">
										Lipinski Violations (
										{optimizationWeights.lipinski_violations.toFixed(
											1
										)}
										)
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
									<Label htmlFor="toxicity">
										Toxicity (
										{optimizationWeights.toxicity.toFixed(
											1
										)}
										)
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
									<Label htmlFor="binding_affinity">
										Binding Affinity (
										{optimizationWeights.binding_affinity.toFixed(
											1
										)}
										)
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
									<Label htmlFor="solubility">
										Solubility (
										{optimizationWeights.solubility.toFixed(
											1
										)}
										)
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
									onClick={() => setOptimizationOpen(false)}
								>
									Close
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<div className="mb-8 flex flex-wrap gap-4">
				{/* Tab buttons to switch between original and optimized compounds */}
				{optimizedCompounds.length > 0 && (
					<div className="flex rounded-md overflow-hidden border border-input">
						<Button
							variant={showOptimized ? "outline" : "default"}
							className="rounded-none"
							onClick={() => setShowOptimized(false)}
						>
							Original Results
						</Button>
						<Button
							variant={showOptimized ? "default" : "outline"}
							className="rounded-none"
							onClick={() => setShowOptimized(true)}
						>
							Optimized Results
						</Button>
					</div>
				)}

				<Button
					variant="outline"
					className="flex items-center gap-2"
					onClick={() => setFilterOpen(!filterOpen)}
				>
					<Filter className="h-4 w-4" />
					<span>Filter Compounds</span>
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="flex items-center gap-2"
						>
							<ArrowUpDown className="h-4 w-4" />
							<span>Sort Compounds</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-56">
						<DropdownMenuItem
							onClick={() =>
								setFilters({
									...filters,
									sortBy: "likeliness-desc",
								})
							}
							className={
								filters.sortBy === "likeliness-desc"
									? "bg-primary/10"
									: ""
							}
						>
							Highest Drug Likeliness
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								setFilters({
									...filters,
									sortBy: "likeliness-asc",
								})
							}
							className={
								filters.sortBy === "likeliness-asc"
									? "bg-primary/10"
									: ""
							}
						>
							Lowest Drug Likeliness
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								setFilters({
									...filters,
									sortBy: "toxicity-asc",
								})
							}
							className={
								filters.sortBy === "toxicity-asc"
									? "bg-primary/10"
									: ""
							}
						>
							Lowest Toxicity
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								setFilters({
									...filters,
									sortBy: "toxicity-desc",
								})
							}
							className={
								filters.sortBy === "toxicity-desc"
									? "bg-primary/10"
									: ""
							}
						>
							Highest Toxicity
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								setFilters({
									...filters,
									sortBy: "binding-desc",
								})
							}
							className={
								filters.sortBy === "binding-desc"
									? "bg-primary/10"
									: ""
							}
						>
							Highest Binding Affinity
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								setFilters({
									...filters,
									sortBy: "binding-asc",
								})
							}
							className={
								filters.sortBy === "binding-asc"
									? "bg-primary/10"
									: ""
							}
						>
							Lowest Binding Affinity
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<AnimatePresence>
				{filterOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="bg-card border rounded-md p-4 overflow-hidden shadow-sm mb-4"
					>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="space-y-2">
								<label className="text-sm font-medium">
									Minimum Drug Likeliness
								</label>
								<div className="flex items-center gap-4">
									<Slider
										value={[filters.minLikeliness]}
										min={0}
										max={10}
										step={0.1}
										onValueChange={(value) =>
											setFilters({
												...filters,
												minLikeliness: value[0],
											})
										}
									/>
									<span className="text-sm font-medium w-12 text-right">
										{filters.minLikeliness.toFixed(1)}
									</span>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">
									Maximum Toxicity
								</label>
								<div className="flex items-center gap-4">
									<Slider
										value={[filters.maxToxicity]}
										min={0}
										max={10}
										step={0.1}
										onValueChange={(value) =>
											setFilters({
												...filters,
												maxToxicity: value[0],
											})
										}
									/>
									<span className="text-sm font-medium w-12 text-right">
										{filters.maxToxicity.toFixed(1)}
									</span>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">
									Minimum Binding Affinity
								</label>
								<div className="flex items-center gap-4">
									<Slider
										value={[filters.minBindingAffinity]}
										min={0}
										max={10}
										step={0.1}
										onValueChange={(value) =>
											setFilters({
												...filters,
												minBindingAffinity: value[0],
											})
										}
									/>
									<span className="text-sm font-medium w-12 text-right">
										{filters.minBindingAffinity.toFixed(1)}
									</span>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
			>
				{displayedCompounds.map((compound) => (
					<motion.div key={compound.id} variants={item}>
						<CompoundCard
							compound={compound}
							isOptimized={showOptimized}
						/>
					</motion.div>
				))}
			</motion.div>
		</motion.div>
	);
};

const CompoundCard: React.FC<{
	compound: Compound | OptimizedCompound;
	isOptimized?: boolean;
}> = ({ compound, isOptimized = false }) => {
	const [isFlipped, setIsFlipped] = useState(false);

	// Check if this is an optimized compound with metrics
	const hasMetrics = "metrics" in compound;

	return (
		<div className={`card-container ${isFlipped ? "flipped" : ""}`}>
			<Card className="card-front overflow-hidden transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 h-full flex flex-col">
				<CardHeader className="pb-2">
					<div className="flex justify-between items-start">
						<div>
							<CardTitle className="text-lg flex items-center gap-2">
								{compound.name}
								{isOptimized && (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<span className="inline-flex">
													<Sparkles className="h-4 w-4 text-primary" />
												</span>
											</TooltipTrigger>
											<TooltipContent>
												<p>Optimized compound</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
							</CardTitle>
							<CardDescription>
								{compound.formula}
							</CardDescription>
						</div>
						<div className="rounded-full bg-primary/10 text-primary px-2 py-1 text-xs font-semibold">
							Drug Likeliness: {compound.likeliness.toFixed(2)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="flex-grow pb-2">
					<div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md mb-4 overflow-hidden flex items-center justify-center p-2">
						<img
							src={compound.structure}
							alt={`Structure of ${compound.name}`}
							className="w-full h-full object-contain"
						/>
					</div>
					<div className="grid grid-cols-2 gap-2 text-sm">
						<div>
							<p className="text-muted-foreground text-xs">
								Molecular Weight
							</p>
							<p className="font-medium">
								{compound.molecularWeight.toFixed(2)}
							</p>
						</div>
						<div>
							<p className="text-muted-foreground text-xs">
								Toxicity
							</p>
							<p className="font-medium">
								{compound.toxicity.toFixed(2)}
							</p>
						</div>
					</div>
				</CardContent>
				<CardFooter className="pt-2">
					<div className="flex justify-between w-full">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="gap-1"
										onClick={() => setIsFlipped(!isFlipped)}
									>
										<Info className="h-3.5 w-3.5" />
										<span className="text-xs">Details</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>View detailed information</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="gap-1"
									>
										<Download className="h-3.5 w-3.5" />
										<span className="text-xs">
											Download
										</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Download structure file</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</CardFooter>
			</Card>

			<Card className="card-back overflow-hidden transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 h-full flex flex-col">
				<CardHeader className="pb-2">
					<div className="flex justify-between items-start">
						<div>
							<CardTitle className="text-lg flex items-center gap-2">
								{compound.name} - Details
								{isOptimized && (
									<Sparkles className="h-4 w-4 text-primary" />
								)}
							</CardTitle>
							<CardDescription>
								{compound.formula}
							</CardDescription>
						</div>
						<div className="rounded-full bg-primary/10 text-primary px-2 py-1 text-xs font-semibold">
							Drug Likeliness: {compound.likeliness.toFixed(2)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="flex-grow pb-2">
					<div className="space-y-2">
						<h3 className="text-sm font-medium">
							Compound Properties
						</h3>
						<ul className="list-none space-y-1 text-sm">
							<li className="flex justify-between">
								<span>Drug Likeliness:</span>
								<span className="font-medium">
									{compound.likeliness.toFixed(2)}
								</span>
							</li>
							<li className="flex justify-between">
								<span>Synthetic Accessibility:</span>
								<span className="font-medium">
									{hasMetrics
										? (
												compound as OptimizedCompound
										  ).metrics.synthetic_accessibility.toFixed(
												2
										  )
										: "10.0"}
								</span>
							</li>
							<li className="flex justify-between">
								<span>Lipinski Violations:</span>
								<span className="font-medium">
									{hasMetrics
										? (
												compound as OptimizedCompound
										  ).metrics.lipinski_violations.toFixed(
												0
										  )
										: "4"}
								</span>
							</li>
							<li className="flex justify-between">
								<span>Toxicity:</span>
								<span className="font-medium">
									{compound.toxicity.toFixed(2)}
								</span>
							</li>
							<li className="flex justify-between">
								<span>Binding Affinity:</span>
								<span className="font-medium">
									{compound.binding_affinity.toFixed(2)}
								</span>
							</li>
							<li className="flex justify-between">
								<span>Solubility:</span>
								<span className="font-medium">
									{hasMetrics
										? (
												compound as OptimizedCompound
										  ).metrics.solubility.toFixed(2)
										: "-5.0"}
								</span>
							</li>
						</ul>
					</div>
				</CardContent>
				<CardFooter className="pt-2">
					<Button
						variant="outline"
						size="sm"
						className="gap-1"
						onClick={() => setIsFlipped(!isFlipped)}
					>
						<span className="text-xs">Back</span>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default CompoundResults;
