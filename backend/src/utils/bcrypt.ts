import bcrypt from 'bcryptjs';

export const hashePassword = async (password: string, salt?: number): Promise<string> =>
  await bcrypt.hash(password, salt || 10);

export const comparePassword = async (password: string, hashePassword: string): Promise<boolean> =>
  await bcrypt.compare(password, hashePassword).catch(() => false);
