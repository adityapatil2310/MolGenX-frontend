import { Compound } from "@/pages/ProteinSearch";

// Mock data for compounds
const mockCompounds: Compound[] = [
	{
		id: "c001",
		name: "Compound A",
		formula: "C22H24N2O8",
		molecularWeight: 445.43,
		toxicity: 2.34,
		likeliness: 0.87,
		structure:
			"https://cdn.rcsb.org/images/structures/examples/5fyi-assembly-1.png",
		synthetic_accessibility: 10.0,
		lipinski_violations: 4.0,
		binding_affinity: 0.0,
		solubility: -5.0,
	},
	{
		id: "c002",
		name: "Compound B",
		formula: "C17H19NO3",
		molecularWeight: 285.34,
		toxicity: 3.15,
		likeliness: 0.79,
		structure:
			"https://cdn.rcsb.org/images/structures/examples/7ehu-assembly-1.png",
		synthetic_accessibility: 10.0,
		lipinski_violations: 4.0,
		binding_affinity: 0.0,
		solubility: -5.0,
	},
	{
		id: "c003",
		name: "Compound C",
		formula: "C21H30O2",
		molecularWeight: 314.47,
		toxicity: 4.56,
		likeliness: 0.75,
		structure:
			"https://cdn.rcsb.org/images/structures/examples/7mj4-assembly-1.png",
		synthetic_accessibility: 10.0,
		lipinski_violations: 4.0,
		binding_affinity: 0.0,
		solubility: -5.0,
	},
	{
		id: "c004",
		name: "Compound D",
		formula: "C15H11ClN2O",
		molecularWeight: 270.72,
		toxicity: 3.02,
		likeliness: 0.68,
		structure:
			"https://cdn.rcsb.org/images/structures/examples/7rcc-assembly-1.png",
		synthetic_accessibility: 10.0,
		lipinski_violations: 4.0,
		binding_affinity: 0.0,
		solubility: -5.0,
	},
	{
		id: "c005",
		name: "Compound E",
		formula: "C16H13ClN2O",
		molecularWeight: 284.74,
		toxicity: 3.18,
		likeliness: 0.64,
		structure:
			"https://cdn.rcsb.org/images/structures/examples/7u32-assembly-1.png",
		synthetic_accessibility: 10.0,
		lipinski_violations: 4.0,
		binding_affinity: 0.0,
		solubility: -5.0,
	},
	{
		id: "c006",
		name: "Compound F",
		formula: "C19H21NO4",
		molecularWeight: 327.38,
		toxicity: 2.76,
		likeliness: 0.59,
		structure:
			"https://cdn.rcsb.org/images/structures/examples/8qw9-assembly-1.png",
		synthetic_accessibility: 10.0,
		lipinski_violations: 4.0,
		binding_affinity: 0.0,
		solubility: -5.0,
	},
];

/**
 * Search for compounds compatible with a given protein sequence or identifier.
 *
 * In a real application, this would connect to a backend API, molecular docking
 * service, or database. For demo purposes, this returns mock data.
 */
export const searchCompounds = async (
	proteinSequenceOrId: string
): Promise<Compound[]> => {
	// Simulate API call delay
	await new Promise((resolve) => setTimeout(resolve, 2000));

	// In a real app, this function would:
	// 1. Validate the protein sequence/ID
	// 2. Query a database or API for compatible compounds
	// 3. Process and return the results

	// Generate a random subset of the mock compounds as search results
	const shuffled = [...mockCompounds].sort(() => 0.5 - Math.random());

	// Return between 3-6 random compounds
	return shuffled.slice(0, Math.floor(Math.random() * 4) + 3);
};

/**
 * Validate a protein sequence.
 * Checks if the sequence contains only valid amino acid codes.
 */
export const validateProteinSequence = (sequence: string): boolean => {
	// Valid one letter amino acid codes
	const validAminoAcids = new Set([
		"A",
		"R",
		"N",
		"D",
		"C",
		"Q",
		"E",
		"G",
		"H",
		"I",
		"L",
		"K",
		"M",
		"F",
		"P",
		"S",
		"T",
		"W",
		"Y",
		"V",
	]);

	const upperSequence = sequence.toUpperCase().replace(/\s/g, "");

	return [...upperSequence].every((char) => validAminoAcids.has(char));
};

/**
 * Validate a protein identifier.
 * Simple validation for common identifier formats (UniProt, PDB).
 */
export const validateProteinIdentifier = (identifier: string): boolean => {
	// UniProt format: [A-Z][0-9][A-Z0-9]{3}[0-9]
	// PDB format: [0-9][A-Z0-9]{3}
	const uniprotRegex = /^[A-Z][0-9][A-Z0-9]{3}[0-9]$/;
	const pdbRegex = /^[0-9][A-Z0-9]{3}$/;

	return uniprotRegex.test(identifier) || pdbRegex.test(identifier);
};
