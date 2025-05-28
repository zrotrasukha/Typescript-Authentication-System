import { Router } from 'express';
import userHandler from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/', userHandler); 
export default userRouter; 
