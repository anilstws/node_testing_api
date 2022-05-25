const jwt = require("jsonwebtoken");
const user = require("../modals/user");

const auth = async (req, res, next) => {
  if (!req.header("Authorization")) {
    return res.status(401).send({
      message: "Unauthorised!",
    });
  }
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    const data = jwt.verify(token, process.env.jwt_secret_key);
    if (!data) {
      return res.status(400).send({
        error: true,
        message: "Invalid token!",
      });
    }
    // console.log("user", data);
    const me = await user.findById(data.id);
    // console.log("me", me);
    if (!me) {
      return res.status(404).send("User not found!");
    }
    req.me = me;
    next();
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};
module.exports = { auth };
