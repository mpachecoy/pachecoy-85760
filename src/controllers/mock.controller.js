import { mockDataService } from "../services/mock.service.js";

export const getMockUsers = async (req, res) => {
    try {
        const n = req.params.n;
        const users = await mockDataService.createUser(n);
        res.json({ status: "success", payload: users });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}


export const getMockStores = async (req, res) => {
    try {
        const n = req.params.n;
        const stores = await mockDataService.createStores();
        console.log(stores);
        res.json({ status: "success", payload: stores });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const getMockProducts = async (req, res) => {
    try {
        const n = req.params.n;
        const products = await mockDataService.createProducts(n);
        res.json({ status: "success", payload: products });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const getMockOrders = async (req, res) => {
    try {
        const n = req.params.n;
        const orders = await mockDataService.createOrders(n);
        res.json({ status: "success", payload: orders });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const getMockDeliveries = async (req, res) => {
    try {
        const n = req.params.n;
        const deliveries = await mockDataService.createDeliveries(n);
        res.json({ status: "success", payload: deliveries });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}
