
import mongoose from "mongoose";
import { verificationCodeType } from "../constants/verificationCodeType";

export interface verificationModel extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: verificationCodeType;
  createdAt: Date;
  expiresDate: Date;
}

const verificationSchema = new mongoose.Schema<verificationModel>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  expiresDate: {
    type: Date,
    required: true,
  }
})

//third parameter stops mongoose from using the plural naming convention and tell to straight up use the name "verification_codes" for the collection
const verificationModel = mongoose.model<verificationModel>(
  "Verification",
  verificationSchema,
  "verification_codes"
);

export default verificationModel;

