import * as assert from "assert"
import { readFileSync } from "fs"
import { suite, test } from "mocha-typescript"
import { resolveNestedSchema } from "../rules/utilities/resolveNestedSchema"
import {
  getAllResourceProvidersFromPath,
  getAllWordsFromPath,
  getResolvedJson,
  getResolvedResponseSchema,
  isValidEnum,
  resourceProviderMustPascalCase,
  resourceTypeMustCamelCase,
  transformEnum
} from "../rules/utilities/rules-helper"

@suite
class RuleHelperTests {
  @test public "get all resource providers from path"() {
    let path = "/providers/Microsoft.Cache/xxxx/abc/providers/Microsoft.Computer"
    let res = getAllResourceProvidersFromPath(path)
    assert.deepEqual(res, ["Microsoft.Cache", "Microsoft.Computer"])

    path = "/abc/def"
    res = getAllResourceProvidersFromPath(path)
    assert.equal(res.length, 0)
  }

  @test public "get all words from path"() {
    let path = "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.cache/redis/{name}"

    let res = getAllWordsFromPath(path)
    assert.deepEqual(res, [
      "subscriptions",
      "subscriptionId",
      "resourceGroups",
      "resourceGroupName",
      "providers",
      "Microsoft.cache",
      "redis",
      "name"
    ])

    path = "////&^*/@/"
    res = getAllWordsFromPath(path)
    assert.equal(res.length, 0)

    path = "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualWans/{VirtualWANName}"
    res = getAllWordsFromPath(path)
    assert.deepEqual(res, [
      "subscriptions",
      "subscriptionId",
      "resourceGroups",
      "resourceGroupName",
      "providers",
      "Microsoft.Network",
      "virtualWans",
      "VirtualWANName"
    ])
  }

  @test public "resource provider must pascal case"() {
    assert.equal(resourceProviderMustPascalCase("Microsoft.Network"), true)
    assert.equal(resourceProviderMustPascalCase("Microsoft.HDInsight"), true)
    assert.equal(resourceProviderMustPascalCase("Microsoft.Computer"), true)
    assert.equal(resourceProviderMustPascalCase("Azure.Network101"), true)
    assert.equal(resourceProviderMustPascalCase("Azure.Net1work"), true)
    assert.equal(resourceProviderMustPascalCase("Microsoft.HDInsightDB.Admin"), true)
    assert.equal(resourceProviderMustPascalCase("Microsoft.DBForMariaDB"), true)
    assert.equal(resourceProviderMustPascalCase("Microsoft.CosmosDB"), true)
    assert.equal(resourceProviderMustPascalCase("Microsoft.WindowsIoT"), true)

    assert.equal(resourceProviderMustPascalCase("Microsoft."), false)
    assert.equal(resourceProviderMustPascalCase("Microsoft"), false)
    assert.equal(resourceProviderMustPascalCase("Azure"), false)
    assert.equal(resourceProviderMustPascalCase("Microsoft.cache"), false)
    assert.equal(resourceProviderMustPascalCase("microsoft.Visual"), false)
    assert.equal(resourceProviderMustPascalCase("Microsoft.HDDInsightDB"), false)
    assert.equal(resourceProviderMustPascalCase("Microsoft.SQL"), false)
  }

  @test public "resource type must camel case"() {
    assert.equal(resourceTypeMustCamelCase("cache"), true)
    assert.equal(resourceTypeMustCamelCase("deepEqual"), true)
    assert.equal(resourceTypeMustCamelCase("azureHDInsight"), true)
    assert.equal(resourceTypeMustCamelCase("azureHDInsight101"), true)
    assert.equal(resourceTypeMustCamelCase("az101ureHDInsight"), true)
    assert.equal(resourceTypeMustCamelCase("signalR"), true)

    assert.equal(resourceTypeMustCamelCase("Cache"), false)
    assert.equal(resourceTypeMustCamelCase(".ache"), false)
    assert.equal(resourceTypeMustCamelCase("Cach e"), false)
    assert.equal(resourceTypeMustCamelCase("Cach#e"), false)
  }

