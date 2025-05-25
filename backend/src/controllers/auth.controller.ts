import catchErrors from "../utils/catchError";
import { z } from "zod/v4";
import { createUser } from "../services/auth.services";
import { BAD_REQUEST, CREATED } from "../constants/statusCodes";
import { setAuthCookies } from "../utils/cookies";

const registerSchema = z.object({
  email: z.email().min(3).max(255),
  password: z.string().min(8).max(255),
  confirmPassword: z.string().min(8).max(255),
  userAgent: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

// to handle refine part we gotta use zod error, for that go back to catchError.ts
//
export const registerHandler = catchErrors(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  })
  if (!request) {
    return res.status(BAD_REQUEST).json({
      message: "Invalid request",
    })
  }

  const { user, accessToken, refreshToken } = await createUser(request);

  return setAuthCookies({ res, accessToken, refreshToken }).status(CREATED).json({ user });
}); 
