const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const token = localStorage.getItem("token");
    const user = jwt.verify(token, process.env.jwt_secret_key);
    next();
  } catch (error) {
    res.status(404).send({ message: error });
  }
};
module.exports = auth;
