import { mockDataService } from "../services/mock.service.js";
import { successResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";

export const getMockUsers = asyncHandler(async (req, res) => {
    const n = req.params.n;
    const users = await mockDataService.createUser(n);
    return successResponse(res, {
        message: "Usuarios mock obtenidos correctamente",
        payload: users
    });
});

export const getMockStores = asyncHandler(async (req, res) => {
    const n = req.params.n;
    const stores = await mockDataService.createStores(n);
    return successResponse(res, {
        message: "Tiendas mock obtenidas correctamente",
        payload: stores
    });
});

export const getMockProducts = asyncHandler(async (req, res) => {
    const n = req.params.n;
    const products = await mockDataService.createProducts(n);
    return successResponse(res, {
        message: "Productos mock obtenidos correctamente",
        payload: products
    });
});

export const getMockOrders = asyncHandler(async (req, res) => {
    const n = req.params.n;
    const orders = await mockDataService.createOrders(n);
    return successResponse(res, {
        message: "Pedidos mock obtenidos correctamente",
        payload: orders
    });
});

export const getMockDeliveries = asyncHandler(async (req, res) => {
    const n = req.params.n;
    const deliveries = await mockDataService.createDeliveries(n);
    return successResponse(res, {
        message: "Entregas mock obtenidas correctamente",
        payload: deliveries
    });
});

export const saveMockUsers = asyncHandler(async (req, res) => {
    const n = req.params.n;
    const users = await mockDataService.saveUsers(n);
    return successResponse(res, {
        message: "Usuarios mock guardados correctamente",
        payload: users
    });
});

