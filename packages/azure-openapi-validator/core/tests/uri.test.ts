import { strictEqual } from "assert"
import { mkdtemp, rmdir, unlink, writeFile } from "fs/promises"
import { createServer } from "http"
import { tmpdir } from "os"
import { join } from "path"
import { createFileOrFolderUri, resolveUri, toRawDataUrl } from "../src/uri"
import { defaultFileSystem } from "../src/utils"

describe("URI handling", () => {
  test("normalizes Windows and UNC paths", () => {
    strictEqual(createFileOrFolderUri("C:\\specs\\a b.json"), "file:///C:/specs/a%20b.json")
    strictEqual(createFileOrFolderUri("\\\\server\\share\\a.json"), "file://server/share/a.json")
  })

  test("preserves GitHub tokens only for references in the same raw host", () => {
    const base = "https://raw.githubusercontent.com/org/repo/main/spec.json?token=example"
    strictEqual(resolveUri(base, "../common/types.json"), "https://raw.githubusercontent.com/org/repo/common/types.json?token=example")
    strictEqual(resolveUri(base, "https://example.com/types.json"), "https://example.com/types.json")
  })

  test("converts GitHub blob and gist URLs to raw content", () => {
    strictEqual(
      toRawDataUrl("https://github.com/org/repo/blob/main/spec.json"),
      "https://raw.githubusercontent.com/org/repo/main/spec.json",
    )
    strictEqual(toRawDataUrl("gist://user/id"), "https://gist.githubusercontent.com/user/id/raw/")
  })

  test("reads local files and strips a UTF-8 BOM", async () => {
    const directory = await mkdtemp(join(tmpdir(), "validator-uri-"))
    const file = join(directory, "spec.json")
    try {
      await writeFile(file, '\ufeff{"openapi":"3.0.0"}')
      strictEqual(await defaultFileSystem.read(createFileOrFolderUri(file)), '{"openapi":"3.0.0"}')
    } finally {
      await unlink(file)
      await rmdir(directory)
    }
  })

  test("follows HTTP redirects and rejects missing documents", async () => {
    const server = createServer((request, response) => {
      if (request.url === "/redirect") {
        response.writeHead(302, { location: "/spec" }).end()
      } else if (request.url === "/spec") {
        response.end("spec contents")
      } else {
        response.writeHead(404).end()
      }
    })
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject)
      server.listen(0, "127.0.0.1", resolve)
    })
    try {
      const address = server.address()
      if (!address || typeof address === "string") {
        throw new Error("Server did not bind to a TCP port")
      }
      const base = `http://127.0.0.1:${address.port}`
      strictEqual(await defaultFileSystem.read(`${base}/redirect`), "spec contents")
      await expect(defaultFileSystem.read(`${base}/missing`)).rejects.toThrow()
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
    }
  })
})
