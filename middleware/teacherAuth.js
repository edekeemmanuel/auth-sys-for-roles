const { info, error, success } = require("consola");
module.exports = async (req, res, next) => {
  if (!req.user.isTeacher) {
    error({ message: "only teachers are allowed", badge: true });
    return res.status(401).json({
      ok: false,
      message: "only teachers have access to perform operation",
    });
  }
  info({ message: "teacher access granted...", badge: true });
  next();
};
