import glob = require("glob")
import * as _ from "lodash"
import * as path from "path"

const specPaths: string[] = glob.sync(path.join(__dirname, "azure-rest-api-specs/specification/**/readme.md"))

export const allSpecs = specPaths.filter((p: string) => p.includes("resource-manager"))
