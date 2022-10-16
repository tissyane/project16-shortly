import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";

async function validateUrl(req, res, next) {
  const { id, shortUrl } = req.params;
  try {
    const url = (
      await connection.query(
        `SELECT * FROM urls WHERE id = $1 OR "shortUrl" = $2;`,
        [id, shortUrl]
      )
    ).rows[0];

    if (!url) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }
    res.locals.url = url;
    return next();
  } catch (error) {
    return serverError(res, error);
  }
}

export { validateUrl };
