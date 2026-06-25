import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["PORT", "MONGODB_URI", "NODE_ENV"];

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

export const env = {
    port: process.env.PORT || 8080,
    mongoURI: process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV || "development"
}