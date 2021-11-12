const { info, error, success } = require("consola");
module.exports = async (req, res, next) => {
    if (!req.user.isAdmin) {
      error({ message: "only admin are allowed", badge: true });
      return res.status(401).json({ ok: false, message: "only admins are  allowed" });
    }
    info({message: 'admin access granted...', badge: true})
    success({message: 'processing dashboard...', badge: true})
    next();
};
