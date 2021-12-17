import { readFileSync } from "fs"
import yargs = require("yargs")
import { runCli } from "../azure-openapi-validator"
import { join } from "path"

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
      "$0 <path>",
      "lint for swagger ",
      cmd => {
        return cmd
          .positional("path", {
            description: "The path to the swagger file.",
            type: "string",
            demandOption: true
          })
          .option("option", {
            type: "array",
            string: true,
            describe:
              "Key/value pairs that can be passed to linter.  The format is 'key=value'.  This parameter can be used multiple times to add more options."
          })
          .option("openapiType", {
            type: "string",
            string: true,
            describe: "the openapi type"
          })
      },
      async args => {
        await runCli(args.path, { openapiType: args.openapiType })
      }
    )
    .version(getVersion())
    .demandCommand(1, "You must use one of the supported commands.").argv
}
function getVersion(): string {
  const packageJsonPath = join(__dirname, "../package.json")
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"))
  return packageJson.version
}
main()
