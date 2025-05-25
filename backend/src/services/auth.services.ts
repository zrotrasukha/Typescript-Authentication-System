import UserModel from "../model/user.model";
import sessionModel from "../model/session.model";
import jwt from "jsonwebtoken";
import verificationModel from "../model/verification.model";
import { oneYearFromNow } from "../utils/date";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../constants/env";
export type createUser = {
  email: string;
  password: string;
  userAgent?: string;
}

export const createUser = async (data: createUser) => {
  // TODO:: 
  // WORK ON THESE YOU DAMN IT: 46:16(video); 
  // check if user exists
  const existingUser = await UserModel.exists({
    email: data.email
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password
  })
  // generate verification email (will do it later when implementing resend )

  //  generate verification code: 
  const verificationCode = await verificationModel.create({
    userId: user._id,
    type: "email_verification",
    expiresDate: oneYearFromNow()
  });

  // create session 
  const session = await sessionModel.create({
    userId: user._id,
    userAgen: data.userAgent,
  })

  // sign access & refresh token
  const refreshToken = jwt.sign({
    userId: user._id,
    sessionId: session._id,
  }, JWT_REFRESH_SECRET,
    {
      audience: "user",
      expiresIn: "30d"
    }

  )
  const accessToken = jwt.sign({
    sessionId: session._id,
  }, JWT_ACCESS_SECRET,
    {
      audience: ["user"],
      expiresIn: "15m"
    }

  )
  // return user & data; 
  return {
    user,
    accessToken,
    refreshToken,
  };

}
