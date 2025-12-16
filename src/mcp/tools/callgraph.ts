import { z } from "zod";
import { encode } from "@toon-format/toon";
import { Engine } from "../../engine/index.js";

export const callGraphSchema = {
    description: "Generate a call graph for the specified files",
    inputSchema: {
        paths: z.array(z.string()).describe("File paths or glob patterns to analyze")
    }
};

export function createCallGraphHandler(engine: Engine) {
    return async (
        { paths }: { paths: string[] }
    ) => {
        const graph = await engine.processCallGraph(paths);

        // Minify graph for output
        const reducedGraph = {
            nodes: graph.nodes.map(n => ({
                id: n.id,
                visibility: n.visibility
            })),
            edges: graph.edges
        };

        return {
            content: [
                {
                    type: "text" as const,
                    text: encode({ call_graph: reducedGraph })
                }
            ]
        };
    };
}
