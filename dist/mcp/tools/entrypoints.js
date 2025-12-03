import { z } from "zod";
import { encode } from "@toon-format/toon";
// Schema for the entrypoints tool
export const entrypointsSchema = {
    description: "List externally reachable entrypoints for a given set of files",
    inputSchema: {
        paths: z.array(z.string()).describe("File paths or glob patterns to analyze")
    }
};
export function createEntrypointsHandler(engine) {
    return async ({ paths }) => {
        try {
            const entrypoints = await engine.processEntrypoints(paths);
            return {
                content: [{
                        type: "text",
                        text: encode({ entrypoints })
                    }]
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`
                    }]
            };
        }
    };
}
