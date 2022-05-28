const mongoose = require("mongoose");

const productschema = mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  category: {
    type: String,
  },
  productimg: {
    type: String,
  },
});

module.exports = mongoose.model("productdata", productschema);