  @test public async "resolve nested schema object"() {
    const jsoncontent: string = readFileSync("./src/typescript/azure-openapi-validator/tests/resources/NestedSchema.json", {
      encoding: "utf-8"
    })
    const json = JSON.parse(jsoncontent)
    const resolveReferenceJson: any = await getResolvedJson(json)

    let resolvedResponse = await getResolvedResponseSchema(resolveReferenceJson.definitions.ErrorResponse)
    const expectResponse = {
      error: {
        readOnly: true,
        code: {
          type: "string",
          readOnly: true,
          description: "The error code."
        },
        message: {
          type: "string",
          readOnly: true,
          description: "The error message."
        }
      },
      description: "The key vault error exception."
    }
    assert.deepEqual(resolvedResponse, expectResponse)

    resolvedResponse = await resolveNestedSchema(resolveReferenceJson.definitions.Error1)
    const expectErrorKeys = ["message", "innererror"]
    assert.deepEqual(Object.keys(resolvedResponse), expectErrorKeys)
  }

  @test public async "resolve nested schema object with properties property"() {
    const jsoncontent: string = readFileSync("./src/typescript/azure-openapi-validator/tests/resources/NestedSchema1.json", {
      encoding: "utf-8"
    })
    const json = JSON.parse(jsoncontent)
    const resolveReferenceJson: any = await getResolvedJson(json)

    let resolvedResponse = await getResolvedResponseSchema(resolveReferenceJson.definitions.ErrorResponse)
    const expectResponse = {
      code: {
        type: "string",
        readOnly: true,
        description: "The error code."
      },
      message: {
        type: "string",
        readOnly: true,
        description: "The error message."
      },
      properties: {
        details: {
          type: "string",
          readOnly: true,
          description: "The error code."
        }
      },
      description: "ErrorRespone"
    }
    assert.deepEqual(resolvedResponse, expectResponse)

    resolvedResponse = await resolveNestedSchema(resolveReferenceJson.definitions.Error1)
    const expectErrorKeys = ["message", "innererror"]
    assert.deepEqual(Object.keys(resolvedResponse), expectErrorKeys)
  }

  @test public "test enum helper"() {
    let enumA = `{
        "description": "The provisioning state of the configuration store.",
        "enum": [
            "Creating",
            "Updating",
            "Canceled"
        ],
        "type": "object",
        "readOnly": true,
        "x-ms-enum": {
            "name": "ProvisioningState",
            "modelAsString": true
        }
    }`
    assert.equal(isValidEnum(JSON.parse(enumA)), false)
    enumA = `{
        "description": "Test Enum",
        "enum": [
            "Creating",
            "Updating",
            "Canceled"
        ],
        "type": "integer",
        "readOnly": true,
        "x-ms-enum": {
            "name": "ProvisioningState",
            "modelAsString": true
        }
    }`
    assert.equal(isValidEnum(JSON.parse(enumA)), true)
    enumA = `{
        "description": "Test Enum",
        "enum": [
            true,
            false
        ],
        "type": "boolean",
        "readOnly": true,
        "x-ms-enum": {
            "name": "ProvisioningState",
            "modelAsString": true
        }
    }`
    const enumObj = JSON.parse(enumA)
    assert.deepEqual(transformEnum(enumObj.type, enumObj.enum), ["true", "false"])
    enumA = `{
        "description": "Test Enum",
        "enum": [
            1,
            2
        ],
        "type": "integer",
        "readOnly": true,
        "x-ms-enum": {
            "name": "ProvisioningState",
            "modelAsString": true
        }
    }`
    const enumObj1 = JSON.parse(enumA)
    assert.deepEqual(transformEnum(enumObj1.type, enumObj1.enum), ["1", "2"])
  }

  @test public async "resolve json"() {
    const jsoncontent: string = readFileSync("./src/typescript/azure-openapi-validator/tests/resources/utilities/exception.json", {
      encoding: "utf-8"
    })
    const json = JSON.parse(jsoncontent)
    const resolveReferenceJson: any = await getResolvedJson(json)
    assert.equal(!!resolveReferenceJson, true)
  }


  @test public "regex test"() {
    const privateEndpointConnectionsPattern = /.*\/privateEndpointConnections$/i
    assert.equal(privateEndpointConnectionsPattern.test('Microsoft.InformationRuntime/privateEndPointConnections'),true)
    assert.equal(privateEndpointConnectionsPattern.test("Microsoft.InformationRuntime/privateEndpointconnections"), true)
  }
}
