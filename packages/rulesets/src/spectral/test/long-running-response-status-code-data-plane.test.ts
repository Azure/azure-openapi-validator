import { Spectral } from "@stoplight/spectral-core";
import linterForRule from "./utils";

let linter: Spectral;

beforeAll(async () => {
  linter = await linterForRule("LongRunningResponseStatusCodeDataPlane");
  return linter;
});

test("LongRunningResponseStatusCodeDataPlane should find errors in DELETE operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        delete: {
          "x-ms-long-running-operation": true,
          responses: {
            201: {
              description: "Success",
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join(".")).toBe("paths./api/Paths.delete");
  });
});

test("LongRunningResponseStatusCodeDataPlane should find errors in POST operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        post: {
          "x-ms-long-running-operation": true,
          responses: {
            default: {
              description: "Success",
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join(".")).toBe("paths./api/Paths.post");
  });
});

test("LongRunningResponseStatusCodeDataPlane should find errors in PUT operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          "x-ms-long-running-operation": true,
          responses: {
            204: {
              description: "Success",
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join(".")).toBe("paths./api/Paths.put");
  });
});

test("LongRunningResponseStatusCodeDataPlane should find errors in PATCH operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        patch: {
          "x-ms-long-running-operation": true,
          responses: {
            204: {
              description: "Success",
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join(".")).toBe("paths./api/Paths.patch");
  });
});

test("LongRunningResponseStatusCodeDataPlane should find no errors in DELETE operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        delete: {
          "x-ms-long-running-operation": true,
          responses: {
            200: {
              description: "Success",
            },
            202: {
              description: "Success",
            },
            204: {
              description: "Success",
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

test("LongRunningResponseStatusCodeDataPlane should find no errors in POST operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        post: {
          "x-ms-long-running-operation": true,
          responses: {
            200: {
              description: "Success",
            },
            201: {
              description: "Success",
            },
            202: {
              description: "Success",
            },
            204: {
              description: "Success",
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

test("LongRunningResponseStatusCodeDataPlane should find no errors in PUT operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          "x-ms-long-running-operation": true,
          responses: {
            200: {
              description: "Success",
            },
            201: {
              description: "Success",
            },
            202: {
              description: "Success",
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

test("LongRunningResponseStatusCodeDataPlane should find no errors in PATCH operation", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        patch: {
          "x-ms-long-running-operation": true,
          responses: {
            200: {
              description: "Success",
            },
            201: {
              description: "Success",
            },
            202: {
              description: "Success",
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});
