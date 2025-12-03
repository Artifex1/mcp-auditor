import { SupportedLanguage } from "./types.js";
import { resolveFiles, readFiles } from "./fileUtils.js";
import path from "path";
import { CppAdapter } from "../languages/cppAdapter.js";
import { JavaAdapter } from "../languages/javaAdapter.js";
import { GoAdapter } from "../languages/goAdapter.js";
import { RustAdapter } from "../languages/rustAdapter.js";
export * from "./types.js";
export class Engine {
    adapters = new Map();
    registerAdapter(adapter) {
        this.adapters.set(adapter.languageId, adapter);
    }
    constructor() {
        this.registerAdapter(new CppAdapter());
        this.registerAdapter(new JavaAdapter());
        this.registerAdapter(new GoAdapter());
        this.registerAdapter(new RustAdapter());
    }
    getAdapter(languageId) {
        return this.adapters.get(languageId);
    }
    detectLanguage(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        switch (ext) {
            case ".sol":
                return SupportedLanguage.Solidity;
            case ".cpp":
            case ".hpp":
            case ".cc":
            case ".cxx":
            case ".c":
            case ".h":
                return SupportedLanguage.Cpp;
            case ".java":
                return SupportedLanguage.Java;
            case ".go":
                return SupportedLanguage.Go;
            case ".rs":
                return SupportedLanguage.Rust;
            default:
                return undefined;
        }
    }
    async processEntrypoints(patterns) {
        const filePaths = await resolveFiles(patterns);
        const files = await readFiles(filePaths);
        // Group files by language
        const filesByLanguage = this.groupFilesByLanguage(files);
        const allEntrypoints = [];
        // Dispatch to adapters
        for (const [lang, langFiles] of filesByLanguage.entries()) {
            const adapter = this.getAdapter(lang);
            if (adapter) {
                const entrypoints = await adapter.extractEntrypoints(langFiles);
                allEntrypoints.push(...entrypoints);
            }
            else {
                console.warn(`No adapter found for language: ${lang}`);
            }
        }
        return allEntrypoints;
    }
    async processSignatures(patterns) {
        const filePaths = await resolveFiles(patterns);
        const files = await readFiles(filePaths);
        const filesByLanguage = this.groupFilesByLanguage(files);
        const allSignatures = {};
        for (const [lang, langFiles] of filesByLanguage.entries()) {
            const adapter = this.getAdapter(lang);
            if (adapter) {
                const signatures = await adapter.extractSignatures(langFiles);
                Object.assign(allSignatures, signatures);
            }
        }
        return allSignatures;
    }
    async processMetrics(patterns) {
        const filePaths = await resolveFiles(patterns);
        const files = await readFiles(filePaths);
        const filesByLanguage = this.groupFilesByLanguage(files);
        const allMetrics = [];
        for (const [lang, langFiles] of filesByLanguage.entries()) {
            const adapter = this.getAdapter(lang);
            if (adapter) {
                const metrics = await adapter.calculateMetrics(langFiles);
                allMetrics.push(...metrics);
            }
        }
        return allMetrics;
    }
    async processCallGraph(patterns) {
        const filePaths = await resolveFiles(patterns);
        const files = await readFiles(filePaths);
        const filesByLanguage = this.groupFilesByLanguage(files);
        const combinedGraph = { nodes: [], edges: [] };
        for (const [lang, langFiles] of filesByLanguage.entries()) {
            const adapter = this.getAdapter(lang);
            if (adapter) {
                const graph = await adapter.generateCallGraph(langFiles);
                combinedGraph.nodes.push(...graph.nodes);
                combinedGraph.edges.push(...graph.edges);
            }
        }
        return combinedGraph;
    }
    groupFilesByLanguage(files) {
        const filesByLanguage = new Map();
        for (const file of files) {
            const lang = this.detectLanguage(file.path);
            if (lang) {
                if (!filesByLanguage.has(lang)) {
                    filesByLanguage.set(lang, []);
                }
                filesByLanguage.get(lang).push(file);
            }
        }
        return filesByLanguage;
    }
}
