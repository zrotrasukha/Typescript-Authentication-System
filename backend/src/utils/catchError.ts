import { NextFunction, Request, Response } from "express"

type controllers = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>

const catchErrors = (controllers: controllers): controllers => (
  async (req, res, next) => {
    try {
      await controllers(req, res, next);
    } catch (error) {
      next(error);
    }
  }
)

export default catchErrors;


