const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECERETE, (err, decode) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Auth Failed",
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Authorization Failed",
    });
  }
};
