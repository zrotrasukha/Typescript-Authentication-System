import mongoose from 'mongoose';
import { MONGO_URI } from '../constants/env.ts';
export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
}
