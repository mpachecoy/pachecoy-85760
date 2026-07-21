import { OrderRepository } from "../repositories/orders.repository.js";
import { ORDER_STATUS, DELIVERY_PRIORITY } from "../constants/index.constants.js";
import { createError } from "../utils/api.response.js";

export const OrderService = {
    async getAll() {
        const orders = await OrderRepository.getAll();
        if (!orders) {
            throw createError("ORDER_NOT_FOUND");
        }
        return orders;
    },

    async getById(oid) {
        const order = await OrderRepository.getById(oid);
        if (!order) {
            throw createError("ORDER_NOT_FOUND");
        }
        return order;
    },


    async create(orderData) {
        const { customer, store, items, deliveryAddress, priority } = orderData;
        if (!customer || !store || !items || !deliveryAddress) {
            throw createError("MISSING_REQUIRED_DATA");
        }
        if (!Array.isArray(items) || items.length === 0) {
            throw createError("INVALID_ITEMS");
        }
        const customerFound = await OrderRepository.getCustomerById(customer);
        if (!customerFound) {
            throw createError("USER_NOT_FOUND");
        }
        const storeFound = await OrderRepository.getStoreById(store);
        if (!storeFound) {
            throw createError("STORE_NOT_FOUND");
        }
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const newOrder = {
            ...orderData,
            total,
            status: ORDER_STATUS.CREATED,
            priority: priority || DELIVERY_PRIORITY.NORMAL,

        }
        return await OrderRepository.create(newOrder);
    },

    async updateStatusOrder(oid, status) {
        const order = await OrderRepository.getById(oid);
        if (!order) {
            throw createError("ORDER_NOT_FOUND");
        }
        const validStatuses = [ORDER_STATUS.PENDING, ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED, ORDER_STATUS.IN_PROGRESS, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.PICKED_UP, ORDER_STATUS.DELIVERED, ORDER_STATUS.REJECTED, ORDER_STATUS.CONFIRMED];
        if (!validStatuses.includes(status)) {
            throw createError("INVALID_STATUS");
        }
        const updatedOrder = await OrderRepository.updateStatusOrder(oid, status);
        return updatedOrder;
    },

    async delete(oid) {
        const order = await OrderRepository.getById(oid);
        if (!order) {
            throw createError("ORDER_NOT_FOUND");
        }
        const deletedOrder = await OrderRepository.delete(oid);
        return deletedOrder;
    }
}