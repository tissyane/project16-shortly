import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { signInSchema, signUpSchema } from "../schemas/authUserSchema.js";

async function signUpValidation(req, res, next) {
  const { email } = req.body;

  const validation = signUpSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const signUpError = validation.error.details.map(
      (detail) => detail.message
    );
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(signUpError);
  }

  try {
    const registeredEmail = (
      await connection.query("SELECT * FROM users WHERE email = $1", [email])
    ).rows[0];
    if (registeredEmail) {
      return res
        .status(StatusCodes.CONFLICT)
        .send("This email is already registered");
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }

  next();
}

async function signInValidation(req, res, next) {
  const { email, password } = req.body;
  const validation = signInSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const signInError = validation.error.details.map(
      (detail) => detail.message
    );
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(signInError);
  }

  try {
    const user = (
      await connection.query("SELECT * FROM users WHERE email = $1", [email])
    ).rows[0];
    if (!user) {
      return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) {
      return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
    res.locals.user = user;
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
  next();
}

export { signUpValidation, signInValidation };
