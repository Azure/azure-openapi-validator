import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("EvenSegmentedPathForPutOperation")
  return linter
})

test("EvenSegmentedPathForPutOperation should find errors for invalid paths", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
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
      "{resourceUri}/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}/addSong": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/{resourceUri}/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}/addSong": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/providers/Microsoft.Album/Albums":
        {
          put: {
            tags: ["SampleTag"],
            operationId: "Foo_CreateOrUpdate",
            description: "Test Description",
            parameters: [],
            responses: {},
          },
        },
      "/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}/addSong": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/providers/Microsoft.Music/Songs": {
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
    expect(results.length).toBe(10)
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
    expect(results[5].path.join(".")).toBe("paths.{resourceUri}/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}/addSong")
    expect(results[6].path.join(".")).toBe("paths./{resourceUri}/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}/addSong")
    expect(results[7].path.join(".")).toBe(
      "paths./subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/providers/Microsoft.Album/Albums"
    )
    expect(results[8].path.join(".")).toBe("paths./providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}/addSong")
    expect(results[9].path.join(".")).toBe("paths./providers/Microsoft.Music/Songs")
  })
})

test("PathForResourceAction should not find errors for valid path", () => {
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
      "/{resourceUri}/providers/Microsoft.Music/Songs/{songName}": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "{resourceUri}/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/providers/Microsoft.Album/Albums/{albumName}":
        {
          put: {
            tags: ["SampleTag"],
            operationId: "Foo_CreateOrUpdate",
            description: "Test Description",
            parameters: [],
            responses: {},
          },
        },
      "/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}": {
        put: {
          tags: ["SampleTag"],
          operationId: "Foo_CreateOrUpdate",
          description: "Test Description",
          parameters: [],
          responses: {},
        },
      },
      "/providers/Microsoft.Music/Songs/{songName}": {
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
    expect(results.length).toBe(0)
  })
})
