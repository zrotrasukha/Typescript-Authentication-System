import { Router } from "express";
import { loginHandler, logoutHandler, refreshTokenHandler, registerHandler, resetPasswordHandler, sendPasswordResetEmailHandler, verifyEmailHandler } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.get('/logout', logoutHandler);
authRouter.get('/refresh', refreshTokenHandler);
authRouter.get('/email/verify/:code', verifyEmailHandler);
authRouter.post('/password/forgot', sendPasswordResetEmailHandler);
authRouter.post('/password/reset', resetPasswordHandler);
export default authRouter; 
