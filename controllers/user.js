const registerdata = require("../modals/register");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv/config");

const getuser = async (req, res) => {
  try {
    const alluser = await registerdata.find();
    return res.json({
      error: false,
      message: "All user Shown!",
      data: alluser,
    });
  } catch {
    res.status(404).json({
      error: true,
      message: "An error occured !",
    });
  }
};

const registeruser = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const userregister = new registerdata(req.body);
    const user = await userregister.save();
    console.log(user);
    return res.status(201).send({ message: "user registered", data: user });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "externaluser.tws@gmail.com",
//     pass: "exterTWSnal%%$$23",
//   },
// });

// const options = {
//   from: "externaluser.tws@gmail.com",
//   to: "ddraupadi95@gmail.com",
//   subject: "sending email with nodeJs",
//   text: "Lorem ipsum dolor sit.",
// };
// transporter.sendMail(options, function (err, info) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log("sent" + info.response);
// });

const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await registerdata.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Invalid email" });
    }
    const matchpass = await bcrypt.compare(password, user.password);
    if (!matchpass) {
      return res.status(400).send("Invalid credentials");
    }
    const token = jwt.sign(
      { id: user._id },
      process.env.jwt_secret_key
      // { expiresIn: "1s"}
    );
    return res.send({ token, message: "Login successfully!" });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const changepassword = async (req, res) => {
  const password = req.body.password;
  try {
    const id = req.me.id;
    const hashedpassword = await bcrypt.hash(password, 10);
    await registerdata.updateOne(
      { id },
      {
        $set: { password: hashedpassword },
      }
    );
    return res.send({ message: "ok" });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

module.exports = {
  getuser,
  registeruser,
  loginuser,
  changepassword,
};
