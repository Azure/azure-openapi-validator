import * as assert from "assert"
import { ArmHelper } from "../utilities/arm-helper"
import { SwaggerHelper } from "../utilities/swagger-helper"
import { getFilePath, readObjectFromFile } from "./utilities/tests-helper"

describe("ArmHelperTests",()=> {
  test("test contain containsDiscriminator",async ()=>{
    const swagger = readObjectFromFile(getFilePath("armResource/security.json"))
    const util = new ArmHelper(swagger)
    assert.equal(util.containsDiscriminator("DataExportSettings"), true)
  })

  test("test resource utils",async ()=>{
    const swagger = readObjectFromFile(getFilePath("armResource/compute.json"))
    const util = new ArmHelper(swagger)
    const allNestedResource = util.getAllNestedResources()
    const allTopLevelResource = util.getAllTopLevelResources()
    const allOfResource = util.getAllResourcesFromDefinitions()
    const allCollectionModel = await util.getCollectionResources()
    const allCollectionInfo = util.getCollectionApiInfo()

    assert.equal(allNestedResource.size, 8)
    assert.equal(allTopLevelResource.size, 13)
    assert.equal(allOfResource.length, 41)
    assert.equal(allCollectionInfo.length, 22)
    assert.equal(allCollectionModel.size, 21)
  })

 test("test get properties",async ()=>{
    const swagger = readObjectFromFile(getFilePath("armResource/test_get_properties.json"))
    const util = new SwaggerHelper(swagger, undefined)
    const bar = util.getDefinitionByName("A")
    assert.deepEqual(
      {
        type: "string",
        description: "p1"
      },
      util.getPropertyOfModel(bar, "p1")
    )
    const foo = util.getDefinitionByName("B")
    assert.deepEqual(
      {
        description: "a ref"
      },
      util.getPropertyOfModel(foo, "display")
    )
  })
})
