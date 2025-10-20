import { describe, expect, test } from "vitest";
import { extractRulesFromLabels } from "../src/extract-rule-names-and-run-validation.js";

describe('extractRulesFromLabels', () => {
    test.each([
        {
            description: 'extracts rules from test- prefixed labels',
            labels: ['test-PostResponseCodes', 'test-DeleteMustNotHaveRequestBody', 'bug'],
            expected: ['PostResponseCodes', 'DeleteMustNotHaveRequestBody']
        },
        {
            description: 'handles case-insensitive test- prefix',
            labels: ['TEST-RuleOne', 'Test-RuleTwo', 'test-RuleThree'],
            expected: ['RuleOne', 'RuleTwo', 'RuleThree']
        }
    ])('$description', ({ labels, expected }) => {
        const result = extractRulesFromLabels(labels)
        expect(result).toEqual(expected)
    })
})