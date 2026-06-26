import { DeliveryService } from "../services/deliveries.service.js";


export const getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await DeliveryService.getAll();
        res.status(200).json({ status: "success", payload: deliveries });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export const getDeliveryById = async (req, res) => {
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

export const createDelivery = async (req, res) => {
    try {
        const body = req.body;
        const delivery = await DeliveryService.create(body);
        res.status(201).json({ status: "success", payload: delivery });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
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
        res.status(200).json({ status: "success", payload: updatedDelivery });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const deleteDelivery = async (req, res) => {
    try {
        const { did } = req.params;
        if (!did) {
            return res.status(400).json({ status: "error", message: "ID de entrega no proporcionado" });
        }
        const delivery = await DeliveryService.delete(did);
        res.status(200).json({ status: "success", payload: delivery });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}