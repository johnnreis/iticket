import * as express from "express";
import authenticationRouter from "./authentication-router";
import ticketRouter from "./ticket-router";
const router = express.Router();

export default (): express.Router => {
  authenticationRouter(router);
  ticketRouter(router);
  return router;
};
