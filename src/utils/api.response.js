import { CustomError } from "./custom.error.js";

export const successResponse = (res, { statusCode = 200, message, payload }) => {
    return res.status(statusCode).json({
        status: "success",
        message,
        payload
    });
}

export const errorResponse = (res, { statusCode = 500, error, message }) => {
    return res.status(statusCode).json({
        status: "error",
        error,
        message
    })
}

export const createError = (code, customMessage = null) => {
    return new CustomError(code, customMessage);
}
