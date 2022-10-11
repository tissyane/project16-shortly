import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import usersRouter from "./routers/user.routers.js";

const server = express();
server.use(cors());
server.use(express.json());
server.use(usersRouter);

const PORT = process.env.PORT;

server.get("/status", (req, res) => {
  res.send("Server on!");
});

server.listen(PORT, () => {
  console.log("Magic happens on " + PORT);
});
