// send 404 if no other route matched
const notFound = (req, res, next) => {
    const err = new Error(`The page you're looking for can't be found`);
    err.status = 404;
    next(err);
  };

  // setup a global error handler
  const globalErrorHandler = (err, req, res, next) => {
    // default to 500 server error
    res.status(err.status || 500).json({
      message: err.message,
      error: {},
    });
  };

  module.exports = { notFound, globalErrorHandler };
