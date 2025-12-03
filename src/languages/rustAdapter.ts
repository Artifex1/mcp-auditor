import { SupportedLanguage } from "../engine/index.js";
import { BaseAdapter } from "./baseAdapter.js";

export class RustAdapter extends BaseAdapter {
    constructor() {
        super({
            languageId: SupportedLanguage.Rust,
            rules: {
                comments: [
                    { id: "line_comment", language: SupportedLanguage.Rust, rule: { kind: "line_comment" } },
                    { id: "block_comment", language: SupportedLanguage.Rust, rule: { kind: "block_comment" } }
                ],
                functions: {
                    id: "function_item",
                    language: SupportedLanguage.Rust,
                    rule: { kind: "function_item" }
                },
                branching: {
                    id: "branching",
                    language: SupportedLanguage.Rust,
                    rule: {
                        any: [
                            { kind: "if_expression" },
                            { kind: "for_expression" },
                            { kind: "while_expression" },
                            { kind: "loop_expression" },
                            { kind: "match_expression" }
                        ]
                    }
                },
                normalization: [
                    { id: "call_expression", language: SupportedLanguage.Rust, rule: { kind: "call_expression" } },
                    { id: "function_item", language: SupportedLanguage.Rust, rule: { kind: "function_item" } },
                    { id: "array_expression", language: SupportedLanguage.Rust, rule: { kind: "array_expression" } }
                ]
            },
            constants: {
                baseRateNlocPerDay: 200,
                complexityPenaltyThreshold: 10,
                complexityPenaltyFactor: 0.5,
                commentDensityBenefitThreshold: 20,
                commentDensityBenefitFactor: 0.3
            }
        });
    }
}
