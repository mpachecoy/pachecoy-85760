export const ERROR_DICTIONARY = {
    VALIDATION_ERROR: {
        statusCode: 400,
        message: "Error de validacion"
    },

    USER_NOT_FOUND: {
        statusCode: 404,
        message: "Usuario no encontrado"
    },

    USER_ALREADY_EXISTS: {
        statusCode: 409,
        message: "Usuario ya existe"
    },

    INVALID_ROLE: {
        statusCode: 400,
        message: "Rol inválido"
    },

    ORDER_NOT_FOUND: {
        statusCode: 404,
        message: "Orden no encontrada"
    },

    PRODUCT_NOT_FOUND: {
        statusCode: 404,
        message: "Producto no encontrado"
    },

    DELIVERY_NOT_FOUND: {
        statusCode: 404,
        message: "Entrega no encontrada"
    },

    STORE_NOT_FOUND: {
        statusCode: 404,
        message: "Tienda no encontrada"
    },

    ROUTE_NOT_FOUND: {
        statusCode: 404,
        message: "Ruta no encontrada"
    },

    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        message: "Error interno del servidor"
    },

    CONFLICT: {
        statusCode: 409,
        message: "Conflicto"
    },

    BAD_REQUEST: {
        statusCode: 400,
        message: "Petición inválida"
    },

    MISSING_REQUIRED_DATA: {
        statusCode: 400,
        message: "Datos requeridos faltantes"
    },

    STORE_NOT_ACTIVE: {
        statusCode: 400,
        message: "Tienda no activa"
    },

    INVALID_STATUS: {
        statusCode: 400,
        message: "Estado inválido"
    },

    INVALID_ITEMS: {
        statusCode: 400,
        message: "Items inválidos"
    },

    INVALID_INPUT: {
        statusCode: 400,
        message: "Input inválido"
    },

    INVALID_ID: {
        statusCode: 400,
        message: "ID inválido"
    },
    INVALID_CREDENTIALS: {
        statusCode: 401,
        message: "Credenciales inválidas"
    },

    UNAUTHORIZED: {
        statusCode: 401,
        message: "No autenticado"
    },

    FORBIDDEN: {
        statusCode: 403,
        message: "No tenés permiso para realizar esta acción"
    },

    FILE_REQUIRED: {
        statusCode: 400,
        message: "Archivo requerido"
    },

    INVALID_DOCUMENT_TYPE: {
        statusCode: 400,
        message: "Tipo de documento inválido"
    },

    INVALID_FILE_TYPE: {
        statusCode: 400,
        message: "Tipo de archivo inválido"
    },

    INVALID_FILE_SIZE: {
        statusCode: 400,
        message: "Tamaño de archivo inválido"
    },

    INVALID_REFRESH_TOKEN: {
        statusCode: 401,
        message: "Token de refresh inválido o expirado"
    }
}