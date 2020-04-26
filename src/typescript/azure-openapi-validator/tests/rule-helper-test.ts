import { suite, test } from "mocha-typescript";
import {
  getAllResourceProvidersFromPath,
  getAllWordsFromPath,
  resourceProviderMustPascalCase,
  resourceTypeMustCamelCase,
  getResolvedResponseSchema,
  getResolvedJson
} from "../rules/utilities/rules-helper";
import { resolveNestedSchema } from "../rules/utilities/resolveNestedSchema"
import * as assert from "assert";
import { readFileSync } from "fs";

@suite
class RuleHelperTests {
  @test "get all resource providers from path"() {
    let path =
      "/providers/Microsoft.Cache/xxxx/abc/providers/Microsoft.Computer";
    let res = getAllResourceProvidersFromPath(path);
    assert.deepEqual(res, ["Microsoft.Cache", "Microsoft.Computer"]);

    path = "/abc/def";
    res = getAllResourceProvidersFromPath(path);
    assert.equal(res.length, 0);
  }

  @test "get all words from path"() {
    let path =
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.cache/redis/{name}";

    let res = getAllWordsFromPath(path);
    assert.deepEqual(res, [
      "subscriptions",
      "subscriptionId",
      "resourceGroups",
      "resourceGroupName",
      "providers",
      "Microsoft.cache",
      "redis",
      "name",
    ]);

    path = "////&^*/@/";
    res = getAllWordsFromPath(path);
    assert.equal(res.length, 0);

    path =
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualWans/{VirtualWANName}";
    res = getAllWordsFromPath(path);
    assert.deepEqual(res, [
      "subscriptions",
      "subscriptionId",
      "resourceGroups",
      "resourceGroupName",
      "providers",
      "Microsoft.Network",
      "virtualWans",
      "VirtualWANName",
    ]);
  }

  @test "resource provider must pascal case"() {
    assert.equal(resourceProviderMustPascalCase("Microsoft.Network"), true);
    assert.equal(resourceProviderMustPascalCase("Microsoft.HDInsight"), true);
    assert.equal(resourceProviderMustPascalCase("Microsoft.Computer"), true);
    assert.equal(resourceProviderMustPascalCase("Azure.Network101"), true);
    assert.equal(resourceProviderMustPascalCase("Azure.Net1work"), true);

    assert.equal(resourceProviderMustPascalCase("Microsoft."), false);
    assert.equal(resourceProviderMustPascalCase("Microsoft"), false);
    assert.equal(resourceProviderMustPascalCase("Azure"), false);
    assert.equal(resourceProviderMustPascalCase("Microsoft.cache"), false);
    assert.equal(resourceProviderMustPascalCase("microsoft.Visual"), false);
  }

  @test "resource type must camel case"() {
    assert.equal(resourceTypeMustCamelCase("cache"), true);
    assert.equal(resourceTypeMustCamelCase("deepEqual"), true);
    assert.equal(resourceTypeMustCamelCase("azureHDInsight"), true);
    assert.equal(resourceTypeMustCamelCase("azureHDInsight101"), true);
    assert.equal(resourceTypeMustCamelCase("az101ureHDInsight"), true);
    assert.equal(resourceTypeMustCamelCase("signalR"), true);

    assert.equal(resourceTypeMustCamelCase("Cache"), false);
    assert.equal(resourceTypeMustCamelCase(".ache"), false);
    assert.equal(resourceTypeMustCamelCase("Cach e"), false);
    assert.equal(resourceTypeMustCamelCase("Cach#e"), false);
  }

  @test async "resolve nested schema object"() {
    const jsoncontent: string = readFileSync("./src/typescript/azure-openapi-validator/tests/resources/NestedSchema.json", { encoding: "utf-8" })
    const json = JSON.parse(jsoncontent)
    const resolveReferenceJson: any = await getResolvedJson(json)

    let resolvedResponse = await getResolvedResponseSchema(resolveReferenceJson.definitions.ErrorResponse)
    const expectResponse = {
      "error": {
        "readOnly": true,
        "code": {
          "type": "string",
          "readOnly": true,
          "description": "The error code."
        },
        "message": {
          "type": "string",
          "readOnly": true,
          "description": "The error message."
        }
      },
      "description": "The key vault error exception."
    }
    assert.deepEqual(resolvedResponse, expectResponse)

    resolvedResponse = await resolveNestedSchema(resolveReferenceJson.definitions.Error1)
    const expectErrorKeys = ["message", "innererror"]
    assert.deepEqual(Object.keys(resolvedResponse), expectErrorKeys)
  }
}
