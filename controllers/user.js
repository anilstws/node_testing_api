const user = require("../modals/user");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv/config");

const getuser = async (req, res) => {
  try {
    const alluser = await user.find();
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

const getprofile = async (req, res) => {
  console.log(req.me);
  return res.send(req.me);
};

const registeruser = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const userregister = new user(req.body);
    const saveuser = await userregister.save();
    console.log(saveuser);
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
    const data = await user.findOne({ email });
    if (!data) {
      return res.status(404).json({ error: "Invalid email" });
    }
    const matchpass = await bcrypt.compare(password, data.password);
    if (!matchpass) {
      return res.status(400).send("Invalid credentials");
    }
    const token = jwt.sign(
      { id: data._id },
      process.env.jwt_secret_key
      // { expiresIn: "1s"}
    );
    return res.send({ token, message: "Login successfully!" });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const changepassword = async (req, res) => {
  const { password, newpassword, confirmpassword } = req.body;
  try {
    if (!req.me.id) {
      return res.status(404).json({
        error: true,
        message: "user Not Found",
      });
    }
    const id = req.me.id;
    const data = await user.findById(id);

    const match = await bcrypt.compare(password, data.password);
    if (!match) {
      return res.status(400).json({
        error: true,
        message: "Invalid current password",
      });
    }
    const matchChange = await bcrypt.compare(newpassword, data.password);
    if (matchChange) {
      return res.status(400).json({
        error: true,
        message: "Change password should not be same as previous password!",
      });
    }
    if (!(newpassword == confirmpassword)) {
      return res.status(400).json({
        error: true,
        msg: "Password and Confirm Password should be same.",
      });
    }

    const hashedpassword = await bcrypt.hash(newpassword, 10);
    await user.updateOne(
      { id },
      {
        $set: { password: hashedpassword },
      }
    );
    return res.send({ message: "Password changed!" });
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const finduserbyid = async (req, res) => {
  id = req.body._id;
  try {
    const data = await user.findById(id);
    if (!data) {
      return res.status(404).send("User not found!");
    }
    return res.send(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const updateuser = async (req, res) => {
  const requpdates = Object.keys(req.body);
  const allowedchng = ["firstname", "lastname", "email", "gender", "phoneno"];
  const isvalid = requpdates.every((item) => allowedchng.includes(item));
  if (!isvalid) {
    return res.status(400).send("Invalid updates!");
  }
  try {
    requpdates.forEach((data) => (req.me[data] = req.body[data]));
    await req.me.save();
    return res.send("Updated user successfully!");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const dltuser = async (req, res) => {
  try {
    if (!req.me.id) {
      return res.send({
        error: true,
        message: "User must be logged in to delete the profile!",
      });
    }
    await user.findOneAndDelete({ owner: req.me.id });
    return res.send("User deleted successfully!");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
module.exports = {
  getuser,
  getprofile,
  registeruser,
  loginuser,
  changepassword,
  finduserbyid,
  updateuser,
  dltuser,
};
