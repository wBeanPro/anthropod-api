const jwt = require("jsonwebtoken");
const { restart } = require("nodemon");

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) return res.status(403).send({ message: "No Token provided!" });

  // verift jwt token
  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    console.log(token);
    if (err) {
      console.log(err);
      return res
        .status(401)
        .send({ isSuccess: false, message: "Unauthorized!" });
    }
    req.userId = decode.id;
    next();
  });
};

const tokenRefresh = (req, res, next) => {
  let refreshToken = req.body.refreshToken;

  if (refreshToken) {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decode) => {
      if (err)
        return res.status(500).send({ message: "Something went wrong!" });

      const token = generateAccessToken(decode.id);
      const refreshToken = generateRefreshToken(decode.id);

      req.token = token;
      req.refreshToken = refreshToken;
    });
  } else {
    res.status(401).send({ message: "Invalid token!" });
  }
  next();
};

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  tokenRefresh,
};
