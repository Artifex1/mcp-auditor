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
                baseRateNlocPerDay: 200,
                complexityPenaltyThreshold: 10,
                complexityPenaltyFactor: 0.5,
                commentDensityBenefitThreshold: 20,
                commentDensityBenefitFactor: 0.3
            }
        });
    }
}
