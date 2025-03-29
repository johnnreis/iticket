import express from "express";
import dotenv from "dotenv";
import * as mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createConnection } from "./database";

dotenv.config();

const app = express();

app.use(express.json());

const unprotectedRoutes = [
  { method: "POST", path: "/auth/login" },
  { method: "POST", path: "/customers/register" },
  { method: "POST", path: "/parterns;/register" },
  { method: "GET", path: "/events" },
];

app.use(async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  const isUnprotectedRoute = unprotectedRoutes.some(
    (route) => route.method == req.method && req.path.startsWith(route.path)
  );

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const payload = jwt.verify(token, "123452") as {
      id: number;
      email: string;
    };

    const connection = await createConnection();
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [payload.id]
    );

    const user = rows.length ? rows[0] : null;

    if (!user) {
      res.status(401).json({ message: "Falied to authenticate token" });
      return;
    }

    req.user = user as { id: number; email: string };

    next();
  } catch (error) {
    res.status(401).json({ message: "Falied to authentication token" });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const connection = await createConnection();
  try {
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    const user = rows.length ? rows[0] : null;

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        "123452",
        /* <- TODO: To Be Hashed more complex */ {
          expiresIn: "1h",
        }
      );

      res.json({ token });
    } else {
    }
  } finally {
    await connection.end();
  }
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

app.post("/customer", async (req, res) => {
  const { name, email, password, address, phone } = req.body;
  const connection = await createConnection();

  try {
    const createdAt = new Date();

    const [userResult] = await connection.execute<mysql.ResultSetHeader>(
      "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)",
      [name, email, address, createdAt]
    );

    const userId = userResult.insertId;
    const [partnerResult] = await connection.execute<mysql.ResultSetHeader>(
      "INSERT INTO customers (user_id, address, phone, created_at) VALUES (?, ?, ?, ?, ?)",
      [userId, address, phone, createdAt]
    );

    res.status(201).json({
      id: partnerResult.insertId,
      userId,
      name,
      address,
      phone,
      createdAt,
    });
  } finally {
    await connection.end();
  }
});

app.post("/events", (req, res) => {
  const { name, email, password, address, phone } = req.body;
});

app.get("/events", (req, res) => {});

app.get("/events/:eventId", (req, res) => {
  const { eventId } = req.params;
});

app.listen(process.env.PORT, async () => {
  /* TRUCANTE -> para limpar tabelas de forma rapida, 
     apagando todos registros e mantendo a estrutura, 
     ideal para esse cenario de teste/estudo 
  */
  const connection = await createConnection();
  await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
  await connection.execute("TRUNCATE TABLE events");
  await connection.execute("TRUNCATE TABLE customers");
  await connection.execute("TRUNCATE TABLE partners");
  await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
});
