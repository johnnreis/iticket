import { Router } from "express";
import { createMany } from "../controllers/ticket-controller";

export default (router: Router) => {
  router.post("/:eventId/tickets", createMany);
  router.get("/:eventId/tickets");
  router.get("/:eventId/tickets/:ticketId");
};
