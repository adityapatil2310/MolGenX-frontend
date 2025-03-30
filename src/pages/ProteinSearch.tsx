import React, { useState } from "react";
import { motion } from "framer-motion";
import ProteinInput from "@/components/ProteinInput";
import CompoundResults from "@/components/CompoundResults";
import ProteinStructure from "@/components/ProteinStructure";
import { searchCompounds } from "@/utils/proteinUtils";
import { Separator } from "@/components/ui/separator";

export interface Compound {
	id: string;
	name: string;
	formula: string;
	molecularWeight: number;
	toxicity: number;
	likeliness: number;
	structure: string;
  synthetic_accessibility: number;
  lipinski_violations: number;
  binding_affinity: number;
  solubility: number;
}

const ProteinSearch = () => {
	const [proteinSequence, setProteinSequence] = useState<string>("");
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [compounds, setCompounds] = useState<Compound[]>([]);
	const [error, setError] = useState<string | null>(null);

	const handleSearch = async (sequence: string) => {
		if (!sequence.trim()) {
			setError("Please enter a protein sequence or identifier");
			return;
		}

		setIsSearching(true);
		setError(null);

		try {
			const results = await searchCompounds(sequence);
			setCompounds(results);
		} catch (err) {
			console.error("Error searching compounds:", err);
			setError(
				"An error occurred while searching for compatible compounds"
			);
		} finally {
			setIsSearching(false);
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
						<ProteinInput
							onSearch={handleSearch}
							isSearching={isSearching}
							error={error}
							setProteinSequence={setProteinSequence}
						/>
					</div>

					<div className="lg:col-span-7">
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.5, duration: 0.5 }}
							className="glass rounded-2xl p-6 h-full"
						>
							<ProteinStructure
								proteinSequence={proteinSequence}
							/>
						</motion.div>
					</div>
				</div>

				<Separator className="mb-12 opacity-30" />

				<CompoundResults
					compounds={compounds}
					isLoading={isSearching}
				/>
			</motion.div>
		</div>
	);
};

export default ProteinSearch;
