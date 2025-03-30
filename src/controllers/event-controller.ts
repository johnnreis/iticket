import { Request, Response } from "express";
import { EventService } from "../services/event-service";

export const findAll = async (req: Request, res: Response) => {
  const eventService = new EventService();
  const result = await eventService.findAll();
  res.json(result);
};

export const findById = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const eventService = new EventService();
  const event = await eventService.findById(+eventId);

  if (!event) {
    res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
};
