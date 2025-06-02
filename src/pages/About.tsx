import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Beaker, Brain, Zap, Target, FlaskConical, 
  ChartBar, Database, Cpu, Github, ExternalLink 
} from 'lucide-react';


const Footer = () => {
  return (
    <footer className="py-6 bg-gradient-to-r from-slate-100 to-blue-50 border-t border-gray-200">
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
  );
};

const About = () => {
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

  const technologies = [
    { name: "Python/JavaScript", category: "Programming Language" },
    { name: "React/Flask", category: "Frameworks" },
    { name: "RDKit", category: "Molecular Processing" },
    { name: "PyTorch", category: "Deep Learning Frameworks" },
    { name: "MolGPT/MolFormer/Diffdock/Gemini/RCSB-PDB", category: "APIs" },
    { name: "IDX/Render", category: "Hosting" },
    { name: "Pandas/NumPy", category: "Data Processing" }
  ];

  const improvements = [
    "Enhanced Molecular Generation: Fine-tune MolGPT and MolFormer for improved drug-likeness, toxicity, ADMET and protein binding",
    "Target-Specific Molecule Design: Modify RNNs to generate molecules optimized for specific proteins using protein embeddings as conditions",
    "Integrative GANs for Diverse Molecule: implement GANs to refine active compounds",
    "Enhanced Active Learning Pipeline: Implement uncertainty sampling with diversity measures, multi-objective Pareto optimization to significantly improve candidate success rates",
    "Real-World Dataset Integration: Leverage the ZINC dataset with over 6 million commercially available compounds to train models, enhancing chemical diversity and real-world applicability"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Common Header - Updated with logo */}
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
          

      {/* Hero Section - with animations */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden text-black py-20"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2523ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-center justify-center mb-6"
            >
                <img 
                src="/molgenX-logo.png" 
                alt="MolGenX Logo" 
                className="w-16 h-16 mr-4 object-contain" 
              />
              <h1 className="text-5xl font-bold">MolGenX</h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-xl mb-8 text- transition-colors"
            >
              Your End-to-End AI Drug Discovery Companion
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg leading-relaxed max-w-3xl mx-auto"
            >
              Revolutionizing pharmaceutical research through advanced AI algorithms, 
              comprehensive molecular analysis, and intelligent optimization strategies.
            </motion.p>
          </div>
        </div>
      </motion.section>

        {/* Problem & Solution - with animations */}
        <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="py-16"
        >
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex"
            >
                <Card className="border-l-4 border-l-red-500 flex-1 flex flex-col h-full">
                <CardHeader>
                    <CardTitle className="text-2xl text-red-700">Problem at Hand</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                    <p className="font-semibold">Conventional drug discovery is:</p>
                    <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Time-consuming</strong> and <strong>expensive</strong></li>
                    <li>• Average drug takes <strong>10-15 years</strong> and <strong>$2.6 billion</strong> to reach market</li>
                    <li>• <strong>Inefficient</strong> with high failure rates</li>
                    <li>• Over <strong>90%</strong> of drug candidates fail in clinical trials</li>
                    </ul>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg mt-auto">
                    <p className="text-sm font-medium">Due to:</p>
                    <ul className="text-sm text-gray-600 mt-2">
                        <li>• Complex biological interactions</li>
                        <li>• Molecular interactions are highly nonlinear and context-specific</li>
                        <li>• Vast chemical space (10⁶⁰)</li>
                    </ul>
                    </div>
                </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex"
            >
                <Card className="border-l-4 border-l-teal-500 flex-1 flex flex-col h-full">
                <CardHeader>
                    <CardTitle className="text-2xl text-teal-700">How MolGenX Helps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                    <p className="font-semibold">Our comprehensive Generative AI drug discovery platform addresses these issues:</p>
                    <div className="space-y-4 flex-1">
                    <div>
                        <h4 className="font-semibold text-blue-700">RNN-based Molecule Generation</h4>
                        <p className="text-sm text-gray-600">A recurrent neural network that generates diverse, valid molecular structures from scratch using SMILES notation.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-700">Multi-objective Optimization Engine</h4>
                        <p className="text-sm text-gray-600">Adapts optimization goals based on target protein class using parameters like druglikeness, synthetic accessibility, and binding affinity.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-700">Smart Molecular Modification</h4>
                        <p className="text-sm text-gray-600">Employs MolGPT and targeted strategies to evolve candidate molecules through functional group changes and structural rearrangements.</p>
                    </div>
                    </div>
                </CardContent>
                </Card>
            </motion.div>
            </div>
        </div>
        </motion.section>
       
                    
            

      {/* Key Features - with animations */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="py-16 bg-gradient-to-r from-blue-50 to-teal-50"
      >
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Features of the Solution</h2>
            <p className="text-lg text-gray-600">Explore the innovative features enhancing drug discovery</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
                <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                >
                <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur h-64 flex flex-col">
                    <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-center mb-4">
                        <div className="p-3 bg-teal-100 rounded-lg mr-4 text-teal-600">
                        {feature.icon}
                        </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 text-sm flex-grow">{feature.description}</p>
                    </CardContent>
                </Card>
                </motion.div>
            ))}
            </div>
        </div>
      </motion.section>

      {/* Process Flow - with animations */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="py-16"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Process Flow</h2>
            <p className="text-lg text-gray-600">Step-by-step journey through MolGenX</p>
          </motion.div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {processSteps.map((step, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 * (index + 1) }}
                  className="flex items-start mb-8 last:mb-0"
                >
                  <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-lg mr-6 flex-shrink-0`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Links Section - with animations */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="py-16"
      >
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Project Links</h2>
          </motion.div>
          <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Github className="w-6 h-6 mr-3 text-gray-600" />
                  <h3 className="text-lg font-semibold">GitHub Repositories</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>Backend: <a href="https://github.com/https-kanika/molgenx-backend" className="text-blue-600 hover:underline">https://github.com/https-kanika/molgenx-backend</a></p>
                  <p>Frontend: <a href="https://github.com/adityapatil2310/molgenx-frontend" className="text-blue-600 hover:underline">https://github.com/adityapatil2310/molgenx-frontend</a></p>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Card className="p-6">
                <div className="flex items-center mb-4">
                  <ExternalLink className="w-6 h-6 mr-3 text-gray-600" />
                  <h3 className="text-lg font-semibold">Demo & MVP</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>Demo Video: <a href="https://drive.google.com/drive/folders/14kuvroe310znlzt9txlynwtyogwwrihj?usp=sharing" className="text-blue-600 hover:underline">Google Drive Link</a></p>
                  <p>MVP: <a href="https://molgenx-frontend.pages.dev" className="text-blue-600 hover:underline">https://molgenx-frontend.pages.dev</a></p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="p-4 bg-yellow-50 border-yellow-200">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Due to the large size and resource requirements of our model, we are currently unable to keep it 
                  continuously deployed online, as hosting such a service exceeds our available budget. However, the GitHub 
                  repository includes detailed setup instructions, and the demo video showcases the working MVP.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

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

export default About;