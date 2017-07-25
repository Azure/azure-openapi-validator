/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MergeStates, OpenApiTypes, rules } from '../rule';
export const LintDescriptionProse: string = "LintDescriptionProse";

const jp = require('jsonpath');
import { spawnSync } from 'child_process';

var noLinterWarning = false;

rules.push({
  id: "D4100",
  name: LintDescriptionProse,
  severity: "warning",
  category: "DocViolation",
  mergeState: MergeStates.composed,
  openapiType: OpenApiTypes.doc,
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
