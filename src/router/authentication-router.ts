import { Router } from "express";
import { login } from "../controllers/auth-controller";

export default (router: Router) => {
  router.post("/auth/login", login);
};
