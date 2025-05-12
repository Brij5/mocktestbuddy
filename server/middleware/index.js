// Export all middleware from a single entry point
import * as auth from './auth/index.js';
import * as error from './error/index.js';
import * as validation from './validation/index.js';

// Export all middleware as named exports
export { auth, error, validation };

// Export all middleware as default export
const middleware = {
  ...auth,
  ...error,
  ...validation,
};

export default middleware;
