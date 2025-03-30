import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../services/user-service";

interface UnprotectedRoute {
  method: string;
  path: string;
}

export const config = {
  jwtSecret: process.env.JWT_SECRET || "123456",
  unprotectedRoutes: [
    { method: "POST", path: "/auth/login" },
    { method: "POST", path: "/customers/register" },
    { method: "POST", path: "/partners/register" },
    { method: "GET", path: "/events" },
  ] as UnprotectedRoute[],
};

export const isUnprotectedRoute = (req: Request): boolean => {
  return config.unprotectedRoutes.some(
    (route) => route.method === req.method && req.path.startsWith(route.path)
  );
};

export const extractToken = (req: Request): string | null => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  return parts[1];
};

export const verifyToken = (
  token: string
): { id: number; email: string } | null => {
  try {
    return jwt.verify(token, config.jwtSecret) as { id: number; email: string };
  } catch (error) {
    return null;
  }
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (isUnprotectedRoute(req)) {
    return next();
  }

  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ message: "Failed to authenticate token" });
    return;
  }

  try {
    const userService = new UserService();
    const user = await userService.findById(payload.id);
    if (!user) {
      res.status(401).json({ message: "Failed to authenticate token" });
    }
    req.user = user as { id: number; email: string };
    next();
  } catch (error) {
    res.status(401).json({ message: "Failed to authenticate token" });
  }
};
