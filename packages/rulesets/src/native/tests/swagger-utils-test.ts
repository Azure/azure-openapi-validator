import * as assert from "assert"
import { getResolvedSchemaByPath } from "../utilities/rules-helper"
import { SwaggerHelper } from "../utilities/swagger-helper"
import { crwalReference } from "../utilities/ref-helper"
import { SwaggerInventory } from "@microsoft.azure/openapi-validator-core"
import { getFilePath, readObjectFromFile } from "./utilities/tests-helper"
const fileUrl = (absPath: string) => {
  return "file:///" + absPath.replace(/^\//, "").split("\\").join("/")
}
describe("SwaggerHelperTests",()=> {
   test("resolve partial schema",async ()=>{
    const filePath = getFilePath("references/external.json")
    const inventory = new SwaggerInventory()
    const openapiDefinitionObject = (await inventory.loadDocument(filePath)).getObj()
    const comonFilePath = getFilePath("references/common.json")
    const commonDoc = await inventory.loadDocument(comonFilePath)
    const swaggerHelper = new SwaggerHelper(openapiDefinitionObject, filePath, inventory)
    let resolvedSchema = (await swaggerHelper.resolveSchema(
      openapiDefinitionObject.paths[
        "/foo"
      ].post
    )) as any
    assert.strictEqual(resolvedSchema.parameters[0].name, "subscriptionId")
    resolvedSchema = await swaggerHelper.resolveSchema(fileUrl(comonFilePath) + "#/parameters/ApiVersion")
    assert.strictEqual(resolvedSchema.name, "api-version")
    const position = commonDoc.getPositionFromJsonPath(["definitions", "a", "allOf", "0"])

    assert.ok(!!position.start.line)
  })

  test("external reference",async ()=>{
    const inventory = new SwaggerInventory()
    const swagger = await (await inventory.loadDocument(getFilePath("armResource/externalRef.json"))).getObj()
    const util = new SwaggerHelper(swagger, undefined, inventory)
    const schema = getResolvedSchemaByPath(
      swagger,
      ["paths", "/providers/Microsoft.MachineLearning/operations", "get", "responses", "default", "schema"],
      inventory
    )
    const resolvedSchema = crwalReference(swagger, schema, inventory)
    assert.strictEqual(!!resolvedSchema.properties, true)

    const errorObject = util.getPropertyOfModel(resolvedSchema, "error")
    assert.strictEqual(!!errorObject, false)
  })

   test("circular reference",async ()=>{
    const inventory = new SwaggerInventory()
    const swagger = await (await inventory.loadDocument(getFilePath("references/external.json"))).getObj()
    const util = new SwaggerHelper(swagger, undefined, inventory)
    const resolved = await util.resolveSchema(swagger)
    assert.strictEqual(!!resolved.paths["/foo"].post.responses.default.schema.$ref, true)
  })

  test("test get properties",()=>{
    const swagger = readObjectFromFile(getFilePath("armResource/test_get_properties.json"))
    const util = new SwaggerHelper(swagger, undefined, undefined)
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
