import { Router } from "express";
import { register } from "../controllers/customer-controller";

export default (router: Router) => {
  router.post("/customers/register", register);
};
