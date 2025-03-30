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
import { Download, ExternalLink, Info, Filter } from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import LoadingIndicator from "@/components/ui-elements/LoadingIndicator";
import { type Compound } from "@/pages/ProteinSearch";
import './CompoundResutls.css';

interface CompoundResultsProps {
	compounds: Compound[];
	isLoading: boolean;
}

const CompoundResults: React.FC<CompoundResultsProps> = ({
	compounds,
	isLoading,
}) => {
	const hasResults = compounds.length > 0;
  const [displayedCompounds, setDisplayedCompounds] = useState(compounds);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minLikeliness: 0,
    maxToxicity: 10,
    minBindingAffinity: 0,
    sortBy: "likeliness-desc" as "likeliness-desc" | "likeliness-asc" | "toxicity-asc" | "toxicity-desc" | "binding-desc" | "binding-asc"
  });

  // Update displayed compounds when filters change
  useEffect(() => {
    if (!compounds.length) return;
    
    let filtered = [...compounds].filter(compound => 
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
      case "binding-desc": // Add sort options for binding affinity
      filtered.sort((a, b) => b.binding_affinity - a.binding_affinity);
      break;
      case "binding-asc":
        filtered.sort((a, b) => a.binding_affinity - b.binding_affinity);
        break;
    }
    
    setDisplayedCompounds(filtered);
  }, [compounds, filters]);

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

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-24">
				<LoadingIndicator message="Searching for compatible compounds..." />
			</div>
		);
	}

	if (!hasResults && !isLoading) {
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
					Compatible Compounds
				</h2>
				<p className="text-muted-foreground">
          {displayedCompounds.length === compounds.length 
            ? `We found ${compounds.length} compounds with potential binding affinity.`
            : `Showing ${displayedCompounds.length} of ${compounds.length} compounds.`
          }
        </p>
			</div>

      <div className="mb-8">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 mb-4"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <Filter className="h-4 w-4" />
          <span>Filter Compounds</span>
        </Button>

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-card border rounded-md p-4 overflow-hidden shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Drug Likeliness</label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      value={[filters.minLikeliness]} 
                      min={0} 
                      max={10} 
                      step={0.1}
                      onValueChange={(value) => setFilters({...filters, minLikeliness: value[0]})}
                    />
                    <span className="text-sm font-medium w-12 text-right">{filters.minLikeliness.toFixed(1)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Toxicity</label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      value={[filters.maxToxicity]} 
                      min={0} 
                      max={10} 
                      step={0.1}
                      onValueChange={(value) => setFilters({...filters, maxToxicity: value[0]})}
                    />
                    <span className="text-sm font-medium w-12 text-right">{filters.maxToxicity.toFixed(1)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Binding Affinity</label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      value={[filters.minBindingAffinity]} 
                      min={0} 
                      max={10} 
                      step={0.1}
                      onValueChange={(value) => setFilters({...filters, minBindingAffinity: value[0]})}
                    />
                    <span className="text-sm font-medium w-12 text-right">{filters.minBindingAffinity.toFixed(1)}</span>
                  </div>
                </div>  

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select 
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters({
                      ...filters, 
                      sortBy: value as "likeliness-desc" | "likeliness-asc" | "toxicity-asc" | "toxicity-desc"
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="likeliness-desc">Highest Drug Likeliness</SelectItem>
                      <SelectItem value="likeliness-asc">Lowest Drug Likeliness</SelectItem>
                      <SelectItem value="toxicity-asc">Lowest Toxicity</SelectItem>
                      <SelectItem value="toxicity-desc">Highest Toxicity</SelectItem>
                      <SelectItem value="binding-desc">Highest Binding Affinity</SelectItem>
                      <SelectItem value="binding-asc">Lowest Binding Affinity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {compounds.map((compound) => (
          <motion.div key={compound.id} variants={item}>
            <CompoundCard compound={compound} />
          </motion.div>
        ))}
      </motion.div>
		</motion.div>
	);
};

const CompoundCard: React.FC<{ compound: Compound }> = ({ compound }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={`card-container ${isFlipped ? 'flipped' : ''}`}>
      <Card className="card-front overflow-hidden transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">
                {compound.name}
              </CardTitle>
              <CardDescription>{compound.formula}</CardDescription>
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
                    <span className="text-xs">Download</span>
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
              <CardTitle className="text-lg">
                {compound.name} - Details
              </CardTitle>
              <CardDescription>{compound.formula}</CardDescription>
            </div>
            <div className="rounded-full bg-primary/10 text-primary px-2 py-1 text-xs font-semibold">
              Drug Likeliness: {compound.likeliness.toFixed(2)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow pb-2">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Compound Properties</h3>
            <ul className="list-none space-y-1 text-sm">
              <li>
                <span>Drug Likeliness:</span>
                <span className="font-medium">{compound.likeliness.toFixed(2)}</span>
              </li>
              <li>
                <span>Synthetic Accessibility:</span>
                <span className="font-medium">10.0</span>
              </li>
              <li>
                <span>Lipinski Violations:</span>
                <span className="font-medium">4</span>
              </li>
              <li>
                <span>Toxicity:</span>
                <span className="font-medium">{compound.toxicity.toFixed(2)}</span>
              </li>
              <li>
                <span>Binding Affinity:</span>
                <span className="font-medium">0.0</span>
              </li>
              <li>
                <span>Solubility:</span>
                <span className="font-medium">-5.0</span>
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
