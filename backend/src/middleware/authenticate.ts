import AppErrorCode from "../constants/appErrorCode";
import { UNAUTHORIZED } from "../constants/statusCodes";
import { payloadType } from "../controllers/auth.schema";
import appAssert from "../utils/AppAssert";
import catchErrors from "../utils/catchError";
import { verifyToken } from "../utils/jwt";

const authenticate = catchErrors(async (req, _, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccessToken
  )
  const { error, payload } = verifyToken<payloadType>(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid access token",
    AppErrorCode.InvalidAccessToken
  )

  req.userId = payload?.userId;
  req.sessionId = payload?.sessionId;
  next();
})

export default authenticate
