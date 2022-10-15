import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

async function validateToken(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  let userId;

  try {
    userId = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (error) {
    connection.query(`DELETE FROM sessions WHERE token = $1;`, [token]);
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  res.locals.loggedUser = userId;

  next();
}

export { validateToken };
