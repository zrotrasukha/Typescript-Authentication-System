import { Router } from 'express';
import { deleteSessionHandler, getSessionsHandler } from '../controllers/sessions.controller';

const sessionRouter = Router();

sessionRouter.get("/", getSessionsHandler);
sessionRouter.get("/deleteSession", deleteSessionHandler);

export default sessionRouter; 