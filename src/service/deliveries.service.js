import { DeliveryRepository } from "../repository/deliveries.repository.js";
import { ORDER_STATUS } from "../constants/index.constants.js";

export const DeliveryService = {
    async getAll() {
        const deliveries = await DeliveryRepository.getAll();
        if (!deliveries) {
            const error = new Error("No se encontraron entregas");
            error.statusCode = 404;
            throw error;
        }
        return deliveries;
    },

    async getById(did) {
        const delivery = await DeliveryRepository.getById(did);
        if (!delivery) {
            const error = new Error("Entrega no encontrada");
            error.statusCode = 404;
            throw error;
        }
        return delivery;
    },

    async create(deliveryData) {
        const { order, driver, status, priority, assignedAt, deliveredAt } = deliveryData;
        if (!order || !driver || !status || !priority) {
            const error = new Error("Datos obligatorios no proporcionados");
            error.statusCode = 400;
            throw error;
        }
        assignedAt = status === ORDER_STATUS.ASSIGNED ? new Date() : null;
        deliveredAt = status === ORDER_STATUS.DELIVERED ? new Date() : null;
        return await DeliveryRepository.create(deliveryData);
    },

    async update(did, deliveryUpdateData) {
        const delivery = await DeliveryRepository.getById(did);
        const { priority, status, assignedAt, deliveredAt } = deliveryUpdateData;

        if (!delivery) {
            const error = new Error("Entrega no encontrada");
            error.statusCode = 404;
            throw error;
        }
        if (!priority || !status) {
            const error = new Error("Datos obligatorios no proporcionados");
            error.statusCode = 400;
            throw error;
        }
        if (status === ORDER_STATUS.ASSIGNED) {
            assignedAt = new Date();
        }
        if (status === ORDER_STATUS.DELIVERED) {
            deliveredAt = new Date();
        }

        return await DeliveryRepository.update(did, deliveryUpdateData);
    },

    async delete(did) {
        const delivery = await DeliveryRepository.getById(did);
        if (!delivery) {
            const error = new Error("Entrega no encontrada");
            error.statusCode = 404;
            throw error;
        }
        return await DeliveryRepository.delete(did);
    }
}