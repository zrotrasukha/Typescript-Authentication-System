import API from "@/config/apiClient"
import { type loginData } from "@/types/apiTypes";

export const login = async (data: loginData) => API.post('/auth/login', data);
export const register = async (data: loginData) => API.post('/auth/register', data);
export const verifyEmail = async (verificationCode: string) => API.get(`/auth/email/verify/${verificationCode}`)