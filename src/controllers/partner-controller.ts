import { Request, Response } from "express";
import { PartnerService } from "../services/partner-service";
import { EventService } from "../services/event-service";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, company_name } = req.body;

  const partnerService = new PartnerService();
  const result = await partnerService.register({
    name,
    email,
    password,
    company_name,
  });
  res.status(201).json(result);
};

export const createEvent = async (req: Request, res: Response) => {
  const { name, description, date, location } = req.body;
  const userId = req.user!.id;
  const patnerService = new PartnerService();
  const partner = await patnerService.findByUserId(userId);

  if (!partner) {
    res.status(403).json({ message: "Not authorized" });
    return;
  }

  const eventService = new EventService();
  const result = await eventService.create({
    name,
    description,
    date: new Date(date),
    location,
    partnerId: partner.id,
  });
  res.status(201).json(result);
};

export const findByUserId = async (req: Request, res: Response) => {};
