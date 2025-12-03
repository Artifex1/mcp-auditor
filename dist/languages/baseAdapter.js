import { astGrep } from "../util/astGrepCli.js";
export class BaseAdapter {
    languageId;
    config;
    constructor(config) {
        this.languageId = config.languageId;
        this.config = config;
    }
    async extractEntrypoints(files) {
        return [];
    }
    async generateCallGraph(files) {
        return { nodes: [], edges: [] };
    }
    async extractSignatures(files) {
        const signaturesByFile = {};
        for (const file of files) {
            try {
                const matches = await astGrep({
                    code: file.content,
                    language: this.languageId,
                    rule: this.config.rules.functions
                });
                const signatures = [];
                for (const match of matches) {
                    // Extract signature up to opening brace (handles multi-line signatures)
                    const braceIndex = match.text.indexOf('{');
                    const signature = braceIndex !== -1
                        ? match.text.substring(0, braceIndex).trim()
                        : match.text.trim();
                    // Truncate to 80 characters max
                    const truncated = signature.length > 80
                        ? signature.substring(0, 77) + '...'
                        : signature;
                    signatures.push(truncated);
                }
                if (signatures.length > 0) {
                    signaturesByFile[file.path] = signatures;
                }
            }
            catch (e) {
                console.error(`Error extracting signatures for ${file.path}:`, e);
            }
        }
        return signaturesByFile;
    }
    async calculateMetrics(files) {
        const results = [];
        const { baseRateNlocPerDay, complexityPenaltyThreshold, complexityPenaltyFactor, commentDensityBenefitThreshold, commentDensityBenefitFactor } = this.config.constants;
        const HOURS_PER_DAY = 8;
        for (const file of files) {
            const lines = file.content.split('\n');
            const totalLines = lines.length;
            // 1. Comments
            const commentLinesSet = new Set();
            let onlyCommentLinesCount = 0;
            for (const rule of this.config.rules.comments) {
                const comments = await astGrep({
                    code: file.content,
                    language: this.languageId,
                    rule: rule
                });
                for (const comment of comments) {
                    for (let i = comment.range.start.line; i <= comment.range.end.line; i++) {
                        commentLinesSet.add(i);
                    }
                }
            }
            const linesWithComments = commentLinesSet.size;
            for (const lineIdx of commentLinesSet) {
                const lineContent = lines[lineIdx].trim();
                // Simple heuristic for "only comment" lines
                if (/^(\/\/|\/\*|\*|#)/.test(lineContent)) {
                    onlyCommentLinesCount++;
                }
            }
            // 2. Complexity
            const branches = await astGrep({
                code: file.content,
                language: this.languageId,
                rule: this.config.rules.branching
            });
            let cc = 0;
            for (const branch of branches) {
                let nestingLevel = 0;
                for (const other of branches) {
                    if (branch === other)
                        continue;
                    if (other.range.start.line <= branch.range.start.line &&
                        other.range.end.line >= branch.range.end.line) {
                        if (other.range.start.line < branch.range.start.line ||
                            other.range.end.line > branch.range.end.line ||
                            (other.range.start.line === branch.range.start.line && other.range.start.column < branch.range.start.column)) {
                            nestingLevel++;
                        }
                    }
                }
                cc += (1 + nestingLevel);
            }
            // 3. NLoC Calculation with Normalization
            let blankLines = 0;
            for (const line of lines) {
                if (line.trim() === '') {
                    blankLines++;
                }
            }
            // Calculate normalization adjustment for multi-line constructs
            let normalizationAdjustment = 0;
            if (this.config.rules.normalization) {
                const allConstructs = [];
                // Collect all constructs from all normalization rules
                for (const rule of this.config.rules.normalization) {
                    const constructs = await astGrep({
                        code: file.content,
                        language: this.languageId,
                        rule: rule
                    });
                    allConstructs.push(...constructs.map(c => ({ ...c, ruleId: rule.id })));
                }
                // Filter to only top-level (non-nested) constructs
                const topLevelConstructs = allConstructs.filter(construct => {
                    // Check if this construct is nested inside any other construct
                    const isNested = allConstructs.some(other => {
                        if (construct === other)
                            return false;
                        // Check if 'other' contains 'construct'
                        return other.range.start.line <= construct.range.start.line &&
                            other.range.end.line >= construct.range.end.line &&
                            (other.range.start.line < construct.range.start.line ||
                                other.range.end.line > construct.range.end.line ||
                                (other.range.start.line === construct.range.start.line &&
                                    other.range.start.column < construct.range.start.column));
                    });
                    return !isNested;
                });
                // Calculate adjustment for top-level constructs only
                for (const construct of topLevelConstructs) {
                    let startLine = construct.range.start.line;
                    let endLine = construct.range.end.line;
                    // Special handling for function definitions: only count the signature, not the body
                    if (construct.ruleId?.includes('function') || construct.ruleId?.includes('method')) {
                        // Try to find the function body within the construct
                        const bodyMatch = construct.text.match(/\{/);
                        if (bodyMatch) {
                            // Count newlines from start to the opening brace
                            const signatureText = construct.text.substring(0, construct.text.indexOf('{'));
                            const newlinesInSignature = (signatureText.match(/\n/g) || []).length;
                            endLine = startLine + newlinesInSignature;
                        }
                    }
                    const linesSpanned = endLine - startLine + 1;
                    if (linesSpanned > 1) {
                        normalizationAdjustment += (linesSpanned - 1);
                    }
                }
            }
            const nloc = Math.max(0, totalLines - blankLines - onlyCommentLinesCount - normalizationAdjustment);
            const commentDensity = nloc > 0 ? parseFloat(((linesWithComments / nloc) * 100).toFixed(2)) : 0;
            const normalizedCC = nloc > 0 ? (cc / nloc) * 100 : 0;
            // 4. Estimation
            let factor = 1.0;
            const ccFactor = Math.tanh(Math.max(0, normalizedCC - complexityPenaltyThreshold) / 10);
            factor += ccFactor * complexityPenaltyFactor;
            const cdFactor = 1 / (1 + Math.exp(-(commentDensity - commentDensityBenefitThreshold) / 10));
            factor -= cdFactor * commentDensityBenefitFactor;
            factor = Math.max(0.5, factor);
            const estimatedHours = parseFloat((((nloc / baseRateNlocPerDay) * HOURS_PER_DAY) * factor).toFixed(2));
            results.push({
                file: file.path,
                nloc,
                linesWithComments,
                commentDensity,
                cognitiveComplexity: cc,
                estimatedHours
            });
        }
        return results;
    }
}
