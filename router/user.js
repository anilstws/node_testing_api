const express = require("express");
const router = express.Router();
const {
  registerValidation,
  loginValidation,
} = require("../validation/validation");
const auth = require("../middleware/auth");
const {
  registeruser,
  getuser,
  loginuser,
  changepassword,
} = require("../controllers/user");

router.get("/", getuser);

router.post("/userregister", registerValidation, registeruser);

router.post("/userlogin", loginValidation, loginuser);

router.post("/changepassword", auth, changepassword);

// router.get("/finduser", finduserwb);

// router.get("/:_id", finduser);

// router.delete("/:_id", deleteuser);

// router.delete("/deleteuser", deleteuserwb);

// router.patch("/:_id", updateuser);

// router.patch("/updateuser", updateuserwb);

module.exports = router;
