import { NOT_FOUND, OK } from "../constants/statusCodes";
import UserModel from "../model/user.model";
import appAssert from "../utils/AppAssert";
import catchErrors from "../utils/catchError";

const userHandler = catchErrors(async (req, res) => {
    const user = await UserModel.findById(req.userId); 
    appAssert(user, NOT_FOUND, "User not found");
    res.status(OK).json({message: "User found", user: user.omitPassword()});
})
 
export default userHandler;