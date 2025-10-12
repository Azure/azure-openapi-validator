#!/usr/bin/env node
"use strict";

/**
 * Extract rule names from GitHub PR labels and/or body
 * 
 * This script reads PR labels and body (from environment variables or GitHub context)
 * and extracts rule names based on conventions:
 * - Labels: expect labels like "test-<RuleName>"
 * - Body: parse lines like "rules: RuleName1, RuleName2"
 * 
 * Priority: Labels take precedence over body if both are present
 * 
 * Environment Variables:
 *   PR_LABELS - JSON array of label names (optional if running in GitHub Actions)
 *   PR_BODY   - PR body text (optional if running in GitHub Actions)
 * 
 * Output:
 *   Prints comma-separated rule names to stdout
 *   Sets GITHUB_ENV output if running in GitHub Actions
 */

/**
 * Extract rule names from PR labels
 * Expects labels in format: test-<RuleName>
 * @param {string[]} labels - Array of label names
 * @returns {string[]} - Array of extracted rule names
 */
function extractRulesFromLabels(labels) {
  return labels
    .filter(name => /^test-/i.test(name))
    .map(name => name.replace(/^test-/i, "").trim())
    .filter(Boolean);
}

/**
 * Extract rule names from PR body
 * Parses lines matching pattern: rules: RuleName1, RuleName2
 * @param {string} body - PR body text
 * @returns {string[]} - Array of extracted rule names
 */
function extractRulesFromBody(body) {
  // Find lines like "rules: A, B" or "rule: A"
  const ruleLine = (body.match(/^\s*rules?\s*:(.*)$/gim) || [])
    .map(line => line.split(":")[1] || "")
    .join(",");

  return ruleLine
    .split(/[\n,]/)
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Extract and combine rule names from labels and body
 * Labels take precedence over body if both are present
 * @param {string[]} labels - Array of label names
 * @param {string} body - PR body text
 * @returns {string} - Comma-separated unique rule names
 */
function extractRuleNames(labels, body) {
  const fromLabels = extractRulesFromLabels(labels);
  const fromBody = extractRulesFromBody(body);

  // Prefer labels when available; otherwise use body
  const chosen = fromLabels.length > 0 ? fromLabels : fromBody;
  
  // Remove duplicates and join
  const unique = Array.from(new Set(chosen));
  return unique.join(',');
}

// Main execution
if (require.main === module) {
  try {
    // Read from environment variables
    const labelsJson = process.env.PR_LABELS || '[]';
    const body = process.env.PR_BODY || '';

    // Parse labels
    let labels = [];
    try {
      labels = JSON.parse(labelsJson);
      if (!Array.isArray(labels)) {
        labels = [];
      }
    } catch (err) {
      console.error('Warning: Failed to parse PR_LABELS as JSON, using empty array');
      labels = [];
    }

    // Extract rule names
    const ruleNames = extractRuleNames(labels, body);

    // Output results
    console.log(ruleNames);

    // If running in GitHub Actions, also set output
    if (process.env.GITHUB_ENV) {
      const fs = require('fs');
      fs.appendFileSync(process.env.GITHUB_ENV, `RULE_NAMES=${ruleNames}\n`);
    }

  } catch (err) {
    console.error('Error extracting rule names:', err.message);
    process.exit(1);
  }
}

// Export functions for testing
module.exports = {
  extractRulesFromLabels,
  extractRulesFromBody,
  extractRuleNames,
};
