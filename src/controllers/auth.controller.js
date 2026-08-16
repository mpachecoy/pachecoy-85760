import { AuthService } from "../services/auth.service.js";
import { successResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";

export const register = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await AuthService.register(req.body);
    return successResponse(res, {
        statusCode: 201,
        message: "Usuario registrado correctamente",
        payload: { user, accessToken, refreshToken }
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login(email, password);
    return successResponse(res, {
        message: "Login exitoso",
        payload: { user, accessToken, refreshToken }
    });
});

export const refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refresh(refreshToken);
    return successResponse(res, {
        message: "Token renovado correctamente",
        payload: tokens
    });
});

export const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    return successResponse(res, {
        message: "Sesión cerrada correctamente",
        payload: null
    });
});