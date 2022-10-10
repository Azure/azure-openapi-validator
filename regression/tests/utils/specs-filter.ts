import * as path from "path"
import glob = require("glob")
import * as _ from "lodash"

const specPaths: string[] = glob.sync(path.join(__dirname, "../../azure-rest-api-specs/specification/**/readme.md"))
const selectedRps = ["network", "compute", "monitor", "sql", "hdinsight", "resource", "storage"]
export const allSpecs = specPaths
  .filter((p: string) => p.includes("resource-manager") && selectedRps.some((rp: string) => p.includes(`specification/${rp}`)))
  .map((f) => f.substring(process.cwd().length + 1))
