const registerdata = require("../modals/register");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}
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
  const password = await bcrypt.hash(req.body.password, 10);
  const userregister = new registerdata({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender,
    email: req.body.email,
    phoneno: req.body.phoneno,
    password: password,
  });
  userregister
    .save()
    .then(() => {
      res.status(200).send(` user registered`);
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
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
  const { email, password } = req.body;
  const user = await registerdata.findOne({ email }).lean();
  if (!user) {
    res.status(404).json({ error: "Invalid email" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.jwt_secret_key
      // {
      //   expiresIn: "1s",
      // }
    );
    localStorage.setItem("token", token);
    res.render("./index.html");
  } else {
    res.status(404).json({ error: "Invalid email/password" });
  }
};

const changepassword = async (req, res) => {
  const password = req.body.password;
  const token = localStorage.getItem("token");
  try {
    const user = jwt.verify(token, process.env.jwt_secret_key);
    const _id = user.id;
    const hashedpassword = await bcrypt.hash(password, 10);
    await registerdata.updateOne(
      { _id },
      {
        $set: { password: hashedpassword },
      }
    );
  } catch (err) {
    res.json({ message: error });
  }

  res.send({ message: "ok" });
};

module.exports = {
  getuser,
  registeruser,
  loginuser,
  changepassword,
};
