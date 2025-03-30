import { Router } from "express";
import {
  register,
  createEvent,
  findByUserId,
} from "../controllers/partner-controller";

export default (router: Router) => {
  router.post("/partners/register", register);
  router.post("/partners/events", createEvent);
  router.get("/partners/events");
  router.get("/partners/events/:eventId");
};
