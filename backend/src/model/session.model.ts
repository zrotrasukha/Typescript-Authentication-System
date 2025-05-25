import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";

export interface sessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<sessionDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  userAgent: { type: String },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: thirtyDaysFromNow
  },
})

//NOTE:  at the expiresAt field, we are using a function instead hard coded values like new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); and all that because That new Date(...) is executed immediately when the schema is defined — not every time a document is created.

const sessionModel = mongoose.model<sessionDocument>("Session", sessionSchema);

export default sessionModel; 
