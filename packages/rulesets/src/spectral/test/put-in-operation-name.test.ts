import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
    linter = await linterForRule("PutInOperationName")
    return linter
})

test("PutInOperationName should find errors", () => {
    const myOpenApiDocument = {
        "swagger": "2.0",
        "paths": {
            "/api/Paths": {
                "put": {
                    "operationId": "Noun_NotNamedPut",
                    "responses": {
                        "default": {
                            "description": "Unexpected error"
                        }
                    }
                }
            }
        }
    }
    return linter.run(myOpenApiDocument).then((results) => {
        expect(results.length).toBe(1)
        expect(results[0].path.join(".")).toBe("paths./api/Paths.put.operationId")
    })
})
