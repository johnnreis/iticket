import { Request, Response } from "express";
import { AuthService } from "../services/auth-service";
import { InvalidCredentialsError } from "../errors/invalid-credential-error";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const authService = new AuthService();
  try {
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (e) {
    console.error(e);
    if (e instanceof InvalidCredentialsError) {
      res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(500).json({ message: "Unexpected error occurred" });
  }
};
