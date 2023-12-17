export const catchAsyncError = (func) => (req, res, next) =>
  Promise.resolve(func(req, res, next)).then(next);
