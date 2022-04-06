// import * as autorest from "autorest"
import { exec } from "child_process"
import * as _ from "lodash"
import { toMatchSnapshotForEachCode } from "./snapshot-help"

function genLintingCmd(readme: string): string {
  const linterCmd = `npx autorest ${readme} --azure-validator=true --validation --message-format=json --use=@microsoft.azure/classic-openapi-validator@latest --use=@microsoft.azure/openapi-validator@latest`
  return linterCmd
}
function getRelativePath(issuePath: string) {
  return issuePath.substring(issuePath.indexOf("specification/"))
}

function getJsonPathFromRef(jsonRef:string) {
  const index = jsonRef.indexOf(" ");
  return jsonRef.substring(index + 2,jsonRef.length -1)
}

function getSourcePathFromRef(jsonRef:string) {
  const index = jsonRef.indexOf(" ");
  return jsonRef.substring(0,index)
}

export async function runLinter(readme: string) {
  const linterCmd = genLintingCmd(readme)
  try {
    let linterErrors = await runCmd(linterCmd)
    if (linterErrors.indexOf('{\n  "type": "') !== -1) {
      linterErrors = cleanUpContent(linterErrors)
      const errorJsonStr = "[" + linterErrors + "]"
      const errorJson = JSON.parse(errorJsonStr)
        .map((issue:any) => {
          if (issue.sources) {
            issue.source =  getSourcePathFromRef(getRelativePath(issue.sources[0]))
          }
          if (issue["json-path"]) {
            issue["jsonpath"] = getJsonPathFromRef(getRelativePath(issue["json-path"]))
          }
          return _.pick(issue,["code","message","jsonpath","source"])
        }).sort((a:any, b:any) => {
          let isLess: number = 0
          ;["id", "message", "jsonpath","source"].some((key:string) => {
            if (a[key] !== b[key]) {
              isLess = a[key] < b[key] ? -1 : 1
              return true
            }
            return false
          })
          return isLess
        })
      toMatchSnapshotForEachCode(errorJson)
    } else {
      expect(linterErrors).toMatchSnapshot("returned empty results")
    }
  } catch (e) {
    expect(e).toMatchSnapshot("thrown exception")
  }
}

// runs the command on a given swagger spec.
async function runCmd(cmd:string) {
  const { err, stdout, stderr } = await new Promise(res =>
    exec(cmd, { encoding: "utf8", maxBuffer: 1024 * 1024 * 64 }, (err, stdout, stderr) => res({ err, stdout, stderr }))
  )
  let resultString = ""
  if (stdout.indexOf('{\n  "type": "') !== -1) {
    resultString = stripCharsBeforeAfterJson(stdout)
  }
  if (stderr.indexOf('{\n  "type": "') !== -1) {
    if (resultString !== "") {
      resultString += ","
    }
    resultString += stripCharsBeforeAfterJson(stderr)
  }
  if (err) {

  }
  return resultString
}

function stripCharsBeforeAfterJson(s:string) {
  let resultString = ""
  resultString = s
    .substring(s.indexOf('{\n  "type": "'))
    .trim()
    .replace(/\}\n\{/g, "},\n{")
  let reverseString1 = reverse(resultString)
  // reverse the string and trim the other side.
  if (reverseString1.indexOf("}") !== -1) {
    reverseString1 = reverseString1.substring(reverseString1.indexOf("}")).trim()
    resultString = reverse(reverseString1)
  }
  return resultString
}

function cleanUpContent(s:string) {

  const start = s.indexOf('{\n  "type": "');
  let resultString = s.substring(start)
  resultString = resultString.replace(/}\nProcessing batch task - {\"package-(.*).\n{/g, "},{")
  resultString = resultString.replace(/{"package-(.*)} .\n/, "")
  resultString = resultString.replace(/AutoRest core version selected from configuration/,"")
  resultString = resultString.replace(/\nProcessing batch task(.*)./g, "")
  resultString = resultString.replace(/}{/, "},{")
  resultString = resultString.replace(/}\n{/, "},{")
  return resultString
}

/**
 * reverse a string.
 */
function reverse(s:string) {
  return s
    .split("")
    .reverse()
    .join("")
}
