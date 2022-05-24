const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
const productroute = require("./router/product");
const userroute = require("./router/user");
const path = require("path");
const ejs = require("ejs");
const auth = require("./middleware/auth");

const mongoose = require("mongoose");
require("dotenv/config");

app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/product", productroute);
app.use("/user", userroute);

app.set("view engine", "html");
app.engine("html", ejs.renderFile);
app.set("views", path.join(__dirname, "/views"));

app.get("/", auth, (req, res) => {
  res.render("./index.html");
});

//Set up default mongoose connection
mongoose.connect(
  process.env.db_link,
  { useNewUrlParser: true, useNewUrlParser: true, autoIndex: true },
  () => console.log("Connected to database.")
);

app.listen(port, () =>
  console.log(`server running on http://localhost:${port}`)
);
