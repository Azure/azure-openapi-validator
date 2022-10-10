// Check a response to ensure it has a specific header.
// Comparison must be done case-insensitively since that is the HTTP rule.

const hasHeader = (response:any, opts:any, paths:any) => {
  if (response === null || typeof response !== 'object') {
    return [];
  }

  // opts must contain the name of the header to check for
  if (opts === null || typeof opts !== 'object' || !opts.name) {
    return [];
  }

  const path = paths.path || [];

  const hasHeader = Object.keys(response.headers || {})
    .some((name) => name.toLowerCase() === opts.name.toLowerCase());

  if (!hasHeader) {
    return [
      {
        message: `Response should include an "${opts.name}" response header.`,
        path: [...path, 'headers'],
      },
    ];
  }

  return [];
};

export default hasHeader