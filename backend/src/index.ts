import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectDb } from './config/db';
import { APP_ORIGIN, PORT } from './constants/env';
import cors from 'cors';
import cookie from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import authRouter from './router/auth.router';
import userRoutender from './router/user.router';
import authenticate from './middleware/authenticate';
import sessionRouter from './router/sessions.router';
import healthCheckRouter from './router/healthCheck';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: APP_ORIGIN,
  credentials: true,

}))
app.use(cookie());

// Routes
app.use('/auth', authRouter);
app.use('/user', authenticate, userRoutender);
app.use('/sessions', authenticate, sessionRouter);
app.use('/health', healthCheckRouter);

//NOTE: coolest shit I learned in this project 
// error handling middleware
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log('Server is running on port', PORT);
  await connectDb();
}); 
