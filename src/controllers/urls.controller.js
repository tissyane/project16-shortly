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

async function getUrlbyId(req, res) {
  const { id } = req.params;

  try {
    const url = (
      await connection.query(
        `SELECT id, "shortUrl", url FROM urls WHERE id = $1;`,
        [id]
      )
    ).rows[0];

    if (!url) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).send(url);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}

export { shortenUrl, getUrlbyId };
