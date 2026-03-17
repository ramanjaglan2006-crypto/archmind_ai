"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface ArchitectureDiagramProps {
    code: string;
}

export function ArchitectureDiagram({ code }: ArchitectureDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svgContent, setSvgContent] = useState<string>("");

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            securityLevel: "loose",
            fontFamily: "Inter, sans-serif",
        });

        const renderDiagram = async () => {
            if (typeof window !== "undefined" && code) {
                try {
                    // Add a unique ID for each render to avoid conflicts
                    const id = `mermaid-${Date.now()}`;
                    const { svg } = await mermaid.render(id, code);
                    setSvgContent(svg);
                } catch (error) {
                    console.error("Failed to render mermaid diagram", error);
                    setSvgContent(`<div class="text-destructive p-4">Failed to render diagram. Please check the code syntax.</div>`);
                }
            }
        };

        renderDiagram();
    }, [code]);

    return (
        <div
            ref={containerRef}
            className="w-full overflow-x-auto p-4 flex justify-center mermaid-bg rounded-lg mt-4 cursor-crosshair min-h-[300px]"
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
}
