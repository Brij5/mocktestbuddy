console.log('[DEBUG_ASYNC_HANDLER] Top of asyncHandler.js');
// Simple asyncHandler utility to wrap async route handlers and catch errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
console.log('[DEBUG_ASYNC_HANDLER] End of asyncHandler.js');