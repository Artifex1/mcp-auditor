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
                baseRateNlocPerDay: 400,
                //  Java tends to be verbose but structurally simpler than C++/Rust.
                //  We expect slightly lower CC density before considering it “complex.”
                complexityMidpoint: 13,
                //  Once Java control flow gets significantly more tangled than normal
                //  business logic, we ramp penalties a bit faster.
                complexitySteepness: 9,
                //  Deep OO / branching can add up to ~55% extra review time, while
                //  simple Java can give ~25% speedup at best.
                complexityBenefitCap: 0.25,
                complexityPenaltyCap: 0.55,
                //  Many Java codebases rely on readable code plus moderate Javadoc.
                //  Around 25% comments unlocks most of the doc benefit (up to ~25%).
                commentFullBenefitDensity: 25,
                commentBenefitCap: 0.25
            }
        });
    }
}
