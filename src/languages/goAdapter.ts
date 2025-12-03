import { SupportedLanguage } from "../engine/index.js";
import { BaseAdapter } from "./baseAdapter.js";

export class GoAdapter extends BaseAdapter {
    constructor() {
        super({
            languageId: SupportedLanguage.Go,
            rules: {
                comments: [
                    { id: "comment", language: SupportedLanguage.Go, rule: { kind: "comment" } }
                ],
                functions: {
                    id: "function_or_method",
                    language: SupportedLanguage.Go,
                    rule: {
                        any: [
                            { kind: "function_declaration" },
                            { kind: "method_declaration" }
                        ]
                    }
                },
                branching: {
                    id: "branching",
                    language: SupportedLanguage.Go,
                    rule: {
                        any: [
                            { kind: "if_statement" },
                            { kind: "for_statement" },
                            { kind: "expression_switch_statement" },
                            { kind: "type_switch_statement" }
                        ]
                    }
                },
                normalization: [
                    { id: "call_expression", language: SupportedLanguage.Go, rule: { kind: "call_expression" } },
                    { id: "function_declaration", language: SupportedLanguage.Go, rule: { kind: "function_declaration" } },
                    { id: "method_declaration", language: SupportedLanguage.Go, rule: { kind: "method_declaration" } },
                    { id: "composite_literal", language: SupportedLanguage.Go, rule: { kind: "composite_literal" } }
                ]
            },
            constants: {
                baseRateNlocPerDay: 400,
                // Go is intentionally simple; deep nesting and clever control flow
                // are atypical. We start penalizing at a lower CC density than C++.
                complexityMidpoint: 12,
                // A bit sharper than C++: once Go code gets significantly more complex
                // than “normal,” review cost ramps up fairly quickly.
                complexitySteepness: 9,
                // Very simple Go can give ~25% speedup, while heavily tangled logic
                // can cost up to ~50% more time. Extreme complexity is less common
                // than in low-level systems languages.
                complexityBenefitCap: 0.25,
                complexityPenaltyCap: 0.50,
                // Idiomatic Go favors clear code with modest comments. Around 15%+
                // starts unlocking the bulk of the documentation benefit (up to ~25%).
                commentFullBenefitDensity: 15,
                commentBenefitCap: 0.25
            }
        });
    }
}
