const jwt =
  require("jsonwebtoken");

const adminProtect =
  (
    req,
    res,
    next
  ) => {
    try {
      const authHeader =
        req.headers
          .authorization;

      if (
        !authHeader
      ) {
        return res
          .status(401)
          .json({
            message:
              "Admin token required",
          });
      }

      const token =
        authHeader.split(
          " "
        )[1];

      const decoded =
        jwt.verify(
          token,
          process.env
            .JWT_SECRET
        );

      if (
        !decoded.admin
      ) {
        return res
          .status(403)
          .json({
            message:
              "Admin access only",
          });
      }

      next();
    } catch {
      return res
        .status(401)
        .json({
          message:
            "Invalid admin token",
        });
    }
  };

module.exports =
  adminProtect;