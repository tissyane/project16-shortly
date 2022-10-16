import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

async function validateUser(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  let userId;

  try {
    userId = jwt.verify(token, process.env.TOKEN_SECRET).userId;
  } catch (error) {
    connection.query(`DELETE FROM sessions WHERE token = $1;`, [token]);
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  try {
    const user = (
      await connection.query(`SELECT * FROM users WHERE id = $1;`, [userId])
    ).rows[0];
    if (!user) {
      return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const isTokenValid = (
      await connection.query(
        `SELECT * FROM sessions WHERE "userId" = $1 AND token = $2 AND valid = TRUE;`,
        [userId, token]
      )
    ).rows[0];

    if (!isTokenValid) {
      return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
    res.locals.loggedUser = isTokenValid;
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }

  next();
}

export { validateUser };
