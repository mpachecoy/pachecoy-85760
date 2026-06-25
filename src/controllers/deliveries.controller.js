import { DeliveryService } from "../services/deliveries.service.js";
import { ORDER_STATUS } from "../constants/index.js";


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
        const update = {
            status: req.body.status,
        }

        if (req.body.status === ORDER_STATUS.ASSIGNED) {
            update.assignedAt = new Date();
        }

        if (req.body.status === ORDER_STATUS.DELIVERED) {
            update.deliveredAt = new Date();
        }

        const delivery = await DeliveryService.update(req.params.id, update, {
            new: true,
            runValidators: true,
        });

        if (!delivery) {
            return res.status(404).json({ status: "error", message: "Entrega no encontrada" });
        }
        res.status(200).json({ status: "success", payload: delivery });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const delivery = await DeliveryService.delete(req.params.id);

        if (!delivery) {
            return res.status(404).json({ status: "error", message: "Entrega no encontrada" });
        }
        res.status(200).json({ status: "success", payload: delivery });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}