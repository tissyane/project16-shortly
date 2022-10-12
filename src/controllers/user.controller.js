import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

async function createUser(req, res) {
  const { name, email, password } = req.body;
  const encryptedPassword = bcrypt.hashSync(password, 10);

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

export { createUser, logIn };
