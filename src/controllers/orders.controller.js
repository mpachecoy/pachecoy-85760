import { OrderService } from "../services/orders.service.js";
import { successResponse } from "../utils/api.response.js";

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await OrderService.getAll();
        return successResponse(res, {
            message: "Pedidos obtenidos correctamente",
            payload: orders
        });
    } catch (error) {
        next(error)
    }
}

export const getOrderById = async (req, res, next) => {
    try {
        const { oid } = req.params;
        if (!oid) {
            return res.status(400).json({ status: "error", message: "ID no proporcionado" });
        }
        const order = await OrderService.getById(oid);
        return successResponse(res, {
            message: `Pedido ${oid} obtenido correctamente`,
            payload: order
        });
    } catch (error) {
        next(error)
    }
}

export const createOrder = async (req, res, next) => {
    try {
        const orderData = req.body;
        const order = await OrderService.create(orderData);
        return successResponse(res, {
            statusCode: 201,
            message: "Pedido creado correctamente",
            payload: order
        });
    } catch (error) {
        next(error)
    }
}

export const updateOrder = async (req, res, next) => {
    try {
        const { oid } = req.params;
        const { status } = req.body;
        if (!oid) {
            return res.status(400).json({ status: "error", message: "ID no proporcionado" });
        }
        const order = await OrderService.updateStatusOrder(oid, status);
        return successResponse(res, {
            message: `Pedido ${oid} actualizado correctamente`,
            payload: order
        });
    } catch (error) {
        next(error)
    }
}

export const deleteOrder = async (req, res, next) => {
    try {
        const { oid } = req.params;
        if (!oid) {
            return res.status(400).json({ status: "error", message: "ID no proporcionado" });
        }
        const order = await OrderService.delete(oid);
        return successResponse(res, {
            message: `Pedido ${oid} eliminado correctamente`,
            payload: order
        });
    } catch (error) {
        next(error)
    }
}