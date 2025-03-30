import express from "express";
import router from "./router/app";
import { authMiddleware } from "./middleware/auth-middleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use(authMiddleware);

app.use("/", router());

// somente para esse ambiente de teste para limpar as tabelas, sem necessidade de recriar o banco
app.listen(3000, async () => {
  console.log("Running in http://localhost:3000");
});
