import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import { nanoid } from "nanoid";

async function shortenUrl(req, res) {
  const { url } = req.body;
  const { userId } = res.locals.loggedUser;

  const shortUrl = nanoid(8);

  try {
    await connection.query(
      `INSERT INTO urls ("userId", "shortUrl", url) 
        VALUES ($1, $2, $3);`,
      [userId, shortUrl, url]
    );
    res.status(StatusCodes.CREATED).send({ shortUrl });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}

export { shortenUrl };
