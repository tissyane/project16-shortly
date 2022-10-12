import { StatusCodes } from "http-status-codes";
import { signInSchema, signUpSchema } from "../schemas/authUserSchema.js";

async function signUpSchemaValidation(req, res, next) {
  const validation = signUpSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const signUpError = validation.error.details.map(
      (detail) => detail.message
    );
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(signUpError);
  }
  next();
}

async function signInSchemaValidation(req, res, next) {
  const validation = signInSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const signInError = validation.error.details.map(
      (detail) => detail.message
    );
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(signInError);
  }
  next();
}

export { signUpSchemaValidation, signInSchemaValidation };
