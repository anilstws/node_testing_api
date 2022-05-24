const jwt = require("jsonwebtoken");
const registerdata = require("../modals/register");

const auth = async (req, res, next) => {
  if (!req.header("Authorization")) {
    return res.status(401).send({
      message: "Unauthorised!",
    });
  }
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    const user = jwt.verify(token, process.env.jwt_secret_key);
    const me = await registerdata.findOne({ _id: user.id });
    if (!me) {
      return res.status(400).send("Authentication error!");
    }
    req.me = me;
    next();
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};
module.exports = { auth };
