// A delete operation should have a 204 response.
// - except when it has a 202 response.

// given is responses of a delete operation
const delete204Response = (deleteResponses:any, _opts:any, paths:any) => {
  // operation should be a get or post operation
  if (deleteResponses === null || typeof deleteResponses !== 'object') {
    return [];
  }
  const path = paths.path || [];

  if (!deleteResponses['204'] && !deleteResponses['202']) {
    return [{
      message: 'A delete operation should have a 204 response.',
      path,
    }];
  }

  return [];
};

export default delete204Response
