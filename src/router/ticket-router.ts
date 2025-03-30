import { Router } from "express";
import { createMany } from "../controllers/ticket-controller";
import { authMiddleware } from "../middleware/auth-middleware";

export default (router: Router) => {
  router.post("/events/:eventId/tickets", createMany);
  router.get("/events/:eventId/tickets");
  router.get("/events/:eventId/tickets/:ticketId");
};
