import { ERROR_DICTIONARY } from "./errors.dictionary.js";

export class CustomError extends Error {
    constructor(code, customMessage = null) {
        const errorDefinition = ERROR_DICTIONARY[code] || ERROR_DICTIONARY["INTERNAL_SERVER_ERROR"];
        super(customMessage || errorDefinition.message);
        this.statusCode = errorDefinition.statusCode;
        this.code = ERROR_DICTIONARY[code] ? code : "INTERNAL_SERVER_ERROR";
    }
}