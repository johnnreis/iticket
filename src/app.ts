import express from "express";
import router from "./router/app";
import { Database } from "./database";
import { authMiddleware } from "./middleware/auth-middleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/", router());

app.use(authMiddleware);

// somente para esse ambiente de teste para limpar as tabelas, sem necessidade de recriar o banco
app.listen(3000, async () => {
  const connection = Database.getInstance();
  await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
  await connection.execute("TRUNCATE TABLE tickets");
  await connection.execute("TRUNCATE TABLE events");
  await connection.execute("TRUNCATE TABLE customers");
  await connection.execute("TRUNCATE TABLE partners");
  await connection.execute("TRUNCATE TABLE users");
  await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
  console.log("Running in http://localhost:3000");
});
