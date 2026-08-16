import { OrderService } from "../services/orders.service.js";
import { successResponse, createError } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";

export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await OrderService.getAll();
    return successResponse(res, {
        message: "Pedidos obtenidos correctamente",
        payload: orders
    });
});

export const getOrderById = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    if (!oid) {
        throw createError("INVALID_INPUT", "ID de pedido no proporcionado");
    }
    const order = await OrderService.getById(oid, req.user);
    return successResponse(res, {
        message: `Pedido ${oid} obtenido correctamente`,
        payload: order
    });
});

export const createOrder = asyncHandler(async (req, res) => {
    const orderData = req.body;
    const order = await OrderService.create(orderData, req.user);
    return successResponse(res, {
        statusCode: 201,
        message: "Pedido creado correctamente",
        payload: order
    });
});

export const updateOrder = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const { status } = req.body;
    if (!oid) {
        throw createError("INVALID_INPUT", "ID de pedido no proporcionado");
    }
    const order = await OrderService.updateStatusOrder(oid, status, req.user);
    return successResponse(res, {
        message: `Pedido ${oid} actualizado correctamente`,
        payload: order
    });
});

export const uploadOrderProof = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const file = req.file;
    if (!oid) {
        throw createError("INVALID_INPUT", "ID de pedido no proporcionado");
    }
    const order = await OrderService.uploadProof(oid, file, req.user);
    return successResponse(res, {
        message: `Comprobante del pedido ${oid} subido correctamente`,
        payload: order
    });
});

export const deleteOrder = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    if (!oid) {
        throw createError("INVALID_INPUT", "ID de pedido no proporcionado");
    }
    const order = await OrderService.delete(oid);
    return successResponse(res, {
        message: `Pedido ${oid} eliminado correctamente`,
        payload: order
    });
});