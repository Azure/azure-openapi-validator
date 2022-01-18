import * as assert from "assert"
import { suite, test } from "mocha-typescript"
import { DocumentDependencyGraph } from "../depsGraph"
import { getResolvedSchemaByPath } from "../rules/utilities/rules-helper"
import { deReference, SwaggerUtils } from "../swaggerUtils"
import { getFilePath, readObjectFromFile } from "./utilities/tests-helper"

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
}
