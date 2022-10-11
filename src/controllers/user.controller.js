import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

async function createUser(req, res) {
  const { name, email, password } = res.locals.signUpUser;
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

export { createUser };
