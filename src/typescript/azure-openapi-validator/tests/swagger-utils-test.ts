import * as assert from "assert"
import { getResolvedSchemaByPath } from "../rules/utilities/rules-helper"
import { deReference, SwaggerUtils } from "../swaggerUtils"
import { suite, test } from "mocha-typescript"
import { DocumentDependencyGraph } from "../depsGraph"
import { getFilePath, readObjectFromFile } from "./utilities/tests-helper"
import { dirname } from "path"

@suite
class SwaggerUtilsTests {
  @test public async "external reference"() {
    const graph = new DocumentDependencyGraph()
    const swagger = await (await graph.loadDocument(getFilePath("armResource/externalRef.json"))).getObj()
    const util = new SwaggerUtils(swagger, null, graph)
    const schema = getResolvedSchemaByPath(
      swagger,
      ["paths", "/providers/Microsoft.MachineLearning/operations", "get", "responses", "default", "schema"],
      graph
    )
    const resolvedSchema = deReference(swagger, schema, graph)
    assert.strictEqual(!!resolvedSchema.properties, true)

    const errorObject = util.getPropertyOfModel(resolvedSchema, "error")
    assert.strictEqual(!!errorObject, true)
  }

  @test public "test get properties"() {
    const swagger = readObjectFromFile(getFilePath("armResource/test_get_properties.json"))
    const util = new SwaggerUtils(swagger, null, null)
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
  @test public async "resolve partial schema"() {
    const filePath = getFilePath("references/external.json")
    const graph = new DocumentDependencyGraph()
    const openapiDefinitionObject = (await graph.loadDocument(filePath)).getObj()
    const comonFilePath = getFilePath("references/common.json")
    const commonDoc = await graph.loadDocument(comonFilePath)
    const swggerUtils = new SwaggerUtils(openapiDefinitionObject, filePath, graph)
    let resolvedSchema = (await swggerUtils.getResolvedSchema(
      openapiDefinitionObject.paths[
        "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/applicationGateways/{applicationGatewayName}/listKeys"
      ].post.parameters[0]
    )) as any
    assert.strictEqual(resolvedSchema.name, "subscriptionId")
    resolvedSchema = await swggerUtils.getResolvedSchema(dirname(filePath) + "/common.json#/parameters/ApiVersion")
    assert.strictEqual(resolvedSchema.name, "api-version")

    const position = commonDoc.getPositionFromJsonPath(["definitions", "a", "allOf", "0"])

    assert.ok(!!position.line)
  }
}
