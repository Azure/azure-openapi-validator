import { readFileSync } from "fs"
import yargs = require("yargs")
import { LintOptions } from "@microsoft.azure/openapi-validator-core"
import { dirname, join, normalize } from "path"
import { parseMarkdown } from "@azure-tools/openapi-tools-common"
import * as amd from "@azure/openapi-markdown"
import path = require("path")
import { safeLoad } from "js-yaml"
import { getOpenapiTypes, lint } from "@microsoft.azure/openapi-validator-core"

async function main() {
  console.log(`azure openapi linter v0.1`)

  await yargs(process.argv.slice(2))
    .scriptName("lint")
    .help()
    .strict()
    .option("debug", {
      type: "boolean",
      description: "Output debug log messages.",
      default: false
    })
    .command(
      "$0 [specs..]",
      "lint for swagger ",
      cmd => {
        return cmd
          .positional("specs", {
            description: "The paths to the swagger specs.",
            coerce(values) {
              if (Array.isArray(values) && values.length > 0) {
                return values as unknown[]
              }
            }
          })
          .option("resourceProverFolder", {
            type: "string",
            string: true,
            describe: "the folder that includes all the swagger belongs to the RP."
          })
          .option("openapiType", {
            type: "string",
            string: true,
            describe: "the openapi type"
          })
          .option("readme", {
            type: "string",
            string: true,
            describe: "the readme.md file path."
          })
          .option("tag", {
            type: "string",
            string: true,
            describe: "the readme.md file tag."
          })
          .option("option", {
            type: "array",
            string: true,
            describe:
              "Key/value pairs that can be passed to linter.  The format is 'key=value'.  This parameter can be used multiple times to add more options."
          })
      },
      async args => {
        let specs = args.specs
        const option = { openapiType: getOpenapiTypes(args.openapiType), rpFolder: args.resourceProverFolder }
        if (args.readme) {
          lintReadme(args.readme, option, args.tag)
        } else {
          lintSwaggers(specs as string[], option)
        }
      }
    )
    .version(getVersion())
    .demandCommand(1, "You must use one of the supported commands.").argv
}
export async function runCli(swaggerPaths: string[], options: LintOptions) {
  const msgs = await lint(swaggerPaths, options)
  for (const msg of msgs) {
    console.log(JSON.stringify(msg, null, 2))
  }
}

function getVersion(): string {
  const packageJsonPath = join(__dirname, "../package.json")
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"))
  return packageJson.version
}
function getReadmeTags(readme: string) {
  const readMeContent = readFileSync(readme).toString()
  const normalizedReadme = normalize(readme)
  const cmd = parseMarkdown(readMeContent)
  const defaultTag = getDefaultTag(cmd.markDown)
  const allTags = new amd.ReadMeManipulator({ error: (msg: string) => {} }, new amd.ReadMeBuilder()).getAllTags(cmd)
  const tagInputFiles = new Map<string, string[]>()
  for (const tag of allTags) {
    const inputs = getInputFiles(readMeContent, tag).map(f => path.join(dirname(normalizedReadme), f))
    tagInputFiles.set(tag, [...inputs])
  }
  return {
    tags: tagInputFiles,
    defaultTag
  }
}

function getDefaultTag(markDown): string {
  const startNode = markDown
  const codeBlockMap = amd.getCodeBlocksAndHeadings(startNode)

  const latestHeader = "Basic Information"

  const lh = codeBlockMap[latestHeader]
  if (lh) {
    const latestDefinition = safeLoad(lh.literal!) as undefined | { tag: string }
    if (latestDefinition) {
      return latestDefinition.tag
    }
  } else {
    for (let idx of Object.keys(codeBlockMap)) {
      const lh = codeBlockMap[idx]
      if (!lh.info || lh.info.trim().toLocaleLowerCase() !== "yaml") {
        continue
      }
      const latestDefinition = safeLoad(lh.literal!) as undefined | { tag: string }

      if (latestDefinition) {
        return latestDefinition.tag
      }
    }
  }
  return ""
}

function getInputFiles(readMeContent: string, tag: string) {
  const cmd = parseMarkdown(readMeContent)
  return amd.getInputFilesForTag(cmd.markDown, tag)
}

export async function lintSwaggers(specs: string[], options: LintOptions) {
  return runCli(specs, options)
}

export async function lintReadme(readme: string, options: LintOptions, tag?: string) {
  const readmeTag = getReadmeTags(readme)
  const usedTag = tag || readmeTag.defaultTag
  if (usedTag) {
    const specs = readmeTag.tags.get(usedTag)
    return runCli(specs, options)
  }
}

main()
