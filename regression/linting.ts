// import * as autorest from "autorest"
import { exec, execSync, fork, spawnSync } from "child_process"
import * as lodash from "lodash"
import md5File = require("md5-file")
import path = require("path")
import { LinterIssue, LinterIssueSeverity } from "./lintTypes"

function genLintingCmd(readme: string): string {
  const cwd = process.cwd()
  const linterCmd = `npx autorest ${readme} --azure-validator=true --validation --message-format=json --use=${cwd}/src/typescript --use=${cwd}/src/dotnet/AutoRest`
  return linterCmd
}

export async function runLinter(readme: string) {
  const linterCmd = genLintingCmd(readme)
  try {
    let linterErrors = await runCmd(linterCmd)
    if (linterErrors.indexOf('{\n  "type": "') !== -1) {
      linterErrors = cleanUpContent(linterErrors)
      const errorJsonStr = "[" + linterErrors + "]"
      const errorJson = JSON.parse(errorJsonStr).sort()
      expect(errorJson).toMatchSnapshot("returned results")
    } else {
      expect(linterErrors).toMatchSnapshot("returned results")
    }
  } catch (e) {
    expect(e).toMatchSnapshot("thrown exception")
  }
}

/*

function configPathUri(configPath: string): string | undefined {
  if (!configPath) {
    return undefined
  }
  const cwd = process.cwd()
  return `file:///${cwd}/${configPath}`.replace(/\\/g, "/")
}


export async function warmAutoRest() {
  const corePath = path.dirname(require.resolve("@microsoft.azure/autorest-core/package.json"))
  await autorest.initialize(corePath)
}

export const runLinterLib = async (readme: string) => {
  const cwd = process.cwd()
  const configPath: string | undefined = configPathUri(readme)
  const autorestExecutor: autorest.AutoRest = await autorest.create(undefined, configPath)
  autorestExecutor.AddConfiguration({
    "azure-validator": true,
    NoOaiConverter: true,
    "use-extension": {
      "@microsoft.azure/openapi-validator": `${cwd}/src/typescript`,
      "@microsoft.azure/classic-openapi-validator": `${cwd}/src/dotnet/AutoRest`
    }
  })
  return await executeLint(autorestExecutor, readme)
}
*/

/*
const isExceptionError = (message: autorest.Message) => {
  const isConfigError =
    (message.Source && message.Source.some(filePath => filePath.document.toLowerCase().endsWith("readme.md"))) || !message.Details
  const isSchemaError = message.Plugin === "schema-validator"

  return isConfigError || isSchemaError
}
const executeLint = async (autorestExecutor: autorest.AutoRest, modelPath?: string) => {
  const linterIssues: LinterIssue[] = []
  autorestExecutor.Message.Subscribe((sender, message) => {
    if (message.Channel === autorest.Channel.Error || message.Channel === autorest.Channel.Warning) {
      console.log(message)
      if (isExceptionError(message)) {
        console.log(message)
      } else {
        const li: LinterIssue = {
          id: message.Details.id,
          code: message.Details.code,
          message: message.Details.message,
          validationCategory: message.Details.validationCategory!,
          source: message.Details.source,
          severity: message.Channel.toString().toLowerCase() as LinterIssueSeverity,
          issueType: "LinterIssue"
        }
        linterIssues.push(li)
      }
    }
  })

  const result = await autorestExecutor.Process().finish
  if (result === true) {
    return linterIssues
  } else if (result === false) {
    // we get here on invalid syntax in the readme config so it is "expected" exception
    // don't emit a metric
  } else {
    return undefined
  }
} */

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

function reverse(s) {
  return s
    .split("")
    .reverse()
    .join("")
}
