import { existsSync, mkdirSync, readFileSync, rmdirSync } from "fs"
import _ from "lodash"
import { basename, join } from "path"
import { allIssues, getLintResult, writeLintingResult } from "./utils/snapshot-help"

allIssues.splice(0, allIssues.length)

describe("comparing", () => {
  const v2Results = getLintResult("v2")
  const v3Results = getLintResult("v3")
  const resultDir = join(__dirname, "__linting_result__", "diff")
  if (existsSync(resultDir)) {
    rmdirSync(resultDir, { recursive: true })
  }
  mkdirSync(resultDir)
  const verifiedLists = [
    "MissingTypeObject",
    "AllResourcesMustHaveGetOperation",
    "DeleteOperationResponses",
    "GetCollectionResponseSchema",
    "IntegerTypeMustHaveFormat",
    "OperationsApiResponseSchema",
    "PageableOperation",
    "ParametersOrder",
    "PrivateEndpointResourceSchemaValidation",
    "UniqueXmsExample",
    "RequiredReadOnlySystemData",
  ]
  test.each(v3Results.filter((f) => !f.includes("az-") && !verifiedLists.includes(basename(f.replace(".json", "")))))(
    "%s should match v2",
    (v3File: string) => {
      const v2File = v3File.replace("v3", "v2")
      const isExists = v2Results.includes(v2File)
      if (!isExists) {
        return
      }
      const v3Result = JSON.parse(readFileSync(v3File).toString())
      const v2Result = JSON.parse(readFileSync(v2File).toString())
      const compare = (base: any, to: any) => {
        return base.jsonpath === to.jsonpath && base.message === to.message
      }

      const common = v2Result.filter((base: any) => v3Result.find((re: any) => compare(base, re)))
      const v2Only = v2Result.filter((base: any) => !common.find((re: any) => compare(base, re)))
      const v3Only = v3Result.filter((base: any) => !common.find((re: any) => compare(base, re)))

      writeLintingResult({ common, v2Only, v3Only }, basename(v3File, ".json"), "diff")
      expect(v2Only).toEqual([])
    },
    1000000
  )
})
