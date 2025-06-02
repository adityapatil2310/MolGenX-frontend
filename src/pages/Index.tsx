
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Database, Beaker, Search } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-compound-light/30 blur-3xl" />
      </div>

      {/* Header/Nav */}
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
                    <li className="text-sm font-medium hover:text-primary transition-colors duration-200">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="text-sm font-medium hover:text-primary transition-colors duration-200">
                      <Link to="/protein-search">Protein Search</Link>
                    </li>
                    <li className="text-sm font-medium hover:text-primary transition-colors duration-200">
                      <Link to="/about">About</Link>
                    </li>
                  </ul>
                </motion.nav>
              </div>
            </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Discover Novel Compounds with AI-Powered Precision
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our platform combines structural biology, machine learning, and molecular dynamics 
              to identify compounds with high binding affinity for your protein targets.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/protein-search"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <footer className="py-6">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center"
          >
            <p className="text-sm text-gray-600">
              Made with <span className="text-red-500">❤</span> by Cloud Catalyst
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
