import { ERROR_DICTIONARY } from "./errors.dictionary.js";

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
    const errorDefinition = ERROR_DICTIONARY[code] || ERROR_DICTIONARY["INTERNAL_SERVER_ERROR"];
    const error = new Error(customMessage || errorDefinition.message);
    error.statusCode = errorDefinition.statusCode;
    error.code = ERROR_DICTIONARY[code] ? code : "INTERNAL_SERVER_ERROR";
    return error;
}
