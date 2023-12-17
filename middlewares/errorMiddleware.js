export const errorMiddleware = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Server error";
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    name: err.name,
  });
};
