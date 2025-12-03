import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import fsPromises from "fs/promises";
import os from "os";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Execute ast-grep CLI and return matches
 */
export async function astGrep(options) {
    const { pattern, language, rule, code } = options;
    // Path to ast-grep binary in node_modules
    const astGrepBin = path.join(__dirname, "../../node_modules/.bin/ast-grep");
    // Check if binary exists
    if (!fs.existsSync(astGrepBin)) {
        throw new Error(`ast-grep binary not found at ${astGrepBin}. ` +
            `If using pnpm, you may need to run: cd node_modules/@ast-grep/cli && npm run postinstall`);
    }
    let args = [];
    let tempDir = null;
    let rulePath = null;
    if (rule) {
        // Create temp file for rule
        tempDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), "ast-grep-"));
        rulePath = path.join(tempDir, "rule.json");
        const ruleContent = JSON.stringify(rule, null, 2);
        await fsPromises.writeFile(rulePath, ruleContent);
        args = ["scan", "--rule", rulePath, "--stdin", "--json=stream"];
    }
    else if (pattern && language) {
        args = ["run", "--pattern", pattern, "--lang", language, "--stdin", "--json=stream"];
    }
    else {
        throw new Error("astGrep requires either inlineRules or pattern+language");
    }
    return new Promise((resolve, reject) => {
        const proc = spawn(astGrepBin, args, {
            stdio: ["pipe", "pipe", "pipe"]
        });
        let stdout = "";
        let stderr = "";
        proc.stdout.on("data", (data) => {
            stdout += data.toString();
        });
        proc.stderr.on("data", (data) => {
            stderr += data.toString();
        });
        proc.on("close", (code) => {
            if (rulePath) {
                // Cleanup temp rule file/dir
                void fsPromises.rm(rulePath, { force: true }).catch(() => { });
                if (tempDir) {
                    void fsPromises.rm(tempDir, { force: true, recursive: true }).catch(() => { });
                }
            }
            if (code !== 0) {
                console.error("ast-grep stderr:", stderr);
                console.error("ast-grep stdout:", stdout);
                reject(new Error(`ast-grep failed with code ${code}: ${stderr}`));
                return;
            }
            try {
                // Parse JSON output
                const lines = stdout.trim().split("\n").filter(l => l.trim());
                const matches = [];
                for (const line of lines) {
                    if (line.trim()) {
                        const match = JSON.parse(line);
                        matches.push(match);
                    }
                }
                resolve(matches);
            }
            catch (error) {
                reject(new Error(`Failed to parse ast-grep output: ${error}`));
            }
        });
        proc.on("error", (error) => {
            reject(new Error(`Failed to spawn ast-grep: ${error.message}`));
        });
        // Write code to stdin
        proc.stdin.write(code);
        proc.stdin.end();
    });
}
