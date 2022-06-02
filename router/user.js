const express = require("express");
const router = express.Router();
const {
  registerValidation,
  loginValidation,
  updateuserValidation,
  verifyuserValidation,
} = require("../utils/validation");
const { auth } = require("../middleware/auth");
const {
  registeruser,
  getuser,
  getprofile,
  loginuser,
  changepassword,
  finduserbyid,
  updateuser,
  dltuser,
  verifyuser,
} = require("../controllers/user");

router.get("/", getuser);
router.get("/me", auth, getprofile);
router.post("/register", registerValidation, registeruser);
router.post("/verify", verifyuserValidation, verifyuser);
router.post("/login", loginValidation, loginuser);
router.post("/changepassword", auth, changepassword);
router.post("/find", finduserbyid);
router.patch("/update", auth, updateuserValidation, updateuser);
router.delete("/delete", auth, dltuser);

module.exports = router;
