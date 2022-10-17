import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./routers/auth.routers.js";
import urlsRouter from "./routers/urls.routers.js";
import usersRouter from "./routers/users.router.js";
const server = express();
server.use(cors());
server.use(express.json());
server.use(authRouter);
server.use(urlsRouter);
server.use(usersRouter);

const PORT = process.env.PORT;

server.get("/status", (req, res) => {
  res.send("Server on!");
});

server.listen(PORT, () => {
  console.log("Magic happens on " + PORT);
});
