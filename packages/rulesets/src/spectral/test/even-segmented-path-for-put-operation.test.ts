import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("EvenSegmentedPathForPutOperation")
  return linter
})

test("PathForResourceAction should find errors for invalid path and no errors for valid path", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      //valid uri's
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      //invalid uri's
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/Artist": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/Artist/addArtistName":
        {
          put: {
            tags: ["SampleTag"],
            operationId: "Foo_CreateOrUpdate",
            description: "Test Description",
            parameters: [],
            responses: {},
          },
        },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}/addSong":
        {
          put: {
            tags: ["SampleTag"],
            operationId: "Foo_CreateOrUpdate",
            description: "Test Description",
            parameters: [],
            responses: {},
          },
        },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(5)
    expect(results[0].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music"
    )
    expect(results[1].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs"
    )
    expect(results[2].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/Artist"
    )
    expect(results[3].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/Artist/addArtistName"
    )
    expect(results[4].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}/addSong"
    )
  })
})
