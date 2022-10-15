import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

async function validateToken(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  let userId;

  try {
    userId = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(userId);
  } catch (error) {
    connection.query(`DELETE FROM sessions WHERE token = $1;`, [token]);
    return res.status(401).send({ error: "User not authorized" });
  }

  res.locals.loggedUser = userId;

  next();
}

// async function validateToken(req, res, next) {
//   const token = req.headers.authorization?.replace("Bearer ", "");
//   let userId;

//   try {
//     userId = jwt.verify(token, process.env.TOKEN_SECRET);
//     console.log(userId);
//   } catch (error) {
//     connection.query(`DELETE FROM sessions WHERE token = $1;`, [token]);
//     return res.status(401).send({ error: "User not authorized" });
//   }

//   try {
//     const isTokenValid = (
//       await connection.query(
//         `SELECT * FROM sessions WHERE "userId" = $1
//         AND token = $2;`,
//         [userId, token]
//       )
//     ).rows[0];
//     if (!isTokenValid) {
//       return res.status(401).send({ error: "User not authorized" });
//     }
//     res.locals.loggedUser = isTokenValid;
//     return next();
//   } catch (error) {
//     return res.status(500).send(error.message);
//   }
// }

export { validateToken };
