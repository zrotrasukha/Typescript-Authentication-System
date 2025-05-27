import { z } from "zod/v4";

const emailSchema = z.email().min(3).max(255);
const passwordSchema = z.string().min(8).max(255);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
})

export const registerSchema = loginSchema.extend({
  confirmPassword: z.string().min(8).max(255),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})
// NOTE: the refine method is used to add custom validation logic to the schema
// to handle refine part we gotta use zod error, for that go back to catchError.ts


// max is set to be 24 because when we are creating a user, we generate a verificationDocument along with the user, and the id of the verificationDocument is a random string of 24 characters.
export const verificationSchema = z.string().min(1).max(24); 
