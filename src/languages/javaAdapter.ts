import { SupportedLanguage } from "../engine/index.js";
import { BaseAdapter } from "./baseAdapter.js";

export class JavaAdapter extends BaseAdapter {
    constructor() {
        super({
            languageId: SupportedLanguage.Java,
            rules: {
                comments: [
                    { id: "line_comment", language: SupportedLanguage.Java, rule: { kind: "line_comment" } },
                    { id: "block_comment", language: SupportedLanguage.Java, rule: { kind: "block_comment" } }
                ],
                functions: {
                    id: "method_declaration",
                    language: SupportedLanguage.Java,
                    rule: { kind: "method_declaration" }
                },
                branching: {
                    id: "branching",
                    language: SupportedLanguage.Java,
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
                    { id: "method_invocation", language: SupportedLanguage.Java, rule: { kind: "method_invocation" } },
                    { id: "method_declaration", language: SupportedLanguage.Java, rule: { kind: "method_declaration" } },
                    { id: "array_initializer", language: SupportedLanguage.Java, rule: { kind: "array_initializer" } }
                ]
            },
            constants: {
                baseRateNlocPerDay: 250,
                complexityPenaltyThreshold: 10,
                complexityPenaltyFactor: 0.5,
                commentDensityBenefitThreshold: 20,
                commentDensityBenefitFactor: 0.3
            }
        });
    }
}
