import { SupportedLanguage } from "../engine/types.js";
import { BaseAdapter } from "./baseAdapter.js";

const JS_FAMILY_QUERIES = {
    comments: '(comment) @comment',
    functions: `
        (function_declaration) @function
        (generator_function_declaration) @function
        (method_definition) @function
        (function_expression) @function
        (arrow_function) @function
    `,
    branching: `
        (if_statement) @branch
        (for_statement) @branch
        (for_in_statement) @branch
        (for_of_statement) @branch
        (while_statement) @branch
        (do_statement) @branch
        (switch_statement) @branch
        (conditional_expression) @branch
        (try_statement) @branch
    `,
    normalization: `
        (call_expression) @norm
        (function_declaration) @norm
        (generator_function_declaration) @norm
        (function_expression) @norm
        (arrow_function) @norm
        (method_definition) @norm
        (array) @norm
        (object) @norm
    `
};

const JS_FAMILY_CONSTANTS = {
    baseRateNlocPerDay: 450,
    // Typical JS/TS code is readable but can hide complexity in callbacks and
    // async flows; we start penalizing around moderate branch density.
    complexityMidpoint: 12,
    // Complexity ramps at a similar pace to Go/C++, rewarding simpler code but
    // quickly slowing down when control flow gets tangled.
    complexitySteepness: 9,
    // Clear, linear code can give ~25% speedup; heavily nested/async logic can
    // cost up to ~55% more review time.
    complexityBenefitCap: 0.25,
    complexityPenaltyCap: 0.55,
    // Good inline docs for async boundaries, data shapes, and side effects help
    // reviewers; most benefit comes around ~15% comment density.
    commentFullBenefitDensity: 15,
    commentBenefitCap: 0.25
};

export class JavaScriptAdapter extends BaseAdapter {
    constructor() {
        super({
            languageId: SupportedLanguage.JavaScript,
            queries: JS_FAMILY_QUERIES,
            constants: JS_FAMILY_CONSTANTS
        });
    }
}

export class TypeScriptAdapter extends BaseAdapter {
    constructor() {
        super({
            languageId: SupportedLanguage.TypeScript,
            queries: JS_FAMILY_QUERIES,
            constants: JS_FAMILY_CONSTANTS
        });
    }
}

export class TsxAdapter extends BaseAdapter {
    constructor() {
        super({
            languageId: SupportedLanguage.Tsx,
            queries: JS_FAMILY_QUERIES,
            constants: JS_FAMILY_CONSTANTS
        });
    }
}

export class FlowAdapter extends BaseAdapter {
    constructor() {
        super({
            languageId: SupportedLanguage.Flow,
            queries: JS_FAMILY_QUERIES,
            constants: JS_FAMILY_CONSTANTS
        });
    }
}
