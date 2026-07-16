import { errorResponse, createError } from "../utils/api.response.js";
import { CustomError } from "../utils/custom.error.js";
import mongoose from "mongoose";
import { env } from "../config/env.config.js";
import logger from "../utils/logger.js";

const normalizeError = (error) => {
    if (error instanceof CustomError) {
        return error;
    }
    if (error instanceof mongoose.Error.CastError) {
        return createError("INVALID_ID", `ID inválido: ${error.value}`);
    }
    if (error instanceof mongoose.Error.ValidationError) {
        const details = Object.values(error.errors).map((e) => e.message);
        return createError("VALIDATION_ERROR", details.join(" | "), details);
    }
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue || {})[0] || "campo";
        return createError("CONFLICT", `Ya existe un registro con ese ${field}`);
    }
    if (error.type === "entity.parse.failed" || error instanceof SyntaxError) {
        return createError("BAD_REQUEST", "El cuerpo de la petición no es un JSON válido");
    }

    return createError("INTERNAL_SERVER_ERROR", error.message);
};

export const errorHandler = (error, req, res, next) => {
    const standardizedError = normalizeError(error);

    if (standardizedError.statusCode >= 500) {
        logger.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ->`, error);
    } else if (env.nodeEnv === "development") {
        logger.warn(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${standardizedError.code}: ${standardizedError.message}`);
    }

    const statusCode = standardizedError.statusCode;
    const errorCode = standardizedError.code;
    const message = standardizedError.message;

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