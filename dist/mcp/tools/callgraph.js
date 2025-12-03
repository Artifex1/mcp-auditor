import { z } from "zod";
import { encode } from "@toon-format/toon";
export const callGraphSchema = {
    description: "Generate a call graph for the specified files",
    inputSchema: {
        paths: z.array(z.string()).describe("File paths or glob patterns to analyze")
    }
};
export function createCallGraphHandler(engine) {
    return async ({ paths }) => {
        const graph = await engine.processCallGraph(paths);
        return {
            content: [
                {
                    type: "text",
                    text: encode({ call_graph: graph })
                }
            ]
        };
    };
}
