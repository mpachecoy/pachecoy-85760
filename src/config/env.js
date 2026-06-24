import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: process.env.PORT || 8080,
    mongoURI: process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV || "development"
}