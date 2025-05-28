import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string, salt?: number): Promise<string> =>
  await bcrypt.hash(password, salt || 10);

export const comparePassword = async (password: string, hashpassword: string): Promise<boolean> =>
  await bcrypt.compare(password, hashpassword).catch(() => false);
