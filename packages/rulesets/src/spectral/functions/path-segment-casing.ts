
// _opts has a property 'segments' as string[] to specify the segment names to check for 
export const pathSegmentCasing = (apiPaths:any, _opts:any, paths: any) => {
  if (apiPaths === null || typeof apiPaths !== 'object') {
    return [];
  }

  if (!_opts || !_opts.segments || !Array.isArray(_opts.segments)) {
    return []
  }
  const segments = _opts.segments
  const path = paths.path || [];

  const errors:any[] = [];
  for (const apiPath of Object.keys(apiPaths)) {
    segments.forEach((seg:string) => {
      const idx = apiPath.toLowerCase().indexOf( "/" + seg.toLowerCase())
      if (idx !== -1) {
        const originalSegment = apiPath.substring(idx + 1,idx + seg.length + 1)
        if (originalSegment !== seg){
          errors.push({
            message: `The path segment ${originalSegment} should be ${seg}.`,
            path: [...path,apiPath]
          })
        }
      }
    })
  }

  return errors;
};

export default pathSegmentCasing
