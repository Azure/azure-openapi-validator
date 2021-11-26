// import * as autorest from "autorest"
import { exec } from "child_process"

function genLintingCmd(readme: string): string {
  const cwd = process.cwd()
  const linterCmd = `npx autorest ${readme} --azure-validator=true --validation --message-format=json --use=${cwd}/src/typescript --use=${cwd}/src/dotnet/AutoRest`
  return linterCmd
}
function getRelativePath(issuePath: string) {
  return issuePath.substring(issuePath.indexOf("specification/"))
}

export async function runLinter(readme: string) {
  const linterCmd = genLintingCmd(readme)
  try {
    let linterErrors = await runCmd(linterCmd)
    if (linterErrors.indexOf('{\n  "type": "') !== -1) {
      linterErrors = cleanUpContent(linterErrors)
      const errorJsonStr = "[" + linterErrors + "]"
      const errorJson = JSON.parse(errorJsonStr)
        .sort((a, b) => {
          let isLess: number = 0
          ;["id", "jsonref", "message"].some(key => {
            if (a[key] !== b[key]) {
              isLess = a[key] < b[key] ? -1 : 1
              return true
            }
          })
          return isLess
        })
        .map(issue => {
          if (issue.sources) {
            issue.sources = issue.sources.map(s => getRelativePath(s))
          }
          if (issue.jsonref) {
            issue.jsonref = getRelativePath(issue.jsonref)
          }
          if (issue["json-path"]) {
            issue["json-path"] = getRelativePath(issue["json-path"])
          }
          return issue
        })
      expect(errorJson).toMatchSnapshot("returned results")
    } else {
      expect(linterErrors).toMatchSnapshot("returned results")
    }
  } catch (e) {
    expect(e).toMatchSnapshot("thrown exception")
  }
}

// runs the command on a given swagger spec.
async function runCmd(cmd) {
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
  return resultString
}

function stripCharsBeforeAfterJson(s) {
  let resultString = ""
  resultString = s
    .substring(s.indexOf("{"))
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

function cleanUpContent(s) {
  let resultString = s.replace(/}\nProcessing batch task - {\"package-(.*).\n{/g, "},{")
  resultString = resultString.replace(/{"package-(.*)} .\n/, "")
  resultString = resultString.replace(/\nProcessing batch task(.*)./g, "")
  resultString = resultString.replace(/}{/, "},{")
  resultString = resultString.replace(/}\n{/, "},{")
  return resultString
}

/**
 * reverse a string.
 */
function reverse(s) {
  return s
    .split("")
    .reverse()
    .join("")
}
