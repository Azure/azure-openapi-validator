import * as assert from "assert"
import { SwaggerInventory } from "@microsoft.azure/openapi-validator-core"
import { ArmHelper } from "../utilities/arm-helper"
import { getFilePath } from "./utilities/tests-helper"

describe("ArmHelperTests", () => {
  test("contain containsDiscriminator", async () => {
    const inventory = new SwaggerInventory()
    const specPath = getFilePath("armResource/security.json")
    const swagger = await (await inventory.loadDocument(specPath)).getObj()
    const util = new ArmHelper(swagger, specPath, inventory)
    assert.equal(util.containsDiscriminator("DataExportSettings"), true)
  })

  test("resource utils", async () => {
    const specPath = getFilePath("armResource/compute.json")
    const inventory = new SwaggerInventory()

    const swagger = await (await inventory.loadDocument(specPath)).getObj()
    const util = new ArmHelper(swagger, specPath, inventory)
    const allNestedResource = util.getAllNestedResources()
    const allTopLevelResource = util.getTopLevelResourceNames()
    const allCollectionModel = await util.getCollectionResources()
    const allCollectionInfo = util.getCollectionApiInfo()

    assert.equal(allNestedResource.length, 8)
    assert.equal(allTopLevelResource.length, 21)
    assert.equal(allCollectionInfo.length, 23)
    assert.equal(allCollectionModel.size, 21)
  })
})
