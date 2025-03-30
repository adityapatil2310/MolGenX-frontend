
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchButton from "@/components/ui-elements/SearchButton";
import { AlertCircle } from "lucide-react";

interface ProteinInputProps {
  onSearch: (sequence: string) => void;
  isSearching: boolean;
  error: string | null;
  setProteinSequence: (sequence: string) => void;
}

const ProteinInput: React.FC<ProteinInputProps> = ({
  onSearch,
  isSearching,
  error,
  setProteinSequence,
}) => {
  const [sequence, setSequence] = useState<string>("");

  const handleInputChange = (value: string) => {
      setSequence(value);
      setProteinSequence(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = sequence;
    onSearch(value);
  };
  const exampleSequence = "MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR";

  const handleExampleClick = (example: string) => {
      setSequence(example);
      setProteinSequence(example);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <p className="text-lg font-semibold">Protein Sequence</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Enter Amino Acid Sequence
            </label>
            <Textarea
              value={sequence}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter protein sequence using one-letter amino acid codes..."
              className="min-h-[180px] bg-white/50 dark:bg-black/20 resize-none transition-all duration-200 focus:ring-2 focus:ring-offset-0 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-2">Example:</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleExampleClick(exampleSequence)}
              className="text-xs bg-background/80 hover:bg-background"
            >
              Human Hemoglobin
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <SearchButton
            isSearching={isSearching}
            onClick={handleSubmit}
            className="w-full"
          />
        </div>
      </form>
    </motion.div>
  );
};

export default ProteinInput;
