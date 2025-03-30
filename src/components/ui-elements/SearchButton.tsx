
import React from "react";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchButtonProps {
  isSearching: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

const SearchButton: React.FC<SearchButtonProps> = ({
  isSearching,
  onClick,
  className,
}) => {
  return (
    <Button
      type="submit"
      onClick={onClick}
      disabled={isSearching}
      className={cn(
        "relative overflow-hidden group transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center justify-center gap-2">
        {isSearching ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
            <span>Searching...</span>
          </>
        ) : (
          <>
            <SearchIcon className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-300" />
            <span>Search Compatible Compounds</span>
          </>
        )}
      </div>
      
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isSearching ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-0 left-0 h-0.5 bg-white/50 origin-left"
        style={{ width: "100%" }}
      />
    </Button>
  );
};

export default SearchButton;
