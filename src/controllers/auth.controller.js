import { AuthService } from "../services/auth.service.js";
import { successResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import { env } from "../config/env.config.js";

const accessTokenCokkieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    maxAge: 15 * 60 * 1000,
    sameSite: "strict",
    path: "/"
};

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    maxAge: env.refreshTokenExpiresDays * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    path: "/api/auth"
};

const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, accessTokenCokkieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
};

export const register = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await AuthService.register(req.body);
    setAuthCookies(res, accessToken, refreshToken);
    return successResponse(res, {
        statusCode: 201,
        message: "Usuario registrado correctamente",
        payload: { user }
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login(email, password);
    setAuthCookies(res, accessToken, refreshToken);
    return successResponse(res, {
        message: "Login exitoso",
        payload: { user }
    });
});

export const refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    const tokens = await AuthService.refresh(refreshToken);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return successResponse(res, {
        message: "Token renovado correctamente",
        payload: { user: req.user }
    });
});

export const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    await AuthService.logout(refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return successResponse(res, {
        message: "Sesión cerrada correctamente",
        payload: null
    });
});

export const githubCallback = asyncHandler(async (req, res) => {
    const user = req.user;
    const { accessToken, refreshToken } = await AuthService.issueTokensForUser(user);
    setAuthCookies(res, accessToken, refreshToken);
    return successResponse(res, {
        message: "Login exitoso",
        payload: { user }
    });
});

export const githubFailure = (req, res) => {
    res.status(400).json({
        status: "error",
        error: "GITH_AUTH_FAILED",
        message: "Error al iniciar sesión con GitHub"
    });
}