import yargs = require("yargs")
import { runCli } from "../azure-openapi-validator"

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
      "lint <path>",
      "lint swagger",
      cmd => {
        return cmd
          .positional("path", {
            description: "The path to the main.cadl file or directory containing main.cadl.",
            type: "string",
            demandOption: true
          })
          .option("option", {
            type: "array",
            string: true,
            describe:
              "Key/value pairs that can be passed to Cadl components.  The format is 'key=value'.  This parameter can be used multiple times to add more options."
          })
          .option("mergeState", {
            type: "string",
            string: true,
            describe: "the merge state"
          })
          .option("openapiType", {
            type: "string",
            string: true,
            describe: "the merge state"
          })
      },
      async args => {
        await runCli(args.path, { mergeState: args.mergeState as any, openapiType: args.openapiType as any })
      }
    )
}
