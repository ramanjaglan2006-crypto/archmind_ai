"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowRight, Sparkles, Code2, Database, Layout } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const data = await res.json();

      if (typeof window !== "undefined") {
        localStorage.setItem(`result_${data.id}`, JSON.stringify(data.result));
      }

      router.push(`/result/${data.id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      setIsGenerating(false);
    }
  };

  const examplePrompts = [
    "Design a scalable ride sharing system like Uber",
    "Architecture for a real-time chat application",
    "Design an e-commerce platform with microservices",
  ];

  return (
    <div className="flex-1 flex flex-col pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          Powered by Gemini 1.5 Flash
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance">
          Generate System Architecture <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
            in Seconds
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          Describe your application idea, and our AI will generate a complete production-ready system design including architecture, diagrams, schemas, and API endpoints.
        </p>
      </div>

      <div className="w-full max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 relative z-10">
        <Card className="border-2 shadow-xl shadow-primary/5 bg-background/60 backdrop-blur-xl">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
              <div className="relative">
                <Textarea
                  placeholder="e.g., Design a scalable ride sharing system..."
                  className="min-h-[160px] text-lg resize-none p-4 pb-12 focus-visible:ring-primary/50"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                />
                <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                  {prompt.length} characters
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground self-center mr-2">Examples:</span>
                  {examplePrompts.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPrompt(p)}
                      className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-1 rounded transition-colors"
                      disabled={isGenerating}
                    >
                      {p.substring(0, 20)}...
                    </button>
                  ))}
                </div>
                <Button
                  size="lg"
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full sm:w-auto font-semibold gap-2 transition-all hover:scale-105"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Architecture...
                    </>
                  ) : (
                    <>
                      Generate Design
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2">
            <Layout className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg">Visual Diagrams</h3>
          <p className="text-sm text-muted-foreground">Automatically generates Mermaid.js architecture diagrams for your system.</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-2">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg">Database Schemas</h3>
          <p className="text-sm text-muted-foreground">Detailed relational database schemas mapped out for your application.</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-2">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg">API Endpoints</h3>
          <p className="text-sm text-muted-foreground">RESTful API endpoint definitions with methods, paths, and payloads.</p>
        </div>
      </div>
    </div>
  );
}
