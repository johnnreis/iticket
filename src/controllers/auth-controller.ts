import { Router } from "express";
import { AuthService } from "../services/auth-service";
import { InvalidCredentialsError } from "../errors/invalid-credential-error";

export const authRoutes = Router();

authRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    res.json({});
  } catch (e) {
    if (e instanceof InvalidCredentialsError) {
      res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(500).json({ message: "" });
  }
});
