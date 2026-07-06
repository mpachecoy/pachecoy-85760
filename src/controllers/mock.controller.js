import { mockDataService } from "../services/mock.service.js";
import { successResponsae } from "../utils/api.response.js";

export const getMockUsers = async (req, res) => {
    try {
        const n = req.params.n;
        const users = await mockDataService.createUser(n);
        return successResponsae(res, {
            message: "Usuarios mock obtenidos correctamente",
            payload: users
        });
    } catch (error) {
        next(error)
    }
}

export const getMockStores = async (req, res) => {
    try {
        const n = req.params.n;
        const stores = await mockDataService.createStores(n);
        return successResponsae(res, {
            message: "Tiendas mock obtenidas correctamente",
            payload: stores
        });
    } catch (error) {
        next(error)
    }
}

export const getMockProducts = async (req, res) => {
    try {
        const n = req.params.n;
        const products = await mockDataService.createProducts(n);
        return successResponsae(res, {
            message: "Productos mock obtenidos correctamente",
            payload: products
        });
    } catch (error) {
        next(error)
    }
}

export const getMockOrders = async (req, res) => {
    try {
        const n = req.params.n;
        const orders = await mockDataService.createOrders(n);
        return successResponsae(res, {
            message: "Pedidos mock obtenidos correctamente",
            payload: orders
        });
    } catch (error) {
        next(error)
    }
}

export const getMockDeliveries = async (req, res) => {
    try {
        const n = req.params.n;
        const deliveries = await mockDataService.createDeliveries(n);
        return successResponsae(res, {
            message: "Entregas mock obtenidas correctamente",
            payload: deliveries
        });
    } catch (error) {
        next(error)
    }
}

export const saveMockUsers = async (req, res) => {
    try {
        const n = req.params.n;
        const users = await mockDataService.saveUsers(n);
        return successResponsae(res, {
            message: "Usuarios mock guardados correctamente",
            payload: users
        });
    } catch (error) {
        next(error)
    }
}

