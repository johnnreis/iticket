import { Router } from "express";
import { findAll, findById } from "../controllers/event-controller";

export default (router: Router) => {
  router.get("/", findAll);
  router.get("/:eventId", findById);
};
