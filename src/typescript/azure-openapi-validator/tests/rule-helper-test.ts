import { suite, test } from "mocha-typescript";
import {
  getAllResourceProvidersFromPath,
  getAllWordsFromPath
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
  }
}
