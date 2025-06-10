import { z } from 'zod';

export const emailSchema = z
    .string()
    .email({ message: "Enter a valid email" })
    .min(8, { message: "email must be more than 8 characters" })
    .max(255, { message: "email must be less than 255 characters" });
export const passwordSchema = z
    .string({message: "Password is required"})
    .min(8, {message: "Password must be at least 8 characters long"})
    .max(255, {message: "Password must be less than 255 characters"});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})

//NOTE: refine adds custom validation logic which is not supported by the zod-to-json-schema package
// Strucuter for refine() => refine(condition, error); 
export const registerSchema = loginSchema.extend({
    confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});


