import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle,  } from '@/components/ui/card';

import { 
  FlaskConical, Brain, Zap, Target, ChartBar, Database, 
  CheckCircle, Dna, Scale, Shuffle, Network, Microscope,
  Workflow, BarChart3, PieChart, Beaker
} from 'lucide-react';

// Declare 3Dmol to avoid TypeScript errors
declare global {
  interface Window {
    $3Dmol: any;
  }
}

const Index = () => {
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasSetupResizeObserver = useRef(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  useEffect(() => {
    // Load 3Dmol.js script dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.0.1/3Dmol-min.js';
    script.async = true;
    
    script.onload = () => {
      // We'll initialize after the component has fully mounted
      requestAnimationFrame(() => {
        requestAnimationFrame(initializeMoleculeViewer);
      });
    };
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Separate function to set up the resize observer
  const setupResizeObserver = (container: HTMLDivElement, viewer: any) => {
    if (hasSetupResizeObserver.current) return;
    hasSetupResizeObserver.current = true;
    
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0 && viewer) {
        const { width, height } = entries[0].contentRect;
        viewer.resize(width, height);
        viewer.render();
      }
    });
    
    resizeObserver.observe(container);
    
    // Clean up the observer when component unmounts
    return () => {
      resizeObserver.disconnect();
    };
  };
  
  const initializeMoleculeViewer = () => {
    if (!viewerContainerRef.current || !window.$3Dmol) return;
    
    try {
      const container = viewerContainerRef.current;
      
      // Remove any existing canvas from previous renders
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      // Force a layout reflow to get accurate sizes
      const { width, height } = container.getBoundingClientRect();
      
      // Create viewer with explicit width and height
      const viewer = window.$3Dmol.createViewer(container, {
        backgroundColor: "transparent",
        id: "molViewer",
        width: width,
        height: height
      });
      // Store viewer reference
      viewerRef.current = viewer;
      
      // Set up resize observer for continuous size monitoring
      setupResizeObserver(container, viewer);

        
      const pdbData = `HETATM    1  C1  UNL     1       0.841  -1.765  -0.442  1.00  0.00           C  
HETATM    2  C2  UNL     1       1.366  -0.347  -0.149  1.00  0.00           C  
HETATM    3  C3  UNL     1       0.901   0.103   1.248  1.00  0.00           C  
HETATM    4  C4  UNL     1       0.863   0.642  -1.239  1.00  0.00           C  
HETATM    5  N1  UNL     1      -0.583   0.737  -1.368  1.00  0.00           N  
HETATM    6  C5  UNL     1      -1.317   1.692  -0.721  1.00  0.00           C  
HETATM    7  O1  UNL     1      -0.801   2.467   0.079  1.00  0.00           O  
HETATM    8  N2  UNL     1      -2.672   1.719  -1.020  1.00  0.00           N  
HETATM    9  C6  UNL     1      -3.502   2.649  -0.263  1.00  0.00           C  
HETATM   10  C7  UNL     1      -3.817   2.163   1.151  1.00  0.00           C  
HETATM   11  C8  UNL     1      -5.047   1.266   1.248  1.00  0.00           C  
HETATM   12  C9  UNL     1      -4.874  -0.168   0.754  1.00  0.00           C  
HETATM   13  C10 UNL     1      -5.080  -0.382  -0.749  1.00  0.00           C  
HETATM   14  C11 UNL     1      -3.797  -0.428  -1.582  1.00  0.00           C  
HETATM   15  C12 UNL     1      -3.329   0.941  -2.062  1.00  0.00           C  
HETATM   16  C13 UNL     1       2.917  -0.360  -0.224  1.00  0.00           C  
HETATM   17  O2  UNL     1       3.508   0.233  -1.123  1.00  0.00           O  
HETATM   18  N3  UNL     1       3.537  -1.121   0.758  1.00  0.00           N  
HETATM   19  C14 UNL     1       4.922  -1.287   0.974  1.00  0.00           C  
HETATM   20  C15 UNL     1       5.917  -0.671   0.209  1.00  0.00           C  
HETATM   21  C16 UNL     1       7.270  -0.872   0.501  1.00  0.00           C  
HETATM   22  C17 UNL     1       7.635  -1.684   1.570  1.00  0.00           C  
HETATM   23 BR1  UNL     1       9.463  -1.951   1.976  1.00  0.00          BR  
HETATM   24  C18 UNL     1       6.658  -2.314   2.335  1.00  0.00           C  
HETATM   25  C19 UNL     1       5.307  -2.113   2.039  1.00  0.00           C  
HETATM   26  H1  UNL     1      -0.257  -1.796  -0.447  1.00  0.00           H  
HETATM   27  H2  UNL     1       1.185  -2.491   0.305  1.00  0.00           H  
HETATM   28  H3  UNL     1       1.192  -2.115  -1.419  1.00  0.00           H  
HETATM   29  H4  UNL     1      -0.188   0.119   1.325  1.00  0.00           H  
HETATM   30  H5  UNL     1       1.251  -0.566   2.036  1.00  0.00           H  
HETATM   31  H6  UNL     1       1.278   1.102   1.485  1.00  0.00           H  
HETATM   32  H7  UNL     1       1.265   1.647  -1.057  1.00  0.00           H  
HETATM   33  H8  UNL     1       1.224   0.328  -2.228  1.00  0.00           H  
HETATM   34  H9  UNL     1      -1.044   0.053  -1.940  1.00  0.00           H  
HETATM   35  H10 UNL     1      -2.956   3.596  -0.195  1.00  0.00           H  
HETATM   36  H11 UNL     1      -4.421   2.873  -0.815  1.00  0.00           H  
HETATM   37  H12 UNL     1      -2.957   1.669   1.612  1.00  0.00           H  
HETATM   38  H13 UNL     1      -4.026   3.054   1.758  1.00  0.00           H  
HETATM   39  H14 UNL     1      -5.907   1.741   0.755  1.00  0.00           H  
HETATM   40  H15 UNL     1      -5.308   1.209   2.316  1.00  0.00           H  
HETATM   41  H16 UNL     1      -3.923  -0.596   1.097  1.00  0.00           H  
HETATM   42  H17 UNL     1      -5.661  -0.751   1.250  1.00  0.00           H  
HETATM   43  H18 UNL     1      -5.565  -1.358  -0.872  1.00  0.00           H  
HETATM   44  H19 UNL     1      -5.784   0.351  -1.158  1.00  0.00           H  
HETATM   45  H20 UNL     1      -3.004  -0.956  -1.040  1.00  0.00           H  
HETATM   46  H21 UNL     1      -4.015  -1.027  -2.476  1.00  0.00           H  
HETATM   47  H22 UNL     1      -4.168   1.514  -2.473  1.00  0.00           H  
HETATM   48  H23 UNL     1      -2.631   0.816  -2.899  1.00  0.00           H  
HETATM   49  H24 UNL     1       2.935  -1.618   1.403  1.00  0.00           H  
HETATM   50  H25 UNL     1       5.679  -0.010  -0.618  1.00  0.00           H  
HETATM   51  H26 UNL     1       8.021  -0.370  -0.099  1.00  0.00           H  
HETATM   52  H27 UNL     1       6.933  -2.961   3.160  1.00  0.00           H  
HETATM   53  H28 UNL     1       4.563  -2.607   2.657  1.00  0.00           H  
CONECT    1    2   26   27   28
CONECT    2    3    4   16
CONECT    3   29   30   31
CONECT    4    5   32   33
CONECT    5    6   34
CONECT    6    7    7    8
CONECT    8    9   15
CONECT    9   10   35   36
CONECT   10   11   37   38
CONECT   11   12   39   40
CONECT   12   13   41   42
CONECT   13   14   43   44
CONECT   14   15   45   46
CONECT   15   47   48
CONECT   16   17   17   18
CONECT   18   19   49
CONECT   19   20   20   25
CONECT   20   21   50
CONECT   21   22   22   51
CONECT   22   23   24
CONECT   24   25   25   52
CONECT   25   53
END`;

      viewer.addModel(pdbData, "pdb");
      viewer.setStyle({}, {"stick": {"radius": 0.2, "colorscheme": "cyanCarbon"}});
      viewer.addStyle({"atom": "C"}, {"sphere": {"radius": 0.4, "color": "cyan"}});
      viewer.addStyle({"atom": "O"}, {"sphere": {"radius": 0.4, "color": "red"}});
      viewer.addStyle({"atom": "N"}, {"sphere": {"radius": 0.4, "color": "blue"}});
      viewer.addStyle({"atom": "S"}, {"sphere": {"radius": 0.4, "color": "yellow"}});
      viewer.addStyle({"atom": "Cl"}, {"sphere": {"radius": 0.4, "color": "green"}});
      viewer.addStyle({"atom": "BR"}, {"sphere": {"radius": 0.6, "color": "#7b3f00"}});
      viewer.setBackgroundColor("transparent");
      viewer.setViewStyle({style: "outline"});
      viewer.zoomTo();
      viewer.rotate(40, "y");
      viewer.rotate(20, "x");
      viewer.render();
        
      // Force a resize after rendering to ensure proper dimensions
      viewer.resize(width, height);
      viewer.render();

      // Add animation to rotate the molecule
      let spin = false;
      container.addEventListener('mouseover', () => { spin = true; animate(); });
      container.addEventListener('mouseout', () => { spin = false; });
        
      function animate() {
        if (spin) {
          viewer.rotate(1, "y");
          viewer.render();
          requestAnimationFrame(animate);
        }
      }
      
      // Mark loading as complete
      setIsLoading(false);
      
      // Double check sizing after animations complete
      setTimeout(() => {
        if (viewerRef.current && container) {
          const { width, height } = container.getBoundingClientRect();
          viewerRef.current.resize(width, height);
          viewerRef.current.render();
        }
      }, 1000);
    } catch (error) {
      console.error("Error initializing molecule viewer:", error);
      setIsLoading(false);
    }
  };

  // Use useLayoutEffect to handle window resize events
  useLayoutEffect(() => {
    const handleResize = () => {
      if (viewerRef.current && viewerContainerRef.current) {
        const container = viewerContainerRef.current;
        const { width, height } = container.getBoundingClientRect();
        viewerRef.current.resize(width, height);
        viewerRef.current.render();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Also listen for load event to catch any post-load sizing issues
    window.addEventListener('load', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleResize);
    };
  }, []);

  const uniqueSellingPoints = [
      {
        icon: <Dna className="w-8 h-8" />,
        title: "Protein-Conditional Molecule Generation",
        description: "Goes beyond traditional virtual screening by using a conditional RNN to generate novel molecules tailored to specific protein targets—no library limitations"
      },
      {
        icon: <Scale className="w-8 h-8" />,
        title: "Balanced Property Optimization",
        description: "The system doesn't just optimize for binding affinity but considers the full spectrum of drug-like properties using a customizable weighting system"
      },
      {
        icon: <Shuffle className="w-8 h-8" />,
        title: "Dynamic Molecular Variant Generation",
        description: "Strategically generates variants of promising candidates to expand chemical space intelligently—far beyond random sampling"
      },
      {
        icon: <ChartBar className="w-8 h-8" />,
        title: "Visualization and Explanation Tools",
        description: "Delivers 2D/3D visualizations of optimized drug candidates, with intuitive result explanations powered by Gemini, and clear guidance on next steps"
      },
      {
        icon: <Workflow className="w-8 h-8" />,
        title: "End-to-End AI Pipeline",
        description: "Covers everything from molecule generation to optimization and validation"
      },
      {
        icon: <BarChart3 className="w-8 h-8" />,
        title: "Optimized Score",
        description: "A unified score that balances drug-likeness, binding strength, toxicity, synthesis ease, solubility, and Lipinski compliance to rank the best drug candidates"
      }
  ];

  const impactMetrics = [
    {
      icon: <Zap className="w-6 h-6" />,
      text: "Automates candidate generation and optimization to significantly reduce early stage design time by upto 60%"
    },
    {
      icon: <Target className="w-6 h-6" />,
      text: "Minimizes costly trial-and-error through comprehensive in-silico evaluations"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: "Prioritizes only top 5-10% most promising molecules for wet lab synthesis"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      text: "Reduces downstream clinical trial failure risk by ~30%"
    },
    {
      icon: <Database className="w-6 h-6" />,
      text: "Explores a broader chemical space by modifying top candidates for increased variety"
    }
  ];

  const features = [
    {
      icon: <FlaskConical className="w-8 h-8" />,  // Changed from Molecule to Flask
      title: "Molecular Property Prediction",
      description: "Predicts essential properties like Lipinski's Rule compliance, QED score, and toxicity"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "RNN-based Molecular Generation",
      description: "Leveraged our custom-trained RNN model for generating a diverse range of molecules"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Advanced Toxicity Prediction",
      description: "Predict toxicity with precision using structural alerts, PAINS patterns, and embedding features from MolFormer"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Adaptive Property Optimization",
      description: "Fine-tune molecular properties with a customizable weighting system for optimal drug design"
    },
    {
      icon: <FlaskConical className="w-8 h-8" />,
      title: "Protein Structure Analysis",
      description: "Predicts essential properties like Lipinski's Rule compliance, QED score, and toxicity"
    },
    {
      icon: <ChartBar className="w-8 h-8" />,
      title: "Interactive Visualisation",
      description: "Provides visualisation tools for chemical structures and interactions"
    }
  ];

  const processSteps = [
    {
      title: "Login",
      description: "User logins/signs up to the MolGenX website and gets redirected to our engine",
      color: "bg-blue-600"
    },
    {
      title: "Input target Protein",
      description: "User enters amino acid sequence of the target protein or PDB ID and its type (kinase inhibitor, CNS,etc.)",
      color: "bg-blue-500"
    },
    {
      title: "Select Filters",
      description: "Filter out potential drug candidates on the basis of range of druglikeness, toxicity and binding affinity",
      color: "bg-teal-500"
    },
    {
      title: "Get Ranked Optimized Molecules",
      description: "Display of the most promosing candidates for further research, along with its predicted properties and 3D structure",
      color: "bg-teal-400"
    },
    {
      title: "Further Steps for Testing",
      description: "Upon clicking on a molecule get comprehensive steps for further lab testing and research",
      color: "bg-purple-400"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-compound-light/30 blur-3xl" />
      </div>

      {/* Header/Nav with Active Page Highlighting */}
      <Header />         

      {/* Hero Section with 3D Viewer */}
      <main className="flex-grow flex items-center container mx-auto px-4 z-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
          
          {/* 3D Molecule Viewer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center"
            onAnimationComplete={() => {
              // Resize viewer after animation completes
              if (viewerRef.current && viewerContainerRef.current) {
                const container = viewerContainerRef.current;
                const { width, height } = container.getBoundingClientRect();
                viewerRef.current.resize(width, height);
                viewerRef.current.render();
              }
            }}
          >
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 w-full max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <Beaker className="w-5 h-5 text-primary" />
                <h3 className="font-medium">Example: Optimized Compound</h3>
              </div>
              
              {/* Container with fixed height */}
              <div className="w-full h-[350px] relative">
                {/* The viewer container needs to fill the parent completely */}
                <div 
                  ref={viewerContainerRef}
                  className="absolute inset-0 w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50"
                />

                {/* Loading overlay positioned absolutely */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 backdrop-blur-sm rounded-lg">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-10 w-10 text-primary animate-spin" />
                      <span className="mt-2 text-sm text-gray-600">Loading 3D model...</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-3 text-sm text-gray-600">
                <p className="font-medium">SMILES: CC(C)(CNC(=O)N1CCCCCCC1)C(=O)Nc1ccc(Br)cc1</p>
                <p className="mt-1 flex justify-between">
                  <span className="text-xs italic">Hover to rotate</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Problem & Solution Overview */}
<section className="py-16">
  <div className="container mx-auto px-6">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-2xl text-red-700">Problem at Hand</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-semibold">Conventional drug discovery is:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Time-consuming</strong> and <strong>expensive</strong></li>
              <li>• Average drug takes <strong>10-15 years</strong> and <strong>$2.6 billion</strong> to reach market</li>
              <li>• <strong>Inefficient</strong> with high failure rates</li>
              <li>• Over <strong>90%</strong> of drug candidates fail in clinical trials</li>
            </ul>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Due to:</p>
              <ul className="text-sm text-gray-600 mt-2">
                <li>• Complex biological interactions</li>
                <li>• Molecular interactions are highly nonlinear and context-specific</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader>
            <CardTitle className="text-2xl text-teal-700">How MolGenX Helps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-semibold">Our comprehensive Generative AI drug discovery platform addresses these issues:</p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 bg-teal-50 p-3 rounded-lg">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">vs</div>
                <div>
                  <p className="font-medium text-teal-800">MolGenX - Gen AI Platform</p>
                  <p className="text-sm text-gray-600">Targeted Search → Faster and Better Discovery</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              It intelligently <strong>balances key pharmaceutical properties</strong> like drug-likeness, 
              toxicity, and solubility.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {impactMetrics.map((metric, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                  className="flex items-start space-x-3"
                >
                  <div className="p-2 bg-teal-100 rounded-full text-teal-600 flex-shrink-0">
                    {metric.icon}
                  </div>
                  <p className="text-gray-700 text-sm">{metric.text}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  </div>
</section>          

{/* Why MolGenX is Effective */}
<section className="py-16 bg-gradient-to-r from-blue-50 to-teal-50">
  <div className="container mx-auto px-6">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Why are we a Game Changer in Drug Discovery?</h2>
      <p className="text-lg text-gray-600">You can use it even if don't have  ML or HPC expertise</p>
    </motion.div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
      {uniqueSellingPoints.map((point, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.2 + (index * 0.1), 
            ease: "easeOut" 
          }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur h-full">
            <CardContent className="p-6">
              <motion.div 
                initial={{ y: -5 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.5 + (index * 0.1),
                  ease: "easeOut"
                }}
                className="flex items-center mb-4"
              >
                <div className="p-3 bg-teal-100 rounded-lg mr-4 text-teal-600">
                  {point.icon}
                </div>
              </motion.div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">{point.title}</h3>
              <p className="text-gray-600 text-sm">{point.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
</section>
      
      {/* Footer */}
      <footer className="py-6">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center"
          >
            <p className="text-sm text-gray-600">
              Made with <span className="text-red-500">❤</span> by Cloud Catalysts
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Index;