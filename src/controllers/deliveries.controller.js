import { DeliveryService } from "../services/deliveries.service.js";
import { successResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";


export const getAllDeliveries = asyncHandler(async (req, res) => {
    const deliveries = await DeliveryService.getAll();
    return successResponse(res, {
        message: "Entregas obtenidas correctamente",
        payload: deliveries
    });
});

export const getDeliveryById = asyncHandler(async (req, res) => {
    const { did } = req.params;
    if (!did) {
        throw createError("INVALID_INPUT", "ID de entrega no proporcionado");
    }
    const delivery = await DeliveryService.getById(did);
    return successResponse(res, {
        message: `Entrega ${did} obtenida correctamente`,
        payload: delivery
    });
})

export const createDelivery = asyncHandler(async (req, res) => {
    const body = req.body;
    const delivery = await DeliveryService.create(body);
    return successResponse(res, {
        statusCode: 201,
        message: "Entrega creada correctamente",
        payload: delivery
    });
});

export const updateDelivery = asyncHandler(async (req, res) => {
    const updateDelivery = req.body;
    const { did } = req.params;
    if (!did) {
        throw createError("INVALID_INPUT", "ID de entrega no proporcionado");
    }
    const updatedDelivery = await DeliveryService.update(did, updateDelivery);
    return successResponse(res, {
        message: `Entrega ${did} actualizada correctamente`,
        payload: updatedDelivery
    });
});

export const deleteDelivery = asyncHandler(async (req, res) => {
    const { did } = req.params;
    if (!did) {
        throw createError("INVALID_INPUT", "ID de entrega no proporcionado");
    }
    const delivery = await DeliveryService.delete(did);
    return successResponse(res, {
        message: `Entrega ${did} eliminada correctamente`,
        payload: delivery
    });
});