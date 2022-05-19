import * as assert from "assert"
import { SwaggerInventory } from "@microsoft.azure/openapi-validator-core"
import { crawlReference } from "../utilities/ref-helper"
import { getResolvedSchemaByPath } from "../utilities/rules-helper"
import { SwaggerHelper } from "../utilities/swagger-helper"
import { getFilePath } from "./utilities/tests-helper"

describe("SwaggerHelperTests", () => {
  test("resolve partial schema", async () => {
    const filePath = getFilePath("references/external.json")
    const inventory = new SwaggerInventory()
    const openapiDefinitionObject = (await inventory.loadDocument(filePath)).getObj()
    const comonFilePath = getFilePath("references/common.json")
    const commonDoc = await inventory.loadDocument(comonFilePath)
    const swaggerHelper = new SwaggerHelper(openapiDefinitionObject, filePath, inventory)
    const resolvedSchema = (await swaggerHelper.resolveSchema(openapiDefinitionObject.paths["/foo"].post)) as any
    assert.strictEqual(resolvedSchema.parameters[0].name, "subscriptionId")
    const position = commonDoc.getPositionFromJsonPath(["definitions", "a", "allOf", "0"])

    assert.ok(!!position.start.line)
  })

  test("external reference", async () => {
    const inventory = new SwaggerInventory()
    const specPath = getFilePath("armResource/externalRef.json")
    const swagger = await (await inventory.loadDocument(specPath)).getObj()
    const util = new SwaggerHelper(swagger, undefined, inventory)
    const schema = getResolvedSchemaByPath(
      ["paths", "/providers/Microsoft.MachineLearning/operations", "get", "responses", "default", "schema"],
      specPath,
      inventory
    )?.value

    const resolvedSchema = crawlReference(swagger, schema, inventory)
    assert.strictEqual(!!resolvedSchema.properties, true)

    const errorObject = util.getProperty(resolvedSchema, "error")
    assert.strictEqual(!!errorObject, false)
  })

  test("circular reference", async () => {
    const inventory = new SwaggerInventory()
    const swagger = await (await inventory.loadDocument(getFilePath("references/external.json"))).getObj()
    const util = new SwaggerHelper(swagger, undefined, inventory)
    const resolved = await util.resolveSchema(swagger)
    assert.strictEqual(!!resolved.paths["/foo"].post.responses.default.schema.properties, true)
  })
})
