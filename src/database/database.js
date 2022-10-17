import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pg;

const databaseConfig = {
  connectionString: process.env.HEROKU_POSTGRESQL_SILVER_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const connection = new Pool(databaseConfig);

export default connection;
