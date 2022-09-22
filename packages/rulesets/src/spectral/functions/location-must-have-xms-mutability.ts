//A tracked resource's location property must have the x-ms-mutability properties set as read, create.
const locationMustHaveXmsMutability = (scheme:any, _opts:any, paths:any) => {
    if(scheme == null || typeof scheme !== "object")
        return [];
    if(scheme["x-ms-mutability"] !== undefined && Array.isArray(scheme["x-ms-mutability"])) {
        const schemeArray: string[] = scheme["x-ms-mutability"];
        if(schemeArray.includes("create") && schemeArray.includes("read"))
            return [];
    }
    const path = paths.path || [];
    return [{
        message: 'Property \'location\' must have \'\\"x-ms-mutability\\":[\\"read\\", \\"create\\"]\' extension defined.',
        path,
    }];
};

export default locationMustHaveXmsMutability
