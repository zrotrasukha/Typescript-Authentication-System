import AppErrorCode from "../constants/appErrorCode";


class AppError extends Error {
  constructor(
    public httpCode: number,
    public message: string,
    public errorCode?: AppErrorCode,
  ) {
    super(message);
  }
}

export default AppError; 
