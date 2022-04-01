// import * as autorest from "autorest"
import { exec } from "child_process"
import * as _ from "lodash"
const jp = require('jsonpath');

function genLintingCmd(readme: string): string {
  const linterCmd = `npx autorest --v3 --azure-validator --spectral --message-format=json --openapiType=arm --use=../packages/azure-openapi-validator/autorest ${readme}`
  return linterCmd
}
function getRelativePath(issueSource: any) {
  if (issueSource.document) {
    issueSource.document = issueSource.document.substring(issueSource.document.indexOf("specification/"))
  }
  return issueSource.document + `:${issueSource?.position?.line}:${issueSource?.position?.column}`
}

function normalizeLintIssues(issues:any[]) {
 return issues.map((issue:any) => {
    if (issue.source && issue.source.length) {
      issue.source = getRelativePath(issue.source[0])
    }
    else {
      issue.source = ""
    }
    if (issue?.details?.jsonpath) {
      issue["jsonpath"] = jp.stringify(issue?.details?.jsonpath)
    }
    else {
      issue.jsonpath = ""
    }
    return _.pick(issue,["code","message","jsonpath","source"])
  }).sort((a:any, b:any) => {
    let isLess: number = 0;
    ["code","message","jsonpath","source"].some( (key:string) => {
      if (a[key] !== b[key]) {
        isLess = a[key] < b[key] ? -1 : 1
        return true
      }
      return false
    })
    if (isLess === 0) {
      isLess = a?.source?.document < b?.source?.document ? -1 : 1
    }
    return isLess
  })
}

export async function runLinter(readme: string) {
  const linterCmd = genLintingCmd(readme)
  try {
    let linterErrors = await runCmd(linterCmd)
    if (linterErrors) {
      const errors:any[] = []
      linterErrors.split('\n').forEach((line:string) => {
        if (line.indexOf('"extensionName":"@microsoft.azure/openapi-validator"') !== -1) {
          errors.push(JSON.parse(line.trim()))
        }
      })
      expect(normalizeLintIssues(errors)).toMatchSnapshot("returned results")
    } else {
      expect(linterErrors).toMatchSnapshot("returned results")
    }
  } catch (e) {
    expect(e).toMatchSnapshot("thrown exception")
  }
}

// runs the command on a given swagger spec.
async function runCmd(cmd:string) {
  const { err, stdout, stderr } = await new Promise(res =>
    exec(cmd, { encoding: "utf8", maxBuffer: 1024 * 1024 * 64 }, (err:any, stdout:any, stderr:any) => res({ err, stdout, stderr }))
  )
  if (err) {
    console.log(JSON.stringify(err))
  }
  let resultString = ""
  if (stdout.indexOf('"extensionName":"@microsoft.azure/openapi-validator"') !== -1) {
    resultString = stdout
  }
  if (stderr.indexOf('"extensionName":"@microsoft.azure/openapi-validator"') !== -1) {
    if (resultString !== "") {
      resultString += ","
    }
    resultString += stderr
  }
  return resultString
}
