exports.catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res).catch(next);
  };
};
const errorForDevelopment = (err, res) => {
  if (err.operational)
    res.status(err.statusCode || 500).json({
      message: err.message,
      status: err.status,
      operational: err.operational,
      stack: err.stack,
    });
};
const errorForProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status || "failed",
      message: "break down with the server will get back to you soon",
    });
  }
};
exports.errorController = (err, req, res, next) => {
  if (process.env.NODE_ENV === "Development")
    return errorForDevelopment(err, res);
  if (process.env.NODE_ENV === "Production")
    return errorForProduction(err, res);
};
