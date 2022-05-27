const express = require("express");
const app = express();
const productroute = require("./router/product");
const userroute = require("./router/user");
const path = require("path");
const ejs = require("ejs");
const { auth } = require("./middleware/auth");
require("dotenv/config");

const mongoose = require("mongoose");

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/product", productroute);
app.use("/user", userroute);

app.set("view engine", "html");
app.engine("html", ejs.renderFile);
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
  res.render("./index.html");
});

//Set up default mongoose connection
mongoose.connect(
  process.env.db_link,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // autoIndex: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  },
  () => console.log("Connected to database.")
);

app.listen(process.env.port, () =>
  console.log(`server running on http://localhost:${process.env.port}`)
);
