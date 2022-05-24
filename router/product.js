const express = require("express");
const router = express.Router();
const multer = require("multer");
const { addproductValidation } = require("../validation/validation");
const auth = require("../middleware/auth");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const filefilter = (req, file, cb) => {
  if (file.originalname.match(/\.(jpeg|png|jpg)$/)) {
    cb(undefined, true);
  } else cb(undefined, false);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: filefilter,
});

const {
  getproduct,
  createproduct,
  findproduct,
  deleteproduct,
  updateproduct,
  updateproductwb,
  findproductwb,
  deleteproductwb,
} = require("../controllers/product");

router.get("/", auth, getproduct);

router.post(
  "/",
  auth,
  upload.single("productimg"),
  addproductValidation,
  createproduct
);

router.get("/findproduct", auth, findproductwb);

router.get("/:_id", auth, findproduct);

router.patch("/updateproduct", auth, updateproductwb);

router.patch("/:_id", auth, updateproduct);

router.delete("/deleteproduct", auth, deleteproductwb);

router.delete("/:_id", auth, deleteproduct);

module.exports = router;
