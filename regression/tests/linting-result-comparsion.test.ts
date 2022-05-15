import { readFileSync } from "fs"
import { allIssues, getLintResult } from "./utils/snapshot-help"

allIssues.splice(0,allIssues.length)

describe("comparing", () => {
  const v2Results = getLintResult("v2")
  const v3Results = getLintResult("v3")

  test.each(v3Results.filter(f => !f.includes("az-")))("%s should match v2",(v3File:string)=> {
     const v2File = v3File.replace("v3","v2")
      const isExists = v2Results.includes(v2File)
      expect(isExists).toEqual(true)
      const v3Result = JSON.parse(readFileSync(v3File).toString())
      const v2Result = JSON.parse(readFileSync(v2File).toString())
      expect(v3Result.length).toEqual(v2Results.length)
      expect(v3Result).toStrictEqual(v2Result)
  },1000000)
})
