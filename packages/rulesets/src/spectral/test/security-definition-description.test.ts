import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("SecurityDefinitionDescription")
  return linter
})

test("SecurityDefinitionDescription should find errors", () => {
  const oasDoc = {
    swagger: "2.0",
    securityDefinitions: {
      apim_key: {
        type: "apiKey",
        name: "Ocp-Apim-Subscription-Key",
        in: "header",
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("securityDefinitions.apim_key")
  })
})

test("SecurityDefinitionDescription should find oas3 errors", () => {
  const oasDoc = {
    openapi: "3.0.0",
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("components.securitySchemes.jwt")
  })
})

test("SecurityDefinitionDescription should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    securityDefinitions: {
      apim_key: {
        type: "apiKey",
        name: "Ocp-Apim-Subscription-Key",
        in: "header",
        description: "API Key for your subscription",
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})

test("SecurityDefinitionDescription should find no oas3 errors", () => {
  const oasDoc = {
    openapi: "3.0.0",
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JSON Web Token with credentials for the service",
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
