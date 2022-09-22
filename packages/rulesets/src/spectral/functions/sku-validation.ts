// Check a sku model to ensure it must have a name property. It can also have 'tier', 'size', 'family', 'capacity' as optional properties.

import { getProperties } from "./utils";

const skuValidation = (skuSchema:any, opts:any, paths:any) => {
  if (skuSchema === null || typeof skuSchema !== 'object') {
    return [];
  }

  const path = paths.path || [];
  const errors = []
  const propertiesRegEx = /^(NAME|TIER|SIZE|FAMILY|CAPACITY)$/i
  const properties = getProperties(skuSchema)
  const message = {
      message: `A Sku model must have 'name' property. It can also have 'tier', 'size', 'family', 'capacity' as optional properties.`,
      path,
    }
  if (!properties) {
    errors.push(message)
    return errors
  }
  if (!Object.keys(properties).includes('name')) {
    errors.push(message)
    return errors
  }
  for (const prop of Object.entries(properties)) {
    if (!propertiesRegEx.test(prop[0])) {
      errors.push(message)
      break;
    }
    if (prop[0].toLowerCase() === "name"){
      if ((prop[1] as any ).type !== "string") {
        errors.push(message)
      }
    }
  }
  return errors;
};

export default skuValidation