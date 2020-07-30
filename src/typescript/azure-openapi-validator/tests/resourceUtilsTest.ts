import * as assert from "assert"
import { readFileSync } from "fs"
import { suite, test } from "mocha-typescript"
import { ResourceUtils } from "../rules/utilities/resourceUtils"
import { getFilePath, readObjectFromFile } from "./utilities/tests-helper"

@suite
class ResourceUtilsTests {
  @test public async "test contain containsDiscriminator"() {
    const swagger = readObjectFromFile(getFilePath("armResource/security.json"))
    const util = new ResourceUtils(swagger)
    assert.equal(util.containsDiscriminator("DataExportSettings"), true)
  }

  @test public async "test resource utils"() {
    const swagger = readObjectFromFile(getFilePath("armResource/compute.json"))
    const util = new ResourceUtils(swagger)
    const allNestedResource = util.getAllNestedResources()
    const allTopLevelResource = util.getAllTopLevelResources()
    const allOfResource = util.getAllOfResources()
    const allCollectionModel = await util.getCollectionResources()
    const allCollectionInfo = util.getCollectionApiInfo()

    assert.equal(allNestedResource.size, 8)
    assert.equal(allTopLevelResource.size, 13)
    assert.equal(allOfResource.length, 41)
    assert.equal(allCollectionInfo.length, 24)
    assert.equal(allCollectionModel.size, 21)
  }
}
