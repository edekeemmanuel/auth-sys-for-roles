const ip = require('public-ip')
exports.serverErrorHandler = async (err, req, res, next) =>
  res.status(500).render("error", {
    errorMessage: err.message,
    stack: err.stack,
    ip: await ip.v4(),
  });

exports.notFoundErrorHandler = async (req, res, next) =>
  res.status(404).render("404", { path: req.path, method: req.method });