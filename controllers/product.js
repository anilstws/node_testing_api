const productdata = require("../modals/product");

const getproduct = async (req, res) => {
  try {
    const allproduct = await productdata.find();
    res.status(200).json({
      error: false,
      message: "All Category Shown!",
      data: allproduct,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: "An error occured category shown!",
    });
  }
};

const createproduct = async (req, res) => {
  try {
    if (!req.file) {
      productimg = null;
    } else {
      productimg = req.file.path;
    }
    const newproduct = new productdata({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      category: req.body.category,
      productimg: productimg,
    });
    newproduct.save().then(() => {
      res.status(200).send({
        message: `Product with the name ${newproduct.firstname} added to the Database`,
      });
    });
  } catch (error) {
    res.status(404).send(err.message);
  }
};

const findproduct = async (req, res) => {
  try {
    const foundproduct = await productdata.findById(req.params);
    res.json(foundproduct);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

const findproductwb = async (req, res) => {
  try {
    const foundproduct = await productdata.findById(req.body._id);
    res.json(foundproduct);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

const deleteproduct = async (req, res) => {
  try {
    dltproduct = await productdata.findByIdAndDelete(req.params);
    res.json({
      message: "Deleted!",
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
};
const deleteproductwb = async (req, res) => {
  try {
    await productdata.findByIdAndDelete(req.body._id);
    res.status(200).json({
      message: "Deleted!",
    });
  } catch (err) {
    res.json({ message: err });
  }
};

const updateproduct = async (req, res) => {
  try {
    var newdata = {};
    newdata.firstname = req.body.firstname;
    newdata.lastname = req.body.lastname;
    newdata.category = req.body.category;
    const upproduct = await productdata.findByIdAndUpdate(req.params, newdata, {
      new: true,
    });
    if (!upproduct) {
      return res.status(404).send("Product not found!");
    }
    res.send(`Product with the id ${req.params._id} has been updated.`);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const updateproductwb = async (req, res) => {
  try {
    var newdata = {};
    newdata.firstname = req.body.firstname;
    newdata.lastname = req.body.lastname;
    newdata.category = req.body.category;
    const upproduct = await productdata.findByIdAndUpdate(
      req.body._id,
      newdata,
      {
        new: true,
      }
    );
    if (!upproduct) {
      return res.status(404).send("Product not found!");
    }
    res.send(`Product with the id ${req.body._id} has been updated.`);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
module.exports = {
  getproduct,
  createproduct,
  findproduct,
  deleteproduct,
  updateproduct,
  updateproductwb,
  findproductwb,
  deleteproductwb,
};
