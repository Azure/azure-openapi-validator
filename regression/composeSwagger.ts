import * as _ from "lodash"
import * as path from "path"
import { existsSync, readdir,lstatSync ,readFileSync,writeFileSync} from "fs"
import { exec } from "child_process"
import  * as os  from "os"
const glob = require("glob")

function genLintingCmd(readme: string): string {
  const cwd = process.cwd()
  const linterCmd = `npx autorest --input-file=${readme} --message-format=json --use=${cwd}/src/typescript --openapi-type=specified`
  return linterCmd
}

export async function runLinter(readme: string) {
  const linterCmd = genLintingCmd(readme)
  try {
    let linterErrors = await runCmd(linterCmd)
    if (linterErrors.indexOf('{\n  "type": "') !== -1) {
      linterErrors = cleanUpContent(linterErrors)
      const errorJsonStr = "[" + linterErrors + "]"
      const errorJson = JSON.parse(errorJsonStr).sort((a, b) => {
        let isLess: number = 0
        ;["id", "jsonref", "message"].some(key => {
          if (a[key] !== b[key]) {
            isLess = a[key] < b[key] ? -1 : 1
            return true
          }
        })
        return isLess
      })
      console.log(JSON.stringify(errorJson,null,2))
    } else {
      console.log(`linted ${readme} end!`)
    }
  } catch (e) {
    console.log(`linting ${readme}, exception: ${e.message}`)
  }
}

// runs the command on a given swagger spec.
export async function runCmd(cmd) {
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


export function getVersionFromInputFile(filePath: string): string | undefined {
  const apiVersionRegex = /^\d{4}-\d{2}-\d{2}(|-preview)$/;
  const segments = filePath.split("/")
  if (filePath.indexOf("data-plane") !== -1) {
    if (segments && segments.length > 1) {
      for (const s of segments.entries()) {
        if (["stable","preview"].some(v => v === s[1])) {
          return  segments[s[0] + 1] || undefined
        }
      }
    }
  }
  else {
    if (segments && segments.length > 1) {
      for (const s of segments) {
        if (apiVersionRegex.test(s)) {
          return s
        }
      }
    }
  }

  return undefined
}

const repoDir = "C:/code/azure-rest-api-specs"

const specPaths: string[] = _.uniq(
  glob
    .sync(path.join(repoDir, "specification/**/resource-manager/**/*.json"), {
      ignore: ["**/examples/**/*.json", "**/quickstart-templates/*.json", "**/schema/*.json"]
    })
    .map(p =>
      p
        .split(/[\\|\/]/)
        .slice(0, -1)
        .join("/")
    )
)

const readmes: string[] = _.uniq(
  glob.sync(path.join(repoDir, "specification/**/resource-manager/**/*.json"), {
    ignore: ["**/examples/**/*.json", "**/quickstart-templates/*.json", "**/schema/*.json"]
  })
)

const dataPlaneSpecPaths: string[] = _.uniq(
  glob
    .sync(path.join(repoDir, "specification/**/data-plane/**/*.json"), {
      ignore: ["**/examples/**/*.json", "**/quickstart-templates/*.json", "**/schema/*.json"]
    })
    .map(p =>
      p
        .split(/[\\|\/]/)
        .slice(0, -1)
        .join("/")
    )
)

function generateTempReadme(inputFiles: string[], outputFile: string) {
    const template = readFileSync(path.join(__dirname, "./readme.md")).toString()
    let inputFileContent = ""
    inputFiles.forEach(f => {
      inputFileContent += '- ' + f + "\n"
    })
    const generatedReadme = template.replace("<placeholder>", inputFileContent)
    const targetReadmePath = os.tmpdir + `/readme.oad.${outputFile}.md`
    writeFileSync(targetReadmePath, generatedReadme)
    return targetReadmePath
  }

async function compose(dir:string) {
  const swaggers = glob.sync(path.join(dir, "*.json"), { absolute: true })
  const readme = generateTempReadme(swaggers,"old")
  const cmd = `npx autorest --output-artifact=swagger-document.json --output-artifact=swagger-document.map --output-file=compose-result --output-folder=${dir} ${readme}`

  if (existsSync(`${dir}/compose-result.json`)) {
    console.log(`!!Already ran for ${dir}`)
  }
  else {
    console.log(`\n Has not run for ${dir}`)
    const result = await runCmd(cmd)
    console.log(result)
  }
 
}

async function hasSubDir(dir:string) {
  let hasSubDirFlag = false
  readdir(dir, function(err, items) {
    for (var i = 0; i < items.length; i++) {
      if (items[i] !== "examples" && lstatSync(`${dir}/${items[i]}`).isDirectory()) {
         console.log(`path:${dir} has sub dir: ${items[i]}`)
         hasSubDirFlag = true
         return true 
      }
    }
  })
  return hasSubDirFlag
}



async function run() {
  for (const dir of dataPlaneSpecPaths) {
  /*  if (hasSubDir(dir)) {
      console.log("----------")
    }
    await compose(dir) */
    const version = getVersionFromInputFile(dir)
    if (!version) {
      console.log("could not get version from "+ dir)
    }
    else {
      console.log(`version:${version}, dir:${dir}`)
    }
  }
}

async function scanSwagger() {
  for (const readme of readmes) {
    const result = await runLinter(readme)
  }
}

scanSwagger()