import catchErrors from "../utils/catchError";
import { createUser, loginUser, refreshUserAccessToken, resetPassword, sendPasswordResetEmail, verifyemail } from "../services/auth.services";
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "../constants/statusCodes";
import { deleteAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthCookies } from "../utils/cookies";
import { emailSchema, registerSchema, resetPasswordSchema } from "./auth.schema";
import { loginSchema } from "./auth.schema";
import appAssert from "../utils/AppAssert";
import { verifyToken } from "../utils/jwt";
import sessionModel from "../model/session.model";
import { verificationSchema } from "./auth.schema";
export const registerHandler = catchErrors(async (req, res) => {
  // NOTE: zodSchema.parse() creates and returns a deeply typed copy of the input data, validating it against the schema. If the data is valid, it returns the parsed data; if not, it throws an error.
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
    //NOTE: userAgent was not added in registerSchema because it comes from headers and not from body
    //NOTE: This userAgent is being used while creating a session in the auth.services.ts so that we can find out what device the user is using to log in. 
  })
  if (!request) {
    appAssert(request, BAD_REQUEST, "Invalid request data");
    return;
  }

  const { user, accessToken, refreshToken } = await createUser(request);

  return setAuthCookies({
    res,
    accessToken,
    refreshToken
  }).status(CREATED).json({ user });
});

export const loginHandler = catchErrors(async (req, res) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"]
  })
  appAssert(
    request,
    UNAUTHORIZED,
    "WRONG CREDENTIALS"
  )

  const { accessToken, refreshToken } = await loginUser(request);
  return setAuthCookies({
    res,
    accessToken,
    refreshToken
  }).status(OK).json({ message: "Login successful" });

})

export const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken(accessToken || "");

  if (payload) {
    await sessionModel.findByIdAndDelete(payload.sessionId);
  }
  return deleteAuthCookies(res).status(OK).json({ message: "Logout successful" });
})

export const refreshTokenHandler = catchErrors(async (req, res) => {
  const prevRefreshToken = req.cookies.refreshToken as string | undefined;

  appAssert(
    prevRefreshToken,
    UNAUTHORIZED,
    "Refresh token is required"
  );

  const { accessToken, refreshToken } = await refreshUserAccessToken(prevRefreshToken);

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
  }

  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .status(OK)
    .json({ message: "Access token refreshed successfully" });

})

export const verifyEmailHandler = catchErrors(async (req, res) => {
  const verificationCode = verificationSchema.parse(req.params.code);
  await verifyemail(verificationCode);
  return res.status(OK).json({ message: "Email verified successfully" });
})

export const sendPasswordResetEmailHandler = catchErrors(async (req, res) => {
  const email = emailSchema.parse(req.body.email);

  await sendPasswordResetEmail(email);

  return res.status(OK).json({ message: "Reset Password Email sent successfully" });
})

export const resetPasswordHandler = catchErrors(async (req, res) => {
  const request = resetPasswordSchema.parse(req.body);

  await resetPassword(request);

  return deleteAuthCookies(res).status(OK).json({ message: "Password reset successfully" });
})

