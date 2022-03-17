import * as assert from "assert"
import { suite, test } from "mocha-typescript"
import { ArmHelper } from "../utilities/armHelper"
import { SwaggerHelper } from "../utilities/swaggerHelper"
import { getFilePath, readObjectFromFile } from "./utilities/tests-helper"

@suite
class ArmHelperTests {
  @test public async "test contain containsDiscriminator"() {
    const swagger = readObjectFromFile(getFilePath("armResource/security.json"))
    const util = new ArmHelper(swagger)
    assert.equal(util.containsDiscriminator("DataExportSettings"), true)
  }

  @test public async "test resource utils"() {
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
  }

  @test public "test get properties"() {
    const swagger = readObjectFromFile(getFilePath("armResource/test_get_properties.json"))
    const util = new SwaggerHelper(swagger, null)
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
  }
}
