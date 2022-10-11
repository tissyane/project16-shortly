import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import { signUpSchema } from "../schemas/signUpSchema.js";

async function signUpValidation(req, res, next) {
  const { name, email, password, confirmPassword } = req.body;

  const validation = signUpSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const signUpError = validation.error.details.map(
      (detail) => detail.message
    );
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(signUpError);
  }
  res.locals.signUpUser = req.body;
  next();
}

async function isUserValidation(req, res, next) {
  const { email } = res.locals.signUpUser;

  try {
    const registeredUser = (
      await connection.query("SELECT * FROM users WHERE email = $1", [email])
    ).rows[0];
    if (registeredUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .send("This email is already registered");
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }

  next();
}

export { signUpValidation, isUserValidation };
