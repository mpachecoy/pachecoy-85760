import { DeliveryRepository } from "../repository/deliveries.repository.js";
import { ORDER_STATUS } from "../constants/index.constants.js";

export const DeliveryService = {
    async getAll() {
        const deliveries = await DeliveryRepository.getAll();
        if (!deliveries) {
            throw new Error("No se encontraron entregas");
        }
        return deliveries;
    },

    async getById(did) {
        const delivery = await DeliveryRepository.getById(did);
        if (!delivery) {
            throw new Error("Entrega no encontrada");
        }
        return delivery;
    },

    async create(deliveryData) {
        const { order, driver, status, priority, assignedAt, deliveredAt } = deliveryData;
        if (!order || !driver || !status || !priority) {
            throw new Error("Datos obligatorios no proporcionados");
        }
        assignedAt = status === ORDER_STATUS.ASSIGNED ? new Date() : null;
        deliveredAt = status === ORDER_STATUS.DELIVERED ? new Date() : null;
        return await DeliveryRepository.create(deliveryData);
    },

    async update(did, deliveryUpdateData) {
        const delivery = await DeliveryRepository.getById(did);
        const { priority, status, assignedAt, deliveredAt } = deliveryUpdateData;

        if (!delivery) {
            throw new Error("Entrega no encontrada");
        }
        if (!priority || !status) {
            throw new Error("Datos obligatorios no proporcionados");
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
            throw new Error("Entrega no encontrada");
        }
        return await DeliveryRepository.delete(did);
    }
}