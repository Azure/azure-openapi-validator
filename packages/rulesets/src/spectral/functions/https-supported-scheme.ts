//Verifies whether specification supports HTTPS scheme or not.
const httpsSupportedScheme = (scheme:any, _opts:any, paths:any) => {
    if(scheme == null || typeof scheme !== "object")
        return [];
    const schemeArray: string[] = scheme;
    if(schemeArray[0] === "https" && schemeArray.length === 1)
        return [];
    const path = paths.path || [];
    return [{
        message: 'Azure Resource Management only supports HTTPS scheme.',
        path,
    }];
};

export default httpsSupportedScheme
