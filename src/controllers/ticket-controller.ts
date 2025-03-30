import { Router, Request, Response } from "express";
import { PartnerService } from "../services/partner-service";
import { TicketService } from "../services/ticket-service";

export const createMany = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }
  const userId = req.user!.id;
  const partnerService = new PartnerService();
  const partner = await partnerService.findByUserId(userId);

  if (!partner) {
    res.status(403).json({ message: "Not authorized" });
    return;
  }

  const { num_tickets, price } = req.body;
  const { eventId } = req.params;
  const ticketService = new TicketService();
  await ticketService.createMany({
    eventId: +eventId,
    numTickets: num_tickets,
    price,
  });
  res.status(204).send();
};
