/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { homedir } from "os"
import { URL } from "url"
import fileUrl from "file-url"
import URI from "urijs"

// Preserve the URI handling used by https://github.com/Azure/perks/tree/main/uri.
const relativeProtocol = "relative:///"

function simplifyUri(uri: string): string {
  const url = new URL(uri, relativeProtocol)
  const pathname = url.pathname.replace(/\\/g, "/").replace(/\/\//g, "/")
  if (url.protocol.length === 2) {
    return new URL(`${url.protocol}${pathname}`).toString()
  }
  url.pathname = pathname
  return url.toString()
}

function isAbsolutePath(path: string): boolean {
  return /^([a-zA-Z]:)?(\/|\\)/.test(path)
}

export function createFileOrFolderUri(absolutePath: string): string {
  if (!isAbsolutePath(absolutePath)) {
    throw new Error(`Can only create file URIs from absolute paths. Got '${absolutePath}'`)
  }
  let result = fileUrl(absolutePath, { resolve: false })
  if (absolutePath.startsWith("//") || absolutePath.startsWith("\\\\")) {
    result = result.replace(/^file:\/\/\/\//, "file://")
  }
  return result
}

export function resolveUri(baseUri: string, pathOrUri: string): string {
  if (pathOrUri.startsWith("~/")) {
    pathOrUri = pathOrUri.replace(/^~/, homedir())
  }
  if (isAbsolutePath(pathOrUri)) {
    return createFileOrFolderUri(pathOrUri)
  }
  pathOrUri = pathOrUri.replace(/\\/g, "/")
  if (/^[a-z]+:\/\//.test(pathOrUri)) {
    return pathOrUri
  }
  if (!baseUri) {
    throw new Error("'pathOrUri' was detected to be relative so 'baseUri' is required")
  }
  try {
    const base = new URI(baseUri)
    const relative = new URI(pathOrUri)
    if (baseUri.startsWith("untitled:///") && pathOrUri.startsWith("untitled:")) {
      return pathOrUri
    }
    const result = relative.absoluteTo(base)
    if (
      base.protocol() === "https" &&
      base.hostname() === "raw.githubusercontent.com" &&
      result.protocol() === "https" &&
      result.hostname() === "raw.githubusercontent.com"
    ) {
      result.query(base.query())
    }
    return simplifyUri(result.toString())
  } catch {
    throw new Error(`Failed resolving '${pathOrUri}' against '${baseUri}'.`)
  }
}

export function toRawDataUrl(uri: string): string {
  uri = simplifyUri(uri)
  if (uri.startsWith("https://github.com/")) {
    uri = uri.replace(/^https?:\/\/(github.com)(\/[^/]+\/[^/]+\/)(blob|tree)\/(.*)$/gi, "https://raw.githubusercontent.com$2$4")
  }
  if (uri.startsWith("gist://")) {
    uri = uri.replace(/^gist:\/\/([^/]+\/[^/]+)$/gi, "https://gist.githubusercontent.com/$1/raw/")
  }
  if (uri.startsWith("https://gist.github.com/")) {
    uri = uri.replace(/^https?:\/\/gist.github.com\/([^/]+\/[^/]+)$/gi, "https://gist.githubusercontent.com/$1/raw/")
  }
  return uri.startsWith(relativeProtocol) ? uri.slice(relativeProtocol.length) : uri
}

export async function readUri(uri: string): Promise<string> {
  const { getUri } = await import("get-uri")
  const readable = await getUri(toRawDataUrl(uri))
  const chunks: Buffer[] = []
  for await (const chunk of readable) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  const result = Buffer.concat(chunks)
  const text =
    result.length > 3 && result.readUInt16LE(0) === 65533 && result.readUInt16LE(1) === 65533
      ? result.slice(2).toString("utf16le")
      : result.toString("utf8")
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
}
