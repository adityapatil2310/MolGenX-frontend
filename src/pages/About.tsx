import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from "framer-motion";
import { Separator } from '@/components/ui/separator';
import Header from "../components/Header";
import { Brain, Zap, Target, FlaskConical, ChartBar, Database, Cpu, Github, ExternalLink, CheckCircle } from 'lucide-react';

const About = () => {
  

  const features = [
    {
      title: "Conditional RNN-Based Molecular Generation",
      description: "Leverages our custom-trained conditional RNN model for generating a diverse range of molecules specific to the target",
      color: "bg-blue-600"
    },
    {
      title: "Candidate Modification for Enhanced Diversity",
      description: "Applies targeted structural modifications to top candidates via various strategies to further expand chemical diversity",
      color: "bg-teal-600"
    },
    {
      title: "Protein Structure Analysis",
      description: "Predicts essential properties like Lipinski's Rule compliance, QED score, and toxicity",
      color: "bg-purple-400"
    },
    {
      title: "Interactive 3D Visualization",
      description: "Web-based viewer for exploring molecular and protein structures in real time",
      color: "bg-green-500"
    },
    {
      title: "Advanced Toxicity Prediction",
      description: "Predict toxicity with precision using structural alerts, PAINS patterns, and embedding features from MolFormer",
      color: "bg-orange-500"
    },
    {
      title: "Adaptive Property Optimization",
      description: "Fine-tune molecular design with customizable weights across key properties—druglikeness, binding affinity, toxicity, solubility, and more. Optimize for pharmaceutical viability, target specificity, safety, bioavailability, manufacturability, and Lipinski compliance",
      color: "bg-cyan-500"
    },
    {
      title: "Export & API Integration",
      description: "Enables structured data export for further research and validation, with flexible integration for seamless expansion",
      color: "bg-indigo-500"
    },
    {
      title: "Detailed Interpretation",
      description: "Uses the Gemini API to explain optimized predictions for easy result interpretation and further steps for testing",
      color: "bg-pink-500"
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
      description: "User enters the PDB ID (protein data bank), the number of molecules to generate and the target binding affinity (IC50)",
      color: "bg-blue-500"
    },
    {
      title: "Select Optimization Weights",
      description: "Based on what properties you want to give more weightage on, select the weights or use a preset",
      color: "bg-teal-600"
    },
    {
      title: "Get Ranked Optimized Molecules",
      description: "Display of the most promising candidates for further research, along with its predicted properties and 3D structure",
      color: "bg-teal-400"
    },
    {
      title: "Further Steps for Testing",
      description: "Upon clicking on a molecule get comprehensive steps for further lab testing and research",
      color: "bg-purple-400"
    }
  ];

  const rnnFeatures = [
    {
      title: "Bidirectional Protein Encoding",
      description: "Reads the protein sequence from both ends to understand how far-apart amino acids may still affect each other as they maybe close in final 3D form"
    },
    {
      title: "Attention Mechanism",
      description: "Dynamically weights protein sequence tokens based on importance, achieving 15-20% improvement in molecule validity"
    },
    {
      title: "Temperature Sampling",
      description: "Controls randomness during generation (T=0.7 default, increased by 0.2 each attempt)"
    },
    {
      title: "Auto-regressive SMILES Generation",
      description: "Generates molecules character-by-character using protein context and binding affinity control, enabling precise tuning of molecule strength and diversity"
    }
  ];

  const technologies = [
    { name: "Python/JavaScript", category: "Programming Language", color: "bg-blue-800" },
    { name: "React/Flask", category: "Frameworks", color: "bg-blue-700" },
    { name: "RDKit", category: "Molecular Processing", color: "bg-teal-700" },
    { name: "PyTorch/Scikit-Learn", category: "Deep Learning Frameworks", color: "bg-teal-600" },
    { name: "MolGPT/MolFormer/Gemini/RCSB-PDB", category: "APIs", color: "bg-blue-500" },
    { name: "IDX/Google Cloud Platform", category: "Hosting and Model Training", color: "bg-teal-500" },
    { name: "BindingDB/ZINC", category: "Databases for training", color: "bg-blue-400" },
    { name: "Pandas/NumPy", category: "Data Processing", color: "bg-purple-400" }
  ];

  const performanceMetrics = [
    { metric: "100%", description: "valid & unique molecules across diverse proteins" },
    { metric: "550K", description: "protein-molecule pairs training data (BindingDB)" },
    { metric: "~6 hours", description: "training time (NVIDIA L4)" },
    { metric: "12.5M", description: "parameters in our custom RNN model" },
    { metric: "15-20%", description: "improvement in molecule validity with attention mechanism" }
  ];

  return (
    
    <div className="min-h-screen">
      <Header />    
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2523ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"
        ></motion.div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center justify-center mb-6"
            >
              <motion.img 
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                src="/molgenX-logo.png" 
                alt="MolGenX Logo" 
                className="w-16 h-16 mr-4"
              />
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-5xl font-bold"
              >
                MolGenX
              </motion.h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-xl mb-8"
            >
              Your End-to-End AI Drug Discovery Companion
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="text-lg leading-relaxed max-w-3xl mx-auto"
            >
              Empowering researchers to go from protein to potential drug in days—not months. 
              Revolutionizing pharmaceutical research through advanced AI algorithms and intelligent optimization.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features of the Solution */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Features of the Solution</h2>
            <p className="text-lg text-gray-600">
              MolGenX is a modular, scalable platform that seamlessly integrates into existing drug discovery workflows — enabling 
              faster, smarter, and more cost-effective research.
            </p>
          </motion.div>
          
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="h-full"
              >
                <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                  <CardContent className="p-6 flex flex-col">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 text-sm mt-auto">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Process Flow */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Process Flow Diagram</h2>
            <p className="text-lg text-gray-600">Step-by-step journey through MolGenX</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {processSteps.map((step, index) => (
                <div key={index} className="flex items-start mb-8 last:mb-0">
                  <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-lg mr-6 flex-shrink-0`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Performance Report */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-teal-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Prototype Performance Report/Benchmarking</h2>
          </div>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-bold text-2xl text-teal-600">{metric.metric}</span>
                      <span className="text-sm text-gray-600 text-right flex-1 ml-4">{metric.description}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                      <span className="text-sm">100% valid & unique molecules across diverse proteins</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                      <span className="text-sm">Realistic physical properties (Molecular Weight, LogP)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                      <span className="text-sm">Strong chemical diversity, protein-specific generation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                      <span className="text-sm">QED and Lipinski metrics indicate optimization scope</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-2">Model Details:</p>
                    <ul className="space-y-1 text-xs">
                      <li><strong>LogP:</strong> A measure of a molecule's lipophilicity, influencing its absorption and permeability</li>
                      <li><strong>QED Score:</strong> A quantitative estimate of drug-likeness, combining multiple chemical properties into a single score</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600">
                    Trained on a limited 550K sample set, the model already shows strong generation quality and provides a solid base for scaling. 
                    We aim to enhance the architecture and integrate QED/Lipinski filters to generate more drug-like, clinically viable molecules.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Links Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Project Links</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
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
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <ExternalLink className="w-6 h-6 mr-3 text-gray-600" />
                <h3 className="text-lg font-semibold">Demo & MVP</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p>Demo Video: <a href="https://drive.google.com/file/d/14ZjVdkOlLCngCPBnRdwyZ_69C7kztQIs/view?usp=sharing" className="text-blue-600 hover:underline">Google Drive Link</a></p>
                <p>MVP: <a href="https://gdg-25-ee7f1.web.app" className="text-blue-600 hover:underline">https://gdg-25-ee7f1.web.app</a></p>
              </div>
            </Card>
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

export default About;
