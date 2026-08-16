import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/users.repository.js";
import { generateToken, generateRefreshToken, hashToken } from "../utils/jwt.utils.js";
import { createError } from "../utils/api.response.js";
import { USER_ROLES } from "../constants/index.constants.js";
import RefreshTokenModel from "../models/refreshToken.model.js";
import { env } from "../config/env.config.js";

const issueTokens = async (user) => {
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + env.refreshTokenExpiresDays * 24 * 60 * 60 * 1000);

    await RefreshTokenModel.create({
        tokenHash: hashToken(refreshToken),
        user: user._id,
        expiresAt
    });

    return { accessToken, refreshToken };
};

export const AuthService = {
    async register(userData) {
        const { firstName, lastName, email, password } = userData;
        if (!firstName || !lastName || !email || !password) {
            throw createError("MISSING_REQUIRED_DATA");
        }
        const exist = await UserRepository.getByEmail(email);
        if (exist) {
            throw createError("USER_ALREADY_EXISTS");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserRepository.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: USER_ROLES.CUSTOMER
        });
        const { accessToken, refreshToken } = await issueTokens(newUser);
        return { user: newUser, accessToken, refreshToken };
    },

    async login(email, password) {
        if (!email || !password) {
            throw createError("MISSING_REQUIRED_DATA");
        }
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            throw createError("INVALID_CREDENTIALS");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw createError("INVALID_CREDENTIALS");
        }
        const { accessToken, refreshToken } = await issueTokens(user);
        const userObj = user.toObject();
        delete userObj.password;
        return { user: userObj, accessToken, refreshToken };
    },

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw createError("MISSING_REQUIRED_DATA");
        }
        const tokenHash = hashToken(refreshToken);
        const storedToken = await RefreshTokenModel.findOne({ tokenHash });
        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw createError("INVALID_REFRESH_TOKEN");
        }
        const user = await UserRepository.getById(storedToken.user);
        if (!user) {
            throw createError("INVALID_REFRESH_TOKEN");
        }

        await RefreshTokenModel.findByIdAndDelete(storedToken._id);
        const { accessToken, refreshToken: newRefreshToken } = await issueTokens(user);

        return { accessToken, refreshToken: newRefreshToken };
    },

    async logout(refreshToken) {
        if (!refreshToken) {
            throw createError("MISSING_REQUIRED_DATA");
        }
        const tokenHash = hashToken(refreshToken);
        await RefreshTokenModel.findOneAndDelete({ tokenHash });
    }
}