import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { sessionDocument } from "../model/session.model"
import Audience from "../constants/audience";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../constants/env";
import { UserDocument } from "../model/user.model";

export type accessTokenPayload = {
  sessionId: sessionDocument["_id"];
  userId: UserDocument["_id"];
}

export type refreshTokenPayload = {
  sessionId: sessionDocument["_id"];
}

type signOptionsAndSecret = SignOptions & {
  secret: string;
}

const defaults: SignOptions = {
  audience: Audience.User,
}

export const accessTokenSignOptions: signOptionsAndSecret = {
  secret: JWT_ACCESS_SECRET,
  expiresIn: "15m",
}

export const refreshTokeSignOptions: signOptionsAndSecret = {
  secret: JWT_REFRESH_SECRET,
  expiresIn: "30m",
}
export const signToken = (
  payload: accessTokenPayload | refreshTokenPayload,
  options: signOptionsAndSecret
) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...signOpts
  });
}

export const verifyToken = <Tpayload extends object = accessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret?: string }
) => {
  const { secret = JWT_ACCESS_SECRET, ...verifyOpts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...verifyOpts
    }) as Tpayload;
    return { payload };
  } catch (error: any) {
    return {
      error: error.message
    };
  };
}

