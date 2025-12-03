import { SupportedLanguage } from "../engine/index.js";
import { BaseAdapter } from "./baseAdapter.js";

export class CppAdapter extends BaseAdapter {
    constructor() {
        super({
            languageId: SupportedLanguage.Cpp,
            rules: {
                comments: [
                    { id: "comment", language: SupportedLanguage.Cpp, rule: { kind: "comment" } }
                ],
                functions: {
                    id: "function_definition",
                    language: SupportedLanguage.Cpp,
                    rule: { kind: "function_definition" }
                },
                branching: {
                    id: "branching",
                    language: SupportedLanguage.Cpp,
                    rule: {
                        any: [
                            { kind: "if_statement" },
                            { kind: "for_statement" },
                            { kind: "while_statement" },
                            { kind: "do_statement" },
                            { kind: "catch_clause" }
                        ]
                    }
                },
                normalization: [
                    { id: "call_expression", language: SupportedLanguage.Cpp, rule: { kind: "call_expression" } },
                    { id: "function_definition", language: SupportedLanguage.Cpp, rule: { kind: "function_definition" } },
                    { id: "initializer_list", language: SupportedLanguage.Cpp, rule: { kind: "initializer_list" } }
                ]
            },
            constants: {
                baseRateNlocPerDay: 400,
                // Moderate structural complexity is “normal” C++: branches, loops,
                // RAII, exceptions, templates, etc. We only start penalizing above that.
                complexityMidpoint: 15,
                // Complexity ramp is gradual. You need to be ~10–20 CC above/below
                // the midpoint before you hit most of the penalty/benefit.
                complexitySteepness: 9,
                // High complexity can slow review down by up to ~60% (1.6x time),
                // while very simple code can at best give ~30% speedup. In security
                // audits, complexity hurts more than simplicity helps.
                complexityBenefitCap: 0.3,
                complexityPenaltyCap: 0.6,
                // Slightly higher “normal” comment density to explain invariants,
                // ownership rules, perf hacks. Around 18%+ unlocks most of the
                // documentation benefit (up to ~30%).
                commentFullBenefitDensity: 18,
                commentBenefitCap: 0.3
            }
        });
    }
}
