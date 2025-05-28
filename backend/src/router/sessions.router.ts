import { Router } from 'express';
import { deleteSessionHandler, getSessionsHandler } from '../controllers/sessions.controller';

const sessionRouter = Router();

sessionRouter.get("/", getSessionsHandler);
sessionRouter.delete("/:id", deleteSessionHandler);

export default sessionRouter; 