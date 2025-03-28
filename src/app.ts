import express from "express";
import dotenv from "dotenv";
import * as mysql from "mysql2/promise";
import bcrypt from "bcrypt";

async function createConnection() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "itickets",
      port: 3306,
    });
    console.log("Conexão estabelecida com sucesso!");
    return connection;
  } catch (error) {
    console.error("Erro ao conectar:", error);
    throw error;
  }
}

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.post("/auth/signin", (req, res) => {
  const { email, password } = req.body;
  res.send({
    code: 200,
    email: email,
    password: password,
  });
});

app.post("/partners", async (req, res) => {
  const { name, email, password, company_name } = req.body;

  const connection = await createConnection();

  try {
    const createdAt = new Date();
    const hashedPassword = bcrypt.hashSync(password, 10);

    const [userResult] = await connection.execute<mysql.ResultSetHeader>(
      "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, createdAt]
    );

    const userId = userResult.insertId;
    const [partnerResult] = await connection.execute<mysql.ResultSetHeader>(
      "INSERT INTO partners (user_id, company_name, created_at) VALUES (?, ?, ?)",
      [userId, company_name, createdAt]
    );

    res
      .status(201)
      .json({ id: partnerResult.insertId, userId, company_name, createdAt });
  } finally {
    await connection.end();
  }
});

app.post("/customer", (req, res) => {
  const { name, email, password, address, phone } = req.body;
});

app.post("/events", (req, res) => {
  const { name, email, password, address, phone } = req.body;
});

app.get("/events", (req, res) => {});

app.get("/events/:eventId", (req, res) => {
  const { eventId } = req.params;
});

app.listen(process.env.PORT, () => {
  console.log(`Running in PORT: ${process.env.PORT}`);
});
