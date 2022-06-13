//This rule appears if in the patch body parameters have properties which is marked as required or x-ms-mutibility:["create"] or have default

import { getProperties, getRequiredProperties } from "./utils";

const pathBodyParameters = (parameters:any, _opts:any, paths:any) => {
  if (parameters === null || parameters.schema === undefined || parameters.in !== "body") {
    return [];
  }
  const path = paths.path || [];

  const properties: object = getProperties(parameters.schema);
  const requiredProperties = getRequiredProperties(parameters.schema)
  const errors = []
  for (const prop of Object.keys(properties)) 
  {
    if (properties[prop].default) {
      errors.push({
        message: `Properties of a PATCH request body must not have default value, property:${prop}.`,
        path: [...path,"schema"]
      })
    }
    if (requiredProperties.includes(prop)) {
      errors.push({
        message: `Properties of a PATCH request body must not be required, property:${prop}.`,
        path: [...path,"schema"]
      })
    }
    const xmsMutability = properties[prop]['x-ms-mutability']
    if (xmsMutability && xmsMutability.length === 1 && xmsMutability[0] === "create") {
      errors.push({
        message: `Properties of a PATCH request body must not be x-ms-mutability: ["create"], property:${prop}.`,
        path: [...path,"schema"]
      })
    }
  }
  return errors
};

export default pathBodyParameters
