import { AuthService } from "../services/auth.service.js";
import { successResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";

export const register = asyncHandler(async (req, res) => {
    const body = req.body;
    const { user, token } = await AuthService.register(body);
    successResponse(res, {
        message: "Usuario registrado exitosamente",
        payload: { user, token }
    })
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { userLogin, token } = await AuthService.login(email, password);
    successResponse(res, {
        message: "Usuario logueado exitosamente",
        payload: { userLogin, token }
    })
});