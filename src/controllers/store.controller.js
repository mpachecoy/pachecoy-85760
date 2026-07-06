import { StoreService } from "../services/store.service.js";
import { successResponse } from "../utils/api.response.js";

export const getAllStores = async (req, res, next) => {
    try {
        const stores = await StoreService.getAll();
        return successResponse(res, {
            message: "Comercios obtenidos correctamente",
            payload: stores,
        });
    } catch (error) {
        next(error);
    }
};

export const getStoreById = async (req, res, next) => {
    try {
        const { sid } = req.params;
        const store = await StoreService.getById(sid);
        return successResponse(res, {
            message: `Comercio ${sid} obtenido correctamente`,
            payload: store,
        });
    } catch (error) {
        next(error);
    }
};

export const createStore = async (req, res, next) => {
    try {
        const storeData = req.body;
        const store = await StoreService.create(storeData);
        return successResponse(res, {
            statusCode: 201,
            message: "Comercio creado correctamente",
            payload: store,
        });
    } catch (error) {
        next(error);
    }
};

export const updateStore = async (req, res, next) => {
    try {
        const { sid } = req.params;
        const storeUpdateData = req.body;
        if (!sid) {
            return res
                .status(400)
                .json({ status: "error", message: "ID de comercio no proporcionado" });
        }
        if (!storeUpdateData) {
            return res
                .status(400)
                .json({
                    status: "error",
                    message: "Datos del comercio no proporcionados",
                });
        }
        const store = await StoreService.update(sid, storeUpdateData);
        return successResponse(res, {
            message: `Comercio ${sid} actualizado correctamente`,
            payload: store,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteStore = async (req, res) => {
    try {
        const { sid } = req.params;
        if (!sid) {
            return res
                .status(400)
                .json({ status: "error", message: "ID de comercio no proporcionado" });
        }
        const store = await StoreService.delete(sid);
        return successResponse(res, {
            message: `Comercio ${sid} eliminado correctamente`,
            payload: store,
        });
    } catch (error) {
        next(error);
    }
};
