import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/statusCodes";
import { ZodError } from "zod/v4";

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

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof ZodError) {
    handleZodError(error, res);
    return;
  }
  console.log(`Path ${req.path} not found`, error);
  res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
  return;
}

export default errorHandler;


