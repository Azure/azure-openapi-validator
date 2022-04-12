import * as assert from "assert"
import { stringify } from "../utilities/jsonpath"
import {
  getAllResourceProvidersFromPath,
  getAllWordsFromPath,
  isValidEnum,
  resourceProviderMustPascalCase,
  resourceTypeMustCamelCase,
  transformEnum
} from "../utilities/rules-helper"

describe("RuleHelperTests" ,()=> {
 test("get all resource providers from path",()=>{
    let path = "/providers/Microsoft.Cache/xxxx/abc/providers/Microsoft.Computer"
    let res = getAllResourceProvidersFromPath(path)
    assert.deepEqual(res, ["Microsoft.Cache", "Microsoft.Computer"])

    path = "/abc/def"
    res = getAllResourceProvidersFromPath(path)
    assert.equal(res.length, 0)
  })

 test("get all words from path",()=>{
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
  })

 test("resource provider must pascal case",()=>{
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
  })

 test("resource type must camel case",()=>{
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
  })

 test("test enum helper",()=>{
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
  })

 test("regex test",()=>{
    const privateEndpointConnectionsPattern = /.*\/privateEndpointConnections$/i
    assert.equal(privateEndpointConnectionsPattern.test("Microsoft.InformationRuntime/privateEndPointConnections"), true)
    assert.equal(privateEndpointConnectionsPattern.test("Microsoft.InformationRuntime/privateEndpointconnections"), true)
  })

  test("json stringify",()=>{
    const str = stringify(["definitions","key[word]"])
    assert.strictEqual(str,"$['definitions']['key[word]']")
  })
})
