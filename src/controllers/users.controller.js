import connection from "../database/database.js";
import { StatusCodes } from "http-status-codes";

async function getUsersUrls(req, res) {
  const { userId } = res.locals?.loggedUser;

  try {
    const result = (
      await connection.query(
        `SELECT 
      users.id, 
      users.name,
      COALESCE(SUM(visits.views), 0) AS "visitCount",
            COALESCE(json_agg(json_build_object(
                    'id', urls.id,
                    'shortUrl', urls."shortUrl",
                    'url', urls.url,
                    'visitCount', visits.views
                ))
                FILTER (WHERE urls."userId" IS NOT NULL),
                '[]'
            ) AS "shortenedUrls"
  FROM users 
  LEFT JOIN urls ON urls."userId" = users.id
  LEFT JOIN visits ON urls.id = visits."urlId"
  WHERE users.id = $1
  GROUP BY users.id
  ;
    `,
        [userId]
      )
    ).rows[0];
    return res.status(StatusCodes.OK).send(result);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}

async function getRanking(req, res) {
  try {
    const ranking = (
      await connection.query(`SELECT users.id, users.name, 
    COUNT(urls.id) AS "linksCount", 
    COALESCE(SUM(visits.views), 0) AS "visitCount"
    FROM users LEFT JOIN urls ON
    users.id = urls."userId" LEFT JOIN visits ON
    urls.id = visits."urlId" GROUP BY users.id
    ORDER BY "visitCount" DESC LIMIT 10
    ;`)
    ).rows;
    return res.status(StatusCodes.OK).send(ranking);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
  }
}

export { getUsersUrls, getRanking };
