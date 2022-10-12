import joi from "joi";

const signUpSchema = joi.object({
  name: joi.string().empty().required(),
  email: joi.string().email().empty().required(),
  password: joi.string().min(6).empty().required(),
  confirmPassword: joi.ref("password"),
});

const signInSchema = joi.object({
  email: joi.string().email().empty().required(),
  password: joi.string().min(6).empty().required(),
});

export { signUpSchema, signInSchema };
