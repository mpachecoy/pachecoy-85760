import { DeliveryService } from "../services/deliveries.service.js";
import { successResponsae } from "../utils/api.response.js";


export const getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await DeliveryService.getAll();
        return successResponsae(res, {
            message: "Entregas obtenidas correctamente",
            payload: deliveries
        });
    } catch (error) {
        next(error);
    }
}

export const getDeliveryById = async (req, res) => {
    try {
        const { did } = req.params;
        if (!did) {
            return res.status(400).json({ status: "error", message: "ID de entrega no proporcionado" });
        }
        const delivery = await DeliveryService.getById(did);
        return successResponsae(res, {
            message: `Entrega ${did} obtenida correctamente`,
            payload: delivery
        });
    } catch (error) {
        next(error);
    }
}

export const createDelivery = async (req, res) => {
    try {
        const body = req.body;
        const delivery = await DeliveryService.create(body);
        return successResponsae(res, {
            statusCode: 201,
            message: "Entrega creada correctamente",
            payload: delivery
        });
    } catch (error) {
        next(error);
    }
}

export const updateDelivery = async (req, res) => {
    try {
        const updateDelivery = req.body;
        const { did } = req.params;

        if (!did) {
            return res.status(400).json({ status: "error", message: "ID de entrega no proporcionado" });
        }
        const updatedDelivery = await DeliveryService.update(did, updateDelivery);
        return successResponsae(res, {
            message: `Entrega ${did} actualizada correctamente`,
            payload: updatedDelivery
        });
    } catch (error) {
        next(error);
    }
}

export const deleteDelivery = async (req, res) => {
    try {
        const { did } = req.params;
        if (!did) {
            return res.status(400).json({ status: "error", message: "ID de entrega no proporcionado" });
        }
        const delivery = await DeliveryService.delete(did);
        return successResponsae(res, {
            message: `Entrega ${did} eliminada correctamente`,
            payload: delivery
        });
    } catch (error) {
        next(error);
    }
}