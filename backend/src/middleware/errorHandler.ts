import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/statusCodes";
import { ZodError } from "zod/v4";
import AppError from "../utils/AppError";
import { deleteAuthCookies, REFRESH_PATH } from "../utils/cookies";

const handleZodError = (error: ZodError, res: Response) => {
  const errors = error.issues.map((issue) => ({
    path: issue.path.join(","),
    message: issue.message
  }))

  return res.status(BAD_REQUEST).json({
    message: "Validation Error",
    errors,
  })
}
const handlerAppError = (res: Response, error: AppError) => {
  return res.status(error.httpCode).json({
    message: error.message,
    errorCode: error.errorCode,
  })
}
const errorHandler: ErrorRequestHandler = (error, req, res, _) => {
  console.log(`Path ${req.path} not found`, error);

  if( req.path === REFRESH_PATH ) {
    deleteAuthCookies(res); 
  } 
  if (error instanceof ZodError) {
    handleZodError(error, res);
    return;
  }
  if (error instanceof AppError) {
    handlerAppError(res, error);
    return;
  }
  res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
  return;
}

export default errorHandler;


