import { DeliveryRepository } from "../repositories/deliveries.repository.js";
import { OrderRepository } from "../repositories/orders.repository.js";
import { ORDER_STATUS, USER_ROLES } from "../constants/index.constants.js";
import { createError } from "../utils/api.response.js";

export const DeliveryService = {
    async getAll() {
        const deliveries = await DeliveryRepository.getAll();
        if (!deliveries) {
            throw createError("DELIVERY_NOT_FOUND");
        }
        return deliveries;
    },

    async getById(did, requestingUser) {
        const delivery = await DeliveryRepository.getById(did);
        if (!delivery) {
            throw createError("DELIVERY_NOT_FOUND");
        }
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        const isAssignedDriver = delivery.driver && delivery.driver._id.toString() === requestingUser._id.toString();
        const isStoreOwner = delivery.order.store.owner.toString() === requestingUser._id.toString()
        if (!isAdmin && !isAssignedDriver && !isStoreOwner) {
            throw createError("FORBIDDEN");
        }
        return delivery;
    },

    async create(deliveryData, requestingUser) {
        const { order } = deliveryData;
        if (!order) {
            throw createError("MISSING_REQUIRED_DATA");
        }
        const orderFound = await OrderRepository.getById(order);
        if (!orderFound) {
            throw createError("ORDER_NOT_FOUND");
        }
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        const isStoreOwner = orderFound.store.owner.toString() === requestingUser._id.toString();
        if (!isAdmin && !isStoreOwner) {
            throw createError("FORBIDDEN");
        }

        const status = deliveryData.status || ORDER_STATUS.CREATED;
        deliveryData.status = status;
        deliveryData.assignedAt = status === ORDER_STATUS.ASSIGNED ? new Date() : null;
        deliveryData.deliveredAt = status === ORDER_STATUS.DELIVERED ? new Date() : null;
        return await DeliveryRepository.create(deliveryData);
    },

    async update(did, deliveryUpdateData, requestingUser) {
        const delivery = await DeliveryRepository.getById(did);
        if (!delivery) {
            throw createError("DELIVERY_NOT_FOUND");
        }

        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        const isAssignedDriver = delivery.driver && delivery.driver._id.toString() === requestingUser._id.toString();
        const isStoreOwner = delivery.order.store.owner.toString() === requestingUser._id.toString()
        if (!isAdmin && !isAssignedDriver && !isStoreOwner) {
            throw createError("FORBIDDEN");
        }

        const { status } = deliveryUpdateData;
        if (!status) {
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


