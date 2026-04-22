"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, FileCode2, Network, TableProperties, Download, LayoutTemplate, Layers, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ArchitectureResult } from "@/lib/supabase";

export default function ResultPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [result, setResult] = useState<ArchitectureResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadResult = () => {
            setIsLoading(true);
            try {
                const cached = localStorage.getItem(`result_${id}`);
                if (cached) {
                    setResult(JSON.parse(cached));
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load architecture result.");
            } finally {
                setIsLoading(false);
            }
        };

        loadResult();
    }, [id]);

    const copyToClipboard = async (text: string, description: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${description} copied to clipboard!`);
        } catch {
            toast.error("Failed to copy text.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 animate-in fade-in duration-1000">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/30 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <h2 className="text-2xl font-bold">Designing your system...</h2>
                <p className="text-muted-foreground max-w-md">Our AI architect is analyzing requirements and building the optimal solution.</p>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <h2 className="text-2xl font-bold text-destructive">Result not found</h2>
                <p className="text-muted-foreground">The architecture result may have expired or was not saved.</p>
                <Button onClick={() => router.push("/")} variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Button>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b pb-6 gap-4">
                <div>
                    <Button onClick={() => router.push("/")} variant="ghost" size="sm" className="gap-1 mb-2 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                        <LayoutTemplate className="w-8 h-8 text-primary" />
                        System Architecture
                    </h1>
                    <p className="text-muted-foreground">
                        Design generated dynamically based on your requirements.
                    </p>
                </div>
                <Button variant="outline" className="gap-2" onClick={() => copyToClipboard(JSON.stringify(result, null, 2), "Full JSON Payload")}>
                    <Download className="w-4 h-4" />
                    Export JSON
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1 space-y-8">

                    <Card className="shadow-lg border-primary/20 bg-primary/5">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <FileCode2 className="w-5 h-5 text-primary" />
                                Explanation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                                {result.architecture_explanation}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-indigo-400" />
                                    Tech Stack
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.tech_stack, "Tech Stack")}>
                                    <Copy className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap">
                                {result.tech_stack}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <FileCode2 className="w-5 h-5 text-orange-400" />
                                    Folder Structure
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.folder_structure, "Folder Structure")}>
                                    <Copy className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs text-muted-foreground overflow-x-auto bg-muted/50 p-4 rounded-md whitespace-pre-wrap">
                                {result.folder_structure}
                            </pre>
                        </CardContent>
                    </Card>

                </div>

                <div className="lg:col-span-2 space-y-8">

                    <Card className="shadow-xl overflow-hidden border-blue-500/20">
                        <CardHeader className="bg-muted/30 border-b pb-4">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Network className="w-5 h-5 text-blue-500" />
                                    Architecture Diagram
                                </CardTitle>
                                <Button variant="outline" size="sm" className="gap-2" onClick={() => copyToClipboard(result.architecture_diagram, "Mermaid Diagram Code")}>
                                    <Copy className="w-4 h-4" /> Copy Mermaid
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ArchitectureDiagram code={result.architecture_diagram} />
                        </CardContent>
                    </Card>

                    <Card className="shadow-xl overflow-hidden border-cyan-500/20">
                        <CardHeader className="bg-muted/30 border-b pb-4">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <TableProperties className="w-5 h-5 text-cyan-500" />
                                    Database Schema
                                </CardTitle>
                                <Button variant="outline" size="sm" className="gap-2" onClick={() => copyToClipboard(result.database_schema, "Schema Mermaid Code")}>
                                    <Copy className="w-4 h-4" /> Copy Mermaid
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ArchitectureDiagram code={result.database_schema} />
                        </CardContent>
                    </Card>

                    <Card className="shadow-xl border-indigo-500/20">
                        <CardHeader className="bg-muted/30 border-b pb-4">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Network className="w-5 h-5 text-indigo-500" />
                                    API Endpoints
                                </CardTitle>
                                <Button variant="outline" size="sm" className="gap-2" onClick={() => copyToClipboard(result.api_endpoints, "API Endpoints")}>
                                    <Copy className="w-4 h-4" /> Copy Markdown
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap">
                                {result.api_endpoints}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
