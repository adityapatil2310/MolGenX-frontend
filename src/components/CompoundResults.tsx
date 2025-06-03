import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Compound, OptimizationResponse } from "@/pages/ProteinSearch";

interface CompoundResultsProps {
    compounds: Compound[];
    optimizationResponse: OptimizationResponse | null;
}

const CompoundResults: React.FC<CompoundResultsProps> = ({
    compounds,
    optimizationResponse,
}) => {
    const [selectedCompound, setSelectedCompound] = useState<Compound | null>(
        compounds.length > 0 ? compounds[0] : null
    );

    // Parse optimized variants to display them
    const variants = optimizationResponse?.optimized_variants || [];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-8 space-y-8"
        >
            <div className="flex flex-col gap-8">
                <h2 className="text-3xl font-bold tracking-tight">Results</h2>

                <Tabs defaultValue="compounds" className="w-full">
                    <TabsList>
                        <TabsTrigger value="compounds">
                            Primary Compounds ({compounds.length})
                        </TabsTrigger>
                        <TabsTrigger value="variants">
                            Variants ({variants.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="compounds" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Compound List */}
                            <div className="lg:col-span-1 overflow-auto max-h-[600px]">
                                <div className="grid gap-3">
                                    {compounds.map((compound) => (
                                        <Card
                                            key={compound.id}
                                            className={`cursor-pointer transition-all ${
                                                selectedCompound?.id === compound.id
                                                    ? "border-primary"
                                                    : ""
                                            }`}
                                            onClick={() => setSelectedCompound(compound)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-medium">
                                                            {compound.name}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {compound.formula}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            compound.id.startsWith("1")
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        #{compound.id}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Compound Details and Visualization */}
                            <div className="lg:col-span-2">
                                {selectedCompound && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Compound Properties */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Compound Properties</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                Name
                                                            </TableCell>
                                                            <TableCell>
                                                                {selectedCompound.name}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                SMILES
                                                            </TableCell>
                                                            <TableCell className="break-all">
                                                                {selectedCompound.structure}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                Molecular Weight
                                                            </TableCell>
                                                            <TableCell>
                                                                {selectedCompound.molecularWeight.toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                Binding Affinity
                                                            </TableCell>
                                                            <TableCell>
                                                                {selectedCompound.binding_affinity.toFixed(4)}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                Druglikeness
                                                            </TableCell>
                                                            <TableCell>
                                                                {selectedCompound.likeliness.toFixed(4)}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                Toxicity
                                                            </TableCell>
                                                            <TableCell>
                                                                {selectedCompound.toxicity.toFixed(4)}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                Synthetic Accessibility
                                                            </TableCell>
                                                            <TableCell>
                                                                {selectedCompound.synthetic_accessibility.toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                Lipinski Violations
                                                            </TableCell>
                                                            <TableCell>
                                                                {selectedCompound.lipinski_violations}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium">
                                                                Solubility
                                                            </TableCell>
                                                            <TableCell>
                                                                {selectedCompound.solubility.toFixed(4)}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>

                                        {/* Compound Visualization */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Visualization</CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center justify-center">
                                                {selectedCompound.visualData ? (
                                                    <div className="flex flex-col items-center space-y-4">
                                                        {/* 2D Structure */}
                                                        <div className="w-full bg-white p-4 rounded-lg">
                                                            <img
                                                                src={selectedCompound.visualData.images["2d"]}
                                                                alt={`2D structure of ${selectedCompound.name}`}
                                                                className="max-w-full h-auto mx-auto"
                                                            />
                                                        </div>

                                                        {/* 3D Structure - Simplified approach */}
                                                        <div className="w-full h-[300px] bg-gray-100 rounded-lg p-4">
                                                            <div className="glass rounded-2xl p-4 h-full">
                                                                <iframe
                                                                    src={`https://3dmol.org/viewer.html?pdb=data:text/plain;base64,${btoa(selectedCompound.visualData.models.pdb)}&style=stick`}
                                                                    width="100%"
                                                                    height="100%"
                                                                    style={{ border: 'none' }}
                                                                    title={`3D structure of ${selectedCompound.name}`}
                                                                ></iframe>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-muted-foreground">
                                                        <p>No visualization data available.</p>
                                                        <p className="text-sm mt-2">
                                                            Enable 3D visualizations in the search settings to view molecule structures.
                                                        </p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="variants" className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-16">Rank</TableHead>
                                                <TableHead>SMILES</TableHead>
                                                <TableHead className="w-20">Score</TableHead>
                                                <TableHead className="w-24">Druglikeness</TableHead>
                                                <TableHead className="w-20">Toxicity</TableHead>
                                                <TableHead className="w-28">Binding Affinity</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {variants.map((variant: any) => (
                                                <TableRow key={variant.rank}>
                                                    <TableCell className="font-medium">
                                                        {variant.rank}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs break-all">
                                                        {variant.smiles}
                                                    </TableCell>
                                                    <TableCell>
                                                        {variant.score?.toFixed(2) || "N/A"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {variant.druglikeness?.toFixed(2) || "N/A"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {variant.toxicity?.toFixed(2) || "N/A"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {variant.binding_affinity?.toFixed(4) || "N/A"}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Explanation Sections */}
            {optimizationResponse && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Compounds Explanation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-line">
                                {optimizationResponse.explanation}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Variants Explanation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-line">
                                {optimizationResponse.variants_explanation}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </motion.div>
    );
};

export default CompoundResults;