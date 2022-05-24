const mongoose = require("mongoose");

const registerschema = mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  phoneno: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  gender: {
    type: String,
  },
});

module.exports = mongoose.model("registerdata", registerschema);
