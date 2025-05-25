import mongoose from 'mongoose';
import { hashePassword } from '../utils/bcrypt';

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

export const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await hashePassword(this.password);
  return next();
})

userSchema.methods.comparePassword = async function(password: string) {
  return await hashePassword(password, this.passwword);
}

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;

