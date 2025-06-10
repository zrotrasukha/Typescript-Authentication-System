import { CookieOptions, Response } from 'express';
import { fifteenminutesFromNow, thirtyDaysFromNow } from './date';

const secure = process.env.NODE_ENV === 'production';
export const REFRESH_PATH = "/auth/refresh";

const defaults: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure,
}

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenminutesFromNow(),
})
export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: REFRESH_PATH
})
type paramsType = {
  res: Response;
  accessToken: string;
  refreshToken: string;
}

export const setAuthCookies = ({ res, accessToken, refreshToken }: paramsType) =>
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

// NOTE: about the setAuthCookies function:
// the getAccessTokenOptions and getRefreshTokenOptions, these are defined as functions and not hardcorded because we want to set the expiration time dynamically based on the current time, so that we can have different expiration times for access and refresh tokens at the time of setting the cookies rather than at the time of creation of the tokens.
//NOTE: we have cookieOptions type, useful stuff. 


export const deleteAuthCookies = (res: Response) =>
  res.clearCookie("accessToken").clearCookie("refreshToken", { path: REFRESH_PATH })

