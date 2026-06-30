import { mockDataService } from "../services/mock.service.js";

export const getMockUsers = async (req, res) => {
    try {
        const n = req.params.n;
        const users = await mockDataService.createMockUsers(n);
        res.json({ status: "success", payload: users });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const getMockStores = async (req, res) => {
    try {
        const n = req.params.n;
        const stores = await mockDataService.createMockStores();
        res.json({ status: "success", payload: stores });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const getMockProducts = async (req, res) => {
    try {
        const n = req.params.n;
        const products = await mockDataService.createMockProducts(n);
        res.json({ status: "success", payload: products });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const getMockOrders = async (req, res) => {
    try {
        const n = req.params.n;
        const orders = await mockDataService.createMockOrders(n);
        res.json({ status: "success", payload: orders });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const getMockDeliveries = async (req, res) => {
    try {
        const n = req.params.n;
        const deliveries = await mockDataService.createMockDeliveries(n);
        res.json({ status: "success", payload: deliveries });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const saveMockUsers = async (req, res) => {
    try {
        const n = req.params.n;
        const users = await mockDataService.createMockUsers(n);
        await mockDataService.saveMockUsers(users);
        res.json({ status: "success", message: "Usuarios guardados correctamente" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const saveMockStores = async (req, res) => {
    try {
        const n = req.params.n;
        const stores = await mockDataService.createMockStores(n);
        await mockDataService.saveMockStores(stores);
        res.json({ status: "success", message: "Tiendas guardadas correctamente" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const saveMockProducts = async (req, res) => {
    try {
        const n = req.params.n;
        const products = await mockDataService.createMockProducts(n);
        await mockDataService.saveMockProducts(products);
        res.json({ status: "success", message: "Productos guardados correctamente" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const saveMockOrders = async (req, res) => {
    try {
        const n = req.params.n;
        const orders = await mockDataService.createMockOrders(n);
        await mockDataService.saveMockOrders(orders);
        res.json({ status: "success", message: "Órdenes guardadas correctamente" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const saveMockDeliveries = async (req, res) => {
    try {
        const n = req.params.n;
        const deliveries = await mockDataService.createMockDeliveries(n);
        await mockDataService.saveMockDeliveries(deliveries);
        res.json({ status: "success", message: "Entregas guardadas correctamente" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}   