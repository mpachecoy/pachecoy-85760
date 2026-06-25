import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  const mongoUri = env.mongoURI;

  if (!mongoUri) {
    throw new Error("Falta la variable MONGODB_URI");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB conectado");
};

export default connectDB;
