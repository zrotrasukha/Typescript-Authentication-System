import UserModel from "../model/user.model";
import sessionModel from "../model/session.model";
import verificationModel from "../model/verification.model";
import { msInADay, oneYearFromNow, tenmintuseFromNow, thirtyDaysFromNow } from "../utils/date";
import { verificationCodeType } from "../constants/verificationCodeType";
import appAssert from "../utils/AppAssert";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../constants/statusCodes";
import { accessTokenSignOptions, refreshTokenPayload, refreshTokeSignOptions, signToken, verifyToken } from "../utils/jwt";
import { sendMail } from "../utils/sendMail";
import { getVerifyEmailTemplate } from "../utils/emailTemplate";
import { APP_ORIGIN } from "../constants/env";

export type createUser = {
  email: string;
  password: string;
  userAgent?: string;
}

export const createUser = async (data: createUser) => {
  // TODO: 
  // check if user exists
  const existingUser = await UserModel.exists({
    email: data.email
  });

  appAssert(
    !existingUser,
    CONFLICT,
    "User already exists",
  )

  // create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password
  })

  //  generate verification code: 
  const verificationCode = await verificationModel.create({
    userId: user._id,
    type: verificationCodeType.emailVerification,
    expiresDate: tenmintuseFromNow()
  });

  // generate verification email (will do it later when implementing resend )

  const toUrl = `${APP_ORIGIN}/email/verify/${verificationCode._id}`; 
  const {emailData} = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(toUrl)
  })
    
  if(emailData.error) console.log(emailData.error); 


  const userId = user._id;
  // create session 
  const session = await sessionModel.create({
    userId,
    userAgent: data.userAgent,
  })

  // sign access & refresh token
  const accessToken = signToken({
    userId,
    sessionId: session._id,
  },
    accessTokenSignOptions
  )

  const refreshToken = signToken({
    sessionId: session._id,
  },
    refreshTokeSignOptions
  )

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };

}

type loginUser = {
  email: string;
  password: string;
  userAgent?: string;
}

export const loginUser = async ({ email, password, userAgent }: loginUser) => {
  // find the user
  const existingUser = await UserModel.findOne({ email });
  appAssert(
    existingUser,
    NOT_FOUND,
    "User not found"
  )

  // validate credentials
  const isPasswordValid = await existingUser.comparePassword(password);
  // create session

  appAssert(
    isPasswordValid,
    NOT_FOUND,
    "Wrong credentials"
  )

  const userId = existingUser._id;
  const session = await sessionModel.create({
    userId,
    userAgent,
  })

  const sessionInfo = {
    sessionId: session._id
  }

  // sign access & refresh token
  const accessToken = signToken({
    userId,
    ...sessionInfo
  },
    accessTokenSignOptions
  )

  const refreshToken = signToken({
    sessionId: session._id,
  },
    refreshTokeSignOptions
  )

  return {
    accessToken,
    refreshToken,
  }
}

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<refreshTokenPayload>(refreshToken);
  appAssert(
    payload,
    NOT_FOUND,
    "Invalid refresh token"
  );
  const session = await sessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    NOT_FOUND,
    "Session has expired or does not exist"
  )

  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= msInADay;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    session.save();
  }

  const newRefreshToken = sessionNeedsRefresh ? (
    signToken({
      sessionId: session._id,
    }, refreshTokeSignOptions)
  ) : undefined;

  const acesssToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  }, accessTokenSignOptions)

  return {
    accessToken: acesssToken,
    refreshToken: newRefreshToken,
  };

}

export const verifyemail = async (code:string) => {
  const validCode = await verificationModel.findOne({
    _id: code, 
    type: verificationCodeType.emailVerification,
    expiresDate: { $gt: new Date() } 
  })

  appAssert(
    validCode,
    NOT_FOUND,
    "Invalid or expired verification code"
  );

  const updatedUser = await UserModel.findByIdAndUpdate({
    _id: validCode.userId, 
  }, {
      verified: true
    }, {new: true}); 

  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");

  await validCode.deleteOne();

  return {
    user: updatedUser.omitPassword()
  };

}

