import * as assert from "assert"
import { group } from "console"
import { suite, test } from "mocha-typescript"
import { dirname } from "path"
import { DocumentDependencyGraph } from "../depsGraph"
import { ResourceUtils } from "../rules/utilities/resourceUtils"
import { SwaggerUtils } from "../swaggerUtils"
import { getFilePath, readObjectFromFile } from "./utilities/tests-helper"

@suite
class SwaggerUtilsTests {
  @test public async "resolve partial schema"() {
    const filePath = getFilePath("references/external.json")
    const graph = new DocumentDependencyGraph()
    const openapiDefinitionObject = (await graph.loadDocument(filePath)).getObj()    
    const swggerUtils = new SwaggerUtils(openapiDefinitionObject,filePath,graph)
    let resolvedSchema = await swggerUtils.getResolvedSchema(openapiDefinitionObject.paths["/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/applicationGateways/{applicationGatewayName}/listKeys"].post.parameters[0]) as any
    assert.strictEqual(resolvedSchema.name, "subscriptionId")
    resolvedSchema = await swggerUtils.getResolvedSchema(dirname(filePath) + "/common.json#/parameters/ApiVersion")
    assert.strictEqual(resolvedSchema.name, "api-version")
    
  }

  
}
