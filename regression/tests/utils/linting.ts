import { exec } from "child_process"
import * as _ from "lodash"
import { toMatchSnapshotForEachCode } from "./snapshot-help"
const jp = require("jsonpath")

function genLintingCmd(readme: string): string {
  const linterCmd = `npx autorest --version=next --v3 --azure-validator --spectral --message-format=json --openapiType=arm --use=../packages/azure-openapi-validator/autorest ${readme}`
  return linterCmd
}
function getRelativePath(issueSource: any) {
  if (issueSource.document) {
    issueSource.document = issueSource.document.substring(issueSource.document.indexOf("specification/"))
  }
  const line = issueSource?.position?.line ? issueSource?.position?.line : 0
  const col = issueSource?.position?.column ? issueSource?.position?.column - 1 : 0
  return issueSource.document + `:${line}:${col}`
}

function normalizeLintIssues(issues: any[]) {
  return issues.map((issue: any) => {
    if (issue.source && issue.source.length) {
      issue.source = getRelativePath(issue.source[0])
    } else {
      issue.source = ""
    }
    if (issue?.details?.jsonpath) {
      try {
        issue["jsonpath"] = issue?.details?.jsonpath.length ? jp.stringify(issue?.details?.jsonpath) : " $"
      } catch (e) {
        issue["jsonpath"] = ""
      }
    } else {
      issue.jsonpath = ""
    }
    return _.pick(issue, ["code", "message", "jsonpath", "source"])
  })
}

export async function runLinter(readme: string) {
  const linterCmd = genLintingCmd(readme)
  try {
    const linterErrors = await runCmd(linterCmd)
    if (linterErrors) {
      const errors: any[] = []
      linterErrors.split("\n").forEach((line: string) => {
        if (line.indexOf('"extensionName":"@microsoft.azure/openapi-validator"') !== -1) {
          errors.push(JSON.parse(line.trim()))
        }
      })
      toMatchSnapshotForEachCode(normalizeLintIssues(errors))
    } else {
      expect(linterErrors).toMatchSnapshot("returned empty results")
    }
  } catch (e) {
    expect(e).toMatchSnapshot("thrown exception")
  }
}

// runs the command on a given swagger spec.
async function runCmd(cmd: string) {
  const { stdout, stderr } = await new Promise((res) =>
    exec(cmd, { encoding: "utf8", maxBuffer: 1024 * 1024 * 64 }, (err: any, stdout: any, stderr: any) => res({ stdout, stderr }))
  )
  let resultString = ""
  if (stdout.indexOf('"extensionName":"@microsoft.azure/openapi-validator"') !== -1) {
    resultString = stdout
  }
  if (stderr.indexOf('"extensionName":"@microsoft.azure/openapi-validator"') !== -1) {
    resultString += stderr
  }
  return resultString
}
