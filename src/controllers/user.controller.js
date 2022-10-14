import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

async function createUser(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  const encryptedPassword = bcrypt.hashSync(password, 10);

  if (password !== confirmPassword || !confirmPassword) {
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .send({ error: "Please confirm your password" });
  }

  try {
    await connection.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3);",
      [name, email, encryptedPassword]
    );
    res.sendStatus(StatusCodes.CREATED);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}

async function logIn(req, res) {
  const user = res.locals.user;

  try {
    const checkSession = (
      await connection.query('SELECT * FROM sessions WHERE "userId" = $1', [
        user.id,
      ])
    ).rows[0];

    if (checkSession) {
      res.status(StatusCodes.OK).send({ token: checkSession.token });
    } else {
      const token = uuid();

      await connection.query(
        'INSERT INTO sessions ("userId", token) VALUES ($1, $2);',
        [user.id, token]
      );
      res.status(StatusCodes.OK).send({ token: token });
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}

async function deleteSession(req, res) {
  const { token } = res.locals.session;

  try {
    await connection.query("DELETE FROM sessions WHERE token = $1", [token]);
    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}

export { createUser, logIn, deleteSession };
