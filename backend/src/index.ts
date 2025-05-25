import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { connectDb } from './config/db';
import { APP_ORIGIN, PORT } from './constants/env';
import cors from 'cors';
import cookie from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import catchErrors from './utils/catchError';
import { OK } from './constants/statusCodes';
import authRouter from './router/auth.router';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*",
  credentials: true,
}))
app.use(cookie());

// Routes
app.use('/auth', authRouter);
app.get("/healthCheck", catchErrors(async (_, res,) => {
  res.status(OK).json({
    status: "healthy",
  });
}))

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log('Server is running on port', PORT);
  await connectDb();
}); 
