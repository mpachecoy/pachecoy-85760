import { OrderRepository } from "../repositories/orders.repository.js";
import { ProductRepository } from "../repositories/products.repository.js";
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

        const validatedItems = [];
        const stockUpdates = [];
        for (const item of items) {
            if (!item.quantity || item.quantity <= 0) {
                throw createError("INVALID_ITEMS");
            }
            const product = await ProductRepository.getById(item.product);
            if (!product) {
                throw createError("PRODUCT_NOT_FOUND");
            }
            if (product.stock < item.quantity) {
                throw createError("INVALID_ITEMS", `Stock insuficiente para el producto ${product.title}`);
            }
            validatedItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
            stockUpdates.push({ id: product._id, newStock: product.stock - item.quantity });
        }

        const total = validatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const newOrder = {
            ...orderData,
            items: validatedItems,
            total,
            status: ORDER_STATUS.CREATED,
            priority: priority || DELIVERY_PRIORITY.NORMAL,

        }
        const order = await OrderRepository.create(newOrder);

        for (const update of stockUpdates) {
            await ProductRepository.update(update.id, { stock: update.newStock });
        }

        return order;
    },

    async updateStatusOrder(oid, status) {
        const order = await OrderRepository.getById(oid);
        if (!order) {
            throw createError("ORDER_NOT_FOUND");
        }
        const validStatuses = Object.values(ORDER_STATUS);
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