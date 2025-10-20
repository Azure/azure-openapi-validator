import { describe, test, expect } from 'vitest'
import { extractRulesFromLabels, extractRulesFromBody, extractRuleNames } from '../src/extract-rule-names-and-run-validation.js'

describe('extract-rule-names', () => {
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
      },
      {
        description: 'returns empty array when no test- labels',
        labels: ['bug', 'documentation', 'enhancement'],
        expected: []
      },
      {
        description: 'handles empty array',
        labels: [],
        expected: []
      },
      {
        description: 'trims whitespace from rule names',
        labels: ['test- RuleOne ', 'test-  RuleTwo  '],
        expected: ['RuleOne', 'RuleTwo']
      },
      {
        description: 'handles label objects with name property (GitHub API format)',
        labels: [{ name: 'test-RuleOne' }, { name: 'test-RuleTwo' }, { name: 'bug' }],
        expected: ['RuleOne', 'RuleTwo']
      }
    ])('$description', ({ labels, expected }) => {
      const result = extractRulesFromLabels(labels)
      expect(result).toEqual(expected)
    })
  })

  describe('extractRulesFromBody', () => {
    test.each([
      {
        description: 'extracts rules from "rules:" line',
        body: 'Some text\nrules: PostResponseCodes, DeleteMustNotHaveRequestBody\nMore text',
        expected: ['PostResponseCodes', 'DeleteMustNotHaveRequestBody']
      },
      {
        description: 'extracts rules from "rule:" line (singular)',
        body: 'Some text\nrule: PostResponseCodes\nMore text',
        expected: ['PostResponseCodes']
      },
      {
        description: 'handles case-insensitive rules: prefix',
        body: 'RULES: RuleOne\nRules: RuleTwo',
        expected: ['RuleOne', 'RuleTwo']
      },
      {
        description: 'handles multiple rules on separate lines',
        body: 'rules: RuleOne, RuleTwo\nrules: RuleThree',
        expected: ['RuleOne', 'RuleTwo', 'RuleThree']
      },
      {
        description: 'returns empty array when no rules found',
        body: 'Just a regular PR description\nNo rules here',
        expected: []
      },
      {
        description: 'handles empty body',
        body: '',
        expected: []
      },
      {
        description: 'trims whitespace from rule names',
        body: 'rules:  RuleOne  ,  RuleTwo  ',
        expected: ['RuleOne', 'RuleTwo']
      }
    ])('$description', ({ body, expected }) => {
      const result = extractRulesFromBody(body)
      expect(result).toEqual(expected)
    })
  })

  describe('extractRuleNames', () => {
    test.each([
      {
        description: 'combines rules from labels and body',
        context: {
          payload: {
            pull_request: {
              labels: [{ name: 'test-LabelRule' }],
              body: 'rules: BodyRule'
            }
          }
        },
        expected: ['LabelRule', 'BodyRule']
      },
      {
        description: 'extracts rules from labels only',
        context: {
          payload: {
            pull_request: {
              labels: [{ name: 'test-RuleOne' }, { name: 'test-RuleTwo' }],
              body: ''
            }
          }
        },
        expected: ['RuleOne', 'RuleTwo']
      },
      {
        description: 'extracts rules from body when no test- labels present',
        context: {
          payload: {
            pull_request: {
              labels: [{ name: 'bug' }, { name: 'documentation' }],
              body: 'rules: PostResponseCodes'
            }
          }
        },
        expected: ['PostResponseCodes']
      },
      {
        description: 'removes duplicates',
        context: {
          payload: {
            pull_request: {
              labels: [{ name: 'test-RuleOne' }, { name: 'test-RuleTwo' }, { name: 'test-RuleOne' }],
              body: 'rules: RuleTwo, RuleThree'
            }
          }
        },
        expected: ['RuleOne', 'RuleTwo', 'RuleThree']
      },
      {
        description: 'returns empty array when no rules found',
        context: {
          payload: {
            pull_request: {
              labels: [{ name: 'bug' }],
              body: 'No rules here'
            }
          }
        },
        expected: []
      },
      {
        description: 'handles empty labels and body',
        context: {
          payload: {
            pull_request: {
              labels: [],
              body: ''
            }
          }
        },
        expected: []
      },
      {
        description: 'returns empty array when no pull request in context',
        context: { payload: {} },
        expected: []
      }
    ])('$description', ({ context, expected }) => {
      const result = extractRuleNames(context)
      expect(result).toEqual(expected)
    })
  })
})
