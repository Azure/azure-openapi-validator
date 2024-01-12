# EvenSegmentedPathForPutOperation

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Put-V1-02

## Output Message

API path with PUT operation defined MUST have even number of segments (i.e. end in {resourceType}/{resourceName} segments).

## Description

API path with PUT operation defined MUST have even number of segments (i.e. end in {resourceType}/{resourceName} segments).

## How to fix the violation

Fix the PUT path to have an even number of path segments. The following examples show paths with even segments:

```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{ResourceName}"
```

```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.MyNameSpace/MyResourceType/{ResourceName}/NestedResourceType/{nestedResourceName}"
```

## Good Examples

```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}"
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}"
"/{resourceUri}/providers/Microsoft.Music/Songs/{songName}"
"{resourceUri}/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}"
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/providers/Microsoft.Album/Albums/{albumName}"
"/providers/Microsoft.Music/Songs/{songName}"
"/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}"
```

## Bad Examples
```json
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music"
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs"
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/Artist"
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/Artist/addArtistName"
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}/addSong"
"{resourceUri}/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}/addSong"
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Music/Songs/{songName}/providers/Microsoft.Album/Albums"
"/providers/Microsoft.Music/Songs/{songName}/Artist/{artistName}/addSong"
"/providers/Microsoft.Music/Songs"
```