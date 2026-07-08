import { StoreService } from "../services/store.service.js";
import { successResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";

export const getAllStores = asyncHandler(async (req, res) => {
    const stores = await StoreService.getAll();
    return successResponse(res, {
        message: "Comercios obtenidos correctamente",
        payload: stores,
    });
});

export const getStoreById = asyncHandler(async (req, res) => {
    const { sid } = req.params;
    if (!sid) {
        throw createError("INVALID_INPUT", "ID de comercio no proporcionado");
    }
    const store = await StoreService.getById(sid);
    return successResponse(res, {
        message: `Comercio ${sid} obtenido correctamente`,
        payload: store,
    });
});

export const createStore = asyncHandler(async (req, res) => {
    const storeData = req.body;
    const store = await StoreService.create(storeData);
    return successResponse(res, {
        statusCode: 201,
        message: "Comercio creado correctamente",
        payload: store,
    });
});

export const updateStore = asyncHandler(async (req, res) => {
    const { sid } = req.params;
    const storeUpdateData = req.body;
    if (!sid) {
        throw createError("INVALID_INPUT", "ID de comercio no proporcionado");
    }
    if (!storeUpdateData) {
        throw createError("INVALID_INPUT", "Datos del comercio no proporcionados");
    }
    const store = await StoreService.update(sid, storeUpdateData);
    return successResponse(res, {
        message: `Comercio ${sid} actualizado correctamente`,
        payload: store,
    });
});

export const deleteStore = asyncHandler(async (req, res) => {
    const { sid } = req.params;
    if (!sid) {
        throw createError("INVALID_INPUT", "ID de comercio no proporcionado");
    }
    const store = await StoreService.delete(sid);
    return successResponse(res, {
        message: `Comercio ${sid} eliminado correctamente`,
        payload: store,
    });
});
