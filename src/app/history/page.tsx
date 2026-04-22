"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, ArrowRight } from "lucide-react";

export default function HistoryPage() {
    const [history, setHistory] = useState<{ id: string; prompt: string; created_at: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("/api/history");
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data.history || []);
                }
            } catch (err) {
                console.error("Failed to load history:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 border-b pb-6">
                <History className="w-8 h-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold">Generation History</h1>
                    <p className="text-muted-foreground">View your previously generated system architectures.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : history.length === 0 ? (
                <Card className="bg-muted/30 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                        <History className="w-12 h-12 text-muted-foreground/50" />
                        <h3 className="text-xl font-medium">No history found</h3>
                        <p className="text-muted-foreground">You haven&apos;t generated any architectures yet, or Supabase is not configured.</p>
                        <Button asChild className="mt-4">
                            <Link href="/">Generate Now <ArrowRight className="w-4 h-4 ml-2" /></Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {history.map((item) => (
                        <Card key={item.id} className="hover:border-primary/50 transition-colors group">
                            <Link href={`/result/${item.id}`} className="block">
                                <CardContent className="p-6 flex justify-between items-center gap-4">
                                    <div className="space-y-1 overflow-hidden">
                                        <p className="font-medium truncate text-lg group-hover:text-primary transition-colors">
                                            &quot;{item.prompt}&quot;
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
