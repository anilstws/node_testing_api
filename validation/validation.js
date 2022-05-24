const joi = require("Joi");

const registerValidation = async (req, res, next) => {
  const schema = joi.object({
    firstname: joi.string().max(50).required(),
    lastname: joi.string().max(50).required(),
    gender: joi.string().valid("m", "f", "t").required(),
    email: joi.string().email().required(),
    phoneno: joi
      .string()
      .min(10)
      .message("Invalid mobile no .")
      .max(10)
      .message("Invalid mobile no.")
      .required(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,50}$"))
      .required(),
  });
  const value = await schema.validate(req.body);
  if (value.error) {
    res.json({
      success: 0,
      message: value.error.details[0].message,
    });
  } else next();
};

const loginValidation = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });
  const value = await schema.validate(req.body);
  if (value.error) {
    return res.json({
      success: 0,
      message: value.error.details[0].message,
    });
  } else next();
};

const addproductValidation = async (req, res, next) => {
  const schema = joi.object({
    firstname: joi.string().max(50).required(),
    lastname: joi.string().max(50).required(),
    category: joi.string().required(),
    productimg: joi.string(),
  });
  const value = await schema.validate(req.body);
  if (value.error) {
    res.json({
      success: 0,
      message: value.error.details[0].message,
    });
  } else next();
};

module.exports = {
  registerValidation,
  loginValidation,
  addproductValidation,
};
