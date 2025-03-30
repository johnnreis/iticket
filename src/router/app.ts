import * as express from "express";
import authenticationRouter from "./authentication-router";
import customerRouter from "./customer-router";
import eventRouter from "./event-router";
import partnerRouter from "./partner-router";
import ticketRouter from "./ticket-router";

const router = express.Router();

export default (): express.Router => {
  authenticationRouter(router);
  customerRouter(router);
  eventRouter(router);
  partnerRouter(router);
  ticketRouter(router);

  return router;
};
