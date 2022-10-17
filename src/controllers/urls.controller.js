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

    const urlId = (
      await connection.query(`SELECT * FROM urls WHERE url = $1;`, [url])
    ).rows[0];

    await connection.query(
      `INSERT INTO visits ("urlId") 
        VALUES ($1);`,
      [urlId.id]
    );
    res.status(StatusCodes.CREATED).send({ shortUrl });
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getUrlbyId(req, res) {
  const url = res.locals?.url;
  delete url.userId;
  delete url.createdAt;

  return res.status(StatusCodes.OK).send(url);
}

async function openUrl(req, res) {
  const url = res.locals?.url;

  try {
    await connection.query(
      `UPDATE visits SET views = views+1 WHERE "urlId" =  $1;`,
      [url.id]
    );

    res.redirect(url.url);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
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
    await connection.query(`DELETE FROM visits WHERE "urlId" = $1;`, [url.id]);
    await connection.query(`DELETE FROM urls WHERE id = $1;`, [url.id]);

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { shortenUrl, getUrlbyId, openUrl, deleteUrl };
