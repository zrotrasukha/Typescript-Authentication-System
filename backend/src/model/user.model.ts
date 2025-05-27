import mongoose from 'mongoose';
import { hashePassword } from '../utils/bcrypt';


//NOTE: if you creating a new method under a schema, you need to add it to the interface as well, otherwise, typescript will not recognize it and will throw an error.
export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
  omitPassword: () => Pick<UserDocument, 'email' | 'verified' | 'createdAt' | 'updatedAt' | 'omitPassword'>;
  // NOTE: Learned aboud "PICK"; 
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

userSchema.methods.omitPassword = function() {
  const object = this.toObject();
  delete object.password;
  return object;

  // NOTE: Learned about toObject method, this is from mongoose and converts the document to a plain JavaScript object, also, it strips all the methods and virtuals from the document, leaving only the fields defined in the schema.
  // NOTE: Learned about delete 
}
const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;

