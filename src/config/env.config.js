import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["PORT", "MONGODB_URI", "NODE_ENV", "JWT_SECRET"];

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

export const env = {
    port: process.env.PORT,
    mongoURI: process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV || "development",
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshTokenExpiresDays: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    githubCallbackURL: process.env.GITHUB_CALLBACK_URL
}