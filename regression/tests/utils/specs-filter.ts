import * as path from "path"
import glob = require("glob")
import * as _ from "lodash"

const specPaths: string[] = glob.sync(path.join(__dirname, "../../azure-rest-api-specs/specification/**/readme.md"))

export const allSpecs = specPaths.filter((p: string) => p.includes("resource-manager")).map(f => f.substring(process.cwd().length + 1))
