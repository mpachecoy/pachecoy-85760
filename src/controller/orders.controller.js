import { OrderService } from "../service/orders.service.js";

export const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderService.getAll();
        res.json({ status: "success", payload: orders });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const getOrderById = async (req, res) => {
    try {
        const { oid } = req.params;
        if (!oid) {
            return res.status(400).json({ status: "error", message: "ID no proporcionado" });
        }
        const order = await OrderService.getById(oid);
        res.json({ status: "success", payload: order });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const order = await OrderService.create(orderData);
        res.status(201).json({ status: "success", payload: order });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const updateOrder = async (req, res) => {
    try {
        const { oid } = req.params;
        const { status } = req.body;
        if (!oid) {
            return res.status(400).json({ status: "error", message: "ID no proporcionado" });
        }
        const order = await OrderService.updateStatusOrder(oid, status);
        res.json({ status: "success", payload: order });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const { oid } = req.params;
        if (!oid) {
            return res.status(400).json({ status: "error", message: "ID no proporcionado" });
        }
        const order = await OrderService.delete(oid);
        res.json({ status: "success", payload: order });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}