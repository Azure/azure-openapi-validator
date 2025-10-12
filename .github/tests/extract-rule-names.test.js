const { extractRulesFromLabels, extractRulesFromBody, extractRuleNames } = require('../scripts/extract-rule-names.js')

describe('extract-rule-names', () => {
  describe('extractRulesFromLabels', () => {
    test('extracts rules from test- prefixed labels', () => {
      const labels = ['test-PostResponseCodes', 'test-DeleteMustNotHaveRequestBody', 'bug']
      const result = extractRulesFromLabels(labels)
      expect(result).toEqual(['PostResponseCodes', 'DeleteMustNotHaveRequestBody'])
    })

    test('handles case-insensitive test- prefix', () => {
      const labels = ['TEST-RuleOne', 'Test-RuleTwo', 'test-RuleThree']
      const result = extractRulesFromLabels(labels)
      expect(result).toEqual(['RuleOne', 'RuleTwo', 'RuleThree'])
    })

    test('returns empty array when no test- labels', () => {
      const labels = ['bug', 'documentation', 'enhancement']
      const result = extractRulesFromLabels(labels)
      expect(result).toEqual([])
    })

    test('handles empty array', () => {
      const result = extractRulesFromLabels([])
      expect(result).toEqual([])
    })

    test('trims whitespace from rule names', () => {
      const labels = ['test- RuleOne ', 'test-  RuleTwo  ']
      const result = extractRulesFromLabels(labels)
      expect(result).toEqual(['RuleOne', 'RuleTwo'])
    })
  })

  describe('extractRulesFromBody', () => {
    test('extracts rules from "rules:" line', () => {
      const body = 'Some text\nrules: PostResponseCodes, DeleteMustNotHaveRequestBody\nMore text'
      const result = extractRulesFromBody(body)
      expect(result).toEqual(['PostResponseCodes', 'DeleteMustNotHaveRequestBody'])
    })

    test('extracts rules from "rule:" line (singular)', () => {
      const body = 'Some text\nrule: PostResponseCodes\nMore text'
      const result = extractRulesFromBody(body)
      expect(result).toEqual(['PostResponseCodes'])
    })

    test('handles case-insensitive rules: prefix', () => {
      const body = 'RULES: RuleOne\nRules: RuleTwo'
      const result = extractRulesFromBody(body)
      expect(result).toEqual(['RuleOne', 'RuleTwo'])
    })

    test('handles multiple rules on separate lines', () => {
      const body = 'rules: RuleOne, RuleTwo\nrules: RuleThree'
      const result = extractRulesFromBody(body)
      expect(result).toEqual(['RuleOne', 'RuleTwo', 'RuleThree'])
    })

    test('returns empty array when no rules found', () => {
      const body = 'Just a regular PR description\nNo rules here'
      const result = extractRulesFromBody(body)
      expect(result).toEqual([])
    })

    test('handles empty body', () => {
      const result = extractRulesFromBody('')
      expect(result).toEqual([])
    })

    test('trims whitespace from rule names', () => {
      const body = 'rules:  RuleOne  ,  RuleTwo  '
      const result = extractRulesFromBody(body)
      expect(result).toEqual(['RuleOne', 'RuleTwo'])
    })
  })

  describe('extractRuleNames', () => {
    test('prefers labels over body when both present', () => {
      const labels = ['test-LabelRule']
      const body = 'rules: BodyRule'
      const result = extractRuleNames(labels, body)
      expect(result).toBe('LabelRule')
    })

    test('uses body when no test- labels present', () => {
      const labels = ['bug', 'documentation']
      const body = 'rules: PostResponseCodes'
      const result = extractRuleNames(labels, body)
      expect(result).toBe('PostResponseCodes')
    })

    test('removes duplicates', () => {
      const labels = ['test-RuleOne', 'test-RuleTwo', 'test-RuleOne']
      const body = ''
      const result = extractRuleNames(labels, body)
      expect(result).toBe('RuleOne,RuleTwo')
    })

    test('returns empty string when no rules found', () => {
      const labels = ['bug']
      const body = 'No rules here'
      const result = extractRuleNames(labels, body)
      expect(result).toBe('')
    })

    test('combines multiple rules into comma-separated string', () => {
      const labels = ['test-RuleOne', 'test-RuleTwo', 'test-RuleThree']
      const body = ''
      const result = extractRuleNames(labels, body)
      expect(result).toBe('RuleOne,RuleTwo,RuleThree')
    })

    test('handles empty labels and body', () => {
      const result = extractRuleNames([], '')
      expect(result).toBe('')
    })
  })
})
