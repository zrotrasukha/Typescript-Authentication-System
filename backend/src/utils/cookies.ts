import { CookieOptions, Response } from 'express';
import { fifteenminutesFromNow, thirtyDaysFromNow } from './date';

const secure = process.env.NODE_ENV === 'production';

const defaults: CookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: true,
}

const getAccessTokenOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenminutesFromNow(),
})
const getRefreshTokenOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: "/auth/refresh"
})
type paramsType = {
  res: Response;
  accessToken: string;
  refreshToken: string;
}

export const setAuthCookies = ({ res, accessToken, refreshToken }: paramsType) =>
  res
    .cookie("accessToken", accessToken, getAccessTokenOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenOptions());

