
import {normalizePath} from "../src/utils"
import { strictEqual } from "assert";

describe("Test utils", () => {
  test("test resolve reference",async ()=>{
    strictEqual(normalizePath("C:\\test\\a.jaon"),"file:///C:/test/a.jaon")
  });
});