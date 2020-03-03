import { suite, test } from "mocha-typescript";
import {
  getAllResourceProvidersFromPath,
  getAllWordsFromPath,
  resourceProviderMustPascalCase,
  resourceTypeMustCamelCase
} from "../rules/utilities/rules-helper";
import * as assert from "assert";

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
      "name"
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
      "VirtualWANName"
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

    assert.equal(resourceTypeMustCamelCase("Cache"), false);
    assert.equal(resourceTypeMustCamelCase(".ache"), false);
    assert.equal(resourceTypeMustCamelCase("Cach e"), false);
    assert.equal(resourceTypeMustCamelCase("Cach#e"), false);
  }
}
