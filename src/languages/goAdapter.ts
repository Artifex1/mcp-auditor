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
                baseRateNlocPerDay: 300,
                complexityPenaltyThreshold: 10,
                complexityPenaltyFactor: 0.5,
                commentDensityBenefitThreshold: 20,
                commentDensityBenefitFactor: 0.3
            }
        });
    }
}
