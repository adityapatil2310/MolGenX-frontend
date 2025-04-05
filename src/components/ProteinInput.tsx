import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ProteinInputProps {
	value: string;
	onChange: (value: string) => void;
	onExampleClick: () => void;
	disabled?: boolean;
}

const ProteinInput: React.FC<ProteinInputProps> = ({
	value,
	onChange,
	onExampleClick,
	disabled = false,
}) => {
	// Validation for PDB ID format (typically 4 alphanumeric characters)
	const isPdbIdValid = (input: string) => {
		// Basic PDB ID validation - typically 4 characters, alphanumeric
		const pdbIdRegex = /^[A-Za-z0-9]{4}$/;
		return pdbIdRegex.test(input.trim());
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		// Convert to uppercase as PDB IDs are conventionally uppercase
		const input = e.target.value.toUpperCase();
		// Limit to alphanumeric characters and maximum 4 characters
		const sanitizedInput = input.replace(/[^A-Z0-9]/g, "").substring(0, 4);
		onChange(sanitizedInput);
	};

	return (
		<div className="space-y-2">
			<label className="text-sm font-medium">Enter PDB ID</label>
			<Textarea
				placeholder="Enter 4-character PDB ID (e.g., 1HHO)"
				value={value}
				onChange={handleChange}
				className="h-20 font-mono text-center text-lg"
				disabled={disabled}
				maxLength={4}
			/>
			<div className="flex items-center justify-between">
				<p className="text-xs text-muted-foreground">
					Enter a valid 4-character PDB ID to find optimized
					compounds.
					{!isPdbIdValid(value) && value.length > 0 && (
						<span className="text-red-500 ml-1">
							Please enter a valid 4-character PDB ID.
						</span>
					)}
				</p>
				<Button
					variant="outline"
					size="sm"
					onClick={onExampleClick}
					className="text-xs"
					disabled={disabled}
				>
					Try Human Haemoglobin (1HHO)
				</Button>
			</div>
		</div>
	);
};

export default ProteinInput;
