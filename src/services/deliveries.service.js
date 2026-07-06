import { DeliveryRepository } from "../repositories/deliveries.repository.js";
import { ORDER_STATUS } from "../constants/index.constants.js";
import { createError } from "../utils/api.response.js";

export const DeliveryService = {
    async getAll() {
        const deliveries = await DeliveryRepository.getAll();
        if (!deliveries) {
            throw createError("DELIVERY_NOT_FOUND");
        }
        return deliveries;
    },

    async getById(did) {
        const delivery = await DeliveryRepository.getById(did);
        if (!delivery) {
            throw createError("DELIVERY_NOT_FOUND");
        }
        return delivery;
    },

    async create(deliveryData) {
        const { order, driver, status, priority } = deliveryData;
        if (!order || !driver || !status || !priority) {
            throw createError("MISSING_REQUIRED_DATA");
        }
        deliveryData.assignedAt = status === ORDER_STATUS.ASSIGNED ? new Date() : null;
        deliveryData.deliveredAt = status === ORDER_STATUS.DELIVERED ? new Date() : null;
        return await DeliveryRepository.create(deliveryData);
    },

    async update(did, deliveryUpdateData) {
        const delivery = await DeliveryRepository.getById(did);

        if (!delivery) {
            throw createError("DELIVERY_NOT_FOUND");
        }

        const { status, priority } = deliveryUpdateData;

        if (!status || !priority) {
            throw createError("MISSING_REQUIRED_DATA");
        }

        if (status === ORDER_STATUS.ASSIGNED && !delivery.assignedAt) {
            deliveryUpdateData.assignedAt = new Date();
        }

        if (status === ORDER_STATUS.DELIVERED && !delivery.deliveredAt) {
            deliveryUpdateData.deliveredAt = new Date();
        }

        return await DeliveryRepository.update(did, deliveryUpdateData);
    },

    async delete(did) {
        const delivery = await DeliveryRepository.getById(did);
        if (!delivery) {
            throw createError("DELIVERY_NOT_FOUND");
        }
        return await DeliveryRepository.delete(did);
    },
};


