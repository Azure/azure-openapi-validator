/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const LintDescriptionProse: string = "LintDescriptionProse";

import * as jp from 'jsonpath';
import { spawnSync } from 'child_process';

var noLinterWarning = false;

/**
 * RULE DESCRIPTION: This rule runs the external program `proselint`, if available.
 * The full documentation for `proselint` can be read at:
 *      https://github.com/amperser/proselint/
 *
 *  This rule should be disabled if proselint is generating excessive messages of dubious use
 *  for any given description. Excessive messages should also be communicated to the DevEx
 *  team under Robert Outlaw so that proselint rule configuration can be adjusted.
 */

rules.push({
  id: "D450",
  name: LintDescriptionProse,
  severity: "warning",
  category: "DocumentationViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.default,
  appliesTo_JsonQuery: "$..description",
  run: function* (doc, node, path) {
    const msg: string = "`proselint` generated warnings: ";
    if (typeof(node) !== "string") {
      return;
    }

    let lintResults = spawnSync('proselint', ['-'], {
      input: <string>node,
      encoding: 'utf8'
    });

    // Apparently the spawnSync() method does not actually conform to the <Error> type
    // correctly in the returned error, making it useless under TypeScript. Instead we
    // check to see if the status code is `null`, which should be equivalent to
    // error.code === 'ENOENT'.
    if (!lintResults.status) {
      if (!noLinterWarning) {
        noLinterWarning = true;
        yield { message: "`proselint` not installed: Will skip some lints", location: path };
      }
      return;
    }

    if (typeof (lintResults.stdout) === 'string') {
      if (lintResults.stdout.trim().length !== 0) {
        yield { message: `${msg}: ${lintResults.stdout}`, location: path };
      }
    }
  },
  cleanup: function () {
    noLinterWarning = false;
  }
});
