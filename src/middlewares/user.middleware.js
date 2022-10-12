import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

async function checkEmail(req, res, next) {
  const { email } = req.body;
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

async function isUser(req, res, next) {
  const { email, password } = req.body;
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

async function isLoggedUser(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  try {
    const session = (
      await connection.query("SELECT * FROM sessions WHERE token = $1", [token])
    ).rows[0];

    if (!session) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    res.locals.session = session;
    next();
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}

export { checkEmail, isUser, isLoggedUser };
