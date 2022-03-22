// import * as autorest from "autorest"
import { exec } from "child_process"

function genLintingCmd(readme: string): string {
  const linterCmd = `npx autorest --v3 --azure-validator --spectral --openapiType=arm --use=../packages/azure-openapi-validator/autorest ${readme}`
  return linterCmd
}
function getRelativePath(issueSource: any) {
  if (issueSource.document) {
    issueSource.document = issueSource.document.substring(issueSource.document.indexOf("specification/"))
  }
  return issueSource
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
      errors.sort((a:any, b:any) => {
          let isLess: number = 0;
          ["code","message",].some( (key:string) => {
            if (a[key] !== b[key]) {
              isLess = a[key] < b[key] ? -1 : 1
              return true
            }
            return false
          })
          return isLess
        })
        .map((issue:any) => {
          if (issue.sources) {
            issue.source = issue.source.map((s:any) => getRelativePath(s))
          }
          if (issue["json-path"]) {
            issue["json-path"] = getRelativePath(issue["json-path"])
          }
          return issue
        })
      expect(errors).toMatchSnapshot("returned results")
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
