import { errorResponse, createError } from "../utils/api.response.js";

export const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const errorCode = error.code || "INTERNAL_SERVER_ERROR";
    const message = error.message || "Error interno del servidor";

    return errorResponse(res, {
        statusCode,
        error: errorCode,
        message
    });
}

export const notFoundHandler = (req, res, next) => {
    const error = createError("ROUTE_NOT_FOUND", `Ruta no encontrada: ${req.method} ${req.url}`);
    next(error);
}