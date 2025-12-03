import { z } from "zod";
import { encode } from "@toon-format/toon";
export const peekSchema = {
    description: "Extract function signatures from files to understand their purpose",
    inputSchema: {
        paths: z.array(z.string()).describe("File paths or glob patterns to analyze")
    }
};
export function createPeekHandler(engine) {
    return async ({ paths }) => {
        try {
            const signatures = await engine.processSignatures(paths);
            return {
                content: [{
                        type: "text",
                        text: encode({ signatures })
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
