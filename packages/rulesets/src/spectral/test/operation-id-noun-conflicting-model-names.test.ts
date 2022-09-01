import {Spectral} from "@stoplight/spectral-core";
import linterForRule from "./utils";

let linter: Spectral;

beforeAll(async () => {
  linter = await linterForRule("OperationIdNounConflictingModelNames");
  return linter;
});

test("OperationIdNounConflictingModelNames should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        get: {
          operationId: "Paths_listPaths",
          responses: {
            "200": {
              description: "Success",
            },
          },
        },
      },
    },
    definitions: {
      Paths: {
        type: "string",
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join(".")).toBe("paths./api/Paths.get.operationId");
  });
});
