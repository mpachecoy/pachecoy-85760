import { DeliveryService } from "../service/deliveries.service.js";


export const getAllOrders = async (req, res) => {
    try {
        const deliveries = await DeliveryService.getAll();
        res.status(200).json({ status: "success", payload: deliveries });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const getOrderById = async (req, res) => {
    try {
        const { did } = req.params;
        if (!did) {
            return res.status(400).json({ status: "error", message: "ID de entrega no proporcionado" });
        }
        const delivery = await DeliveryService.getById(did);
        res.status(200).json({ status: "success", payload: delivery });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const createOrder = async (req, res) => {
    try {
        const body = req.body;
        const delivery = await DeliveryService.create(body);
        res.status(201).json({ status: "success", payload: delivery });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const updateOrder = async (req, res) => {
    try {
        const updateOrder = req.body;
        const { did } = req.params;

        if (!did) {
            return res.status(400).json({ status: "error", message: "ID de entrega no proporcionado" });
        }

        res.status(200).json({ status: "success", payload: updateOrder });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const { did } = req.params;
        if (!did) {
            return res.status(400).json({ status: "error", message: "ID de entrega no proporcionado" });
        }
        res.status(200).json({ status: "success", payload: delivery });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}