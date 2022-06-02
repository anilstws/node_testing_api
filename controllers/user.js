const user = require("../modals/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendmail } = require("../utils/sendmail");
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
    req.body.otp = Math.floor(100000 + Math.random() * 900000);
    const userregister = new user(req.body);
    const saveuser = await userregister.save();
    const message = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Node Testing API</a>
      </div>
      <p style="font-size:1.1em">Hi ${req.body.firstname},</p>
      <p>Thank you for registering at our app. To start exploring our app and our products, please login with the following OTP. </p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${req.body.otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />Node Testing API</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Node Testing API</p>
      </div>
    </div>
  </div>`;
    const sendingmail = await sendmail({
      to: "atulc.tws@gmail.com",
      subject: "Verification email | Node Testing API",
      html: message,
    });

    return res.status(201).send({
      message: "Registered successfully and OTP has been sent to your email!",
      data: saveuser,
    });
  } catch (err) {
    if (err.message.includes("email")) {
      return res
        .status(501)
        .send({ error: true, message: "Email has not been sent!" });
    }
    return res.status(400).send({ error: true, message: err.message });
  }
};

const verifyuser = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const data = await user.findOne({ email });
    if (!data) {
      return res.status(404).json({ error: "User not found!" });
    }
    if (otp != data.otp) {
      return res.status(400).send({
        error: true,
        message: "Invalid otp!",
      });
    }
    data.isVerified = true;
    data.otp = "";
    await data.save();
    return res.send({
      error: false,
      message: "User verified!",
    });
  } catch (err) {
    return res.status(501).send({
      error: true,
      message: err.message,
    });
  }
};
const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await user.findOne({ email });
    if (!data) {
      return res.status(404).json({ error: "User not found!" });
    }
    if (data.isVerified === false) {
      return res.status(400).send({
        error: true,
        message: "User is not verified!",
      });
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
  verifyuser,
  loginuser,
  changepassword,
  finduserbyid,
  updateuser,
  dltuser,
};
