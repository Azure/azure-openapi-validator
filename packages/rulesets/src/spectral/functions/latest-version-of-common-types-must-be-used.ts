import { commonTypesFilesAndLatestVersionMapping, checkVersionOfCommonTypeFiles } from "./utils"

export const latestVersionOfCommonTypesMustBeUsed = (ref: any, _opts: any, ctx: any) => {
  const REF_COMMON_TYPES_REGEX = new RegExp("/common-types/resource-management/v\\d+/\\w+.json#", "gi")

  if (ref !== null && !ref.match(REF_COMMON_TYPES_REGEX)) {
    return []
  }
  const errors = []
  const path = ctx.path
  const versionAndFile = ref.split("/common-types/resource-management/")[1].split("#")[0].split("/")
  if (!checkVersionOfCommonTypeFiles(versionAndFile[0], versionAndFile[1])) {
    errors.push({
      message: `Use the latest version ${commonTypesFilesAndLatestVersionMapping.get(versionAndFile[1])} of ${
        versionAndFile[1]
      } available under common-types.`,
      path: path,
    })
  }

  return errors
}
