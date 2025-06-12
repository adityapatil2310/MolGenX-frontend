import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="container mx-auto py-6 px-4 z-10">
      <div className="flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <img 
              src="/molgenX-logo.png" 
              alt="MolGenX Logo" 
              className="w-10 h-10 object-contain" 
            />
          </div>
          <h1 className="text-xl font-medium">MolGenX</h1>
        </motion.div>
        
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ul className="flex gap-6">
            <li className={`text-sm font-medium transition-colors duration-200 ${isActive('/') ? 'text-primary' : 'hover:text-primary'}`}>
              <Link to="/">Home</Link>
            </li>
            <li className={`text-sm font-medium transition-colors duration-200 ${isActive('/protein-search') ? 'text-primary' : 'hover:text-primary'}`}>
              <Link to="/protein-search">Protein Search</Link>
            </li>
            <li className={`text-sm font-medium transition-colors duration-200 ${isActive('/about') ? 'text-primary' : 'hover:text-primary'}`}>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </motion.nav>
      </div>
    </header>
  );
};

export default Header;