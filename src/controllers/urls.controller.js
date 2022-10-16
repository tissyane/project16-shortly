import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";
import { nanoid } from "nanoid";

async function shortenUrl(req, res) {
  const { url } = req.body;
  const { userId } = res.locals?.loggedUser;
  const shortUrl = nanoid(8);

  try {
    const duplicated = (
      await connection.query(
        `SELECT * FROM urls WHERE url = $1 AND "userId" = $2;`,
        [url, userId]
      )
    ).rows[0];

    if (duplicated) {
      return res
        .status(StatusCodes.CONFLICT)
        .send("You've shortened this URL before, look into your account ;)");
    }

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
  const url = res.locals?.url;
  delete url.userId;
  delete url.visitCount;
  delete url.createdAt;

  return res.status(StatusCodes.OK).send(url);
}

async function openUrl(req, res) {
  const url = res.locals?.url;

  try {
    await connection.query(
      `UPDATE urls SET "visitCount" = "visitCount"+1 WHERE "shortUrl" =  $1;`,
      [url.shortUrl]
    );

    res.redirect(url.url);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}

async function deleteUrl(req, res) {
  const url = res.locals?.url;
  const { userId } = res.locals?.loggedUser;

  if (url.userId !== userId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send("You are not allowed to delete this URL");
  }

  try {
    await connection.query(`DELETE FROM urls WHERE id = $1;`, [url.id]);
    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}

export { shortenUrl, getUrlbyId, openUrl, deleteUrl };
