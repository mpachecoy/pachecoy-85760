import { OrderRepository } from "../repositories/orders.repository.js";
import { ORDER_STATUS, DELIVERY_PRIORITY } from "../constants/index.constants.js";


export const OrderService = {
    async getAll() {
        const orders = await OrderRepository.getAll();
        if (!orders) {
            const error = new Error("No se encontraron pedidos");
            error.statusCode = 404;
            throw error;
        }
        return orders;
    },

    async getById(oid) {
        const order = await OrderRepository.getById(oid);
        if (!order) {
            const error = new Error("Pedido no encontrado");
            error.statusCode = 404;
            throw error;
        }
        return order;
    },

    async create(orderData) {
        const { customer, store, items, deliveryAddress, priority } = orderData;
        if (!customer || !store || !items || !deliveryAddress) {
            const error = new Error("Datos obligatorios no proporcionados");
            error.statusCode = 400;
            throw error;
        }
        if (!Array.isArray(items) || items.length === 0) {
            const error = new Error("El pedido debe tener al menos un producto");
            error.statusCode = 400;
            throw error;
        }
        const customerFound = await OrderRepository.getCustomerById(customer);
        if (!customerFound) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }
        const storeFound = await OrderRepository.getStoreById(store);
        if (!storeFound) {
            const error = new Error("Comercio no encontrado");
            error.statusCode = 404;
            throw error;
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
            const error = new Error("Pedido no encontrado");
            error.statusCode = 404;
            throw error;
        }
        const validStatuses = [ORDER_STATUS.PENDING, ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED];
        if (!validStatuses.includes(status)) {
            const error = new Error("Estado inválido");
            error.statusCode = 400;
            throw error;
        }
        const updatedOrder = await OrderRepository.updateStatusOrder(id, status);
        return updatedOrder;
    },

    async delete(oid) {
        const order = await OrderRepository.getById(oid);
        if (!order) {
            const error = new Error("Pedido no encontrado");
            error.statusCode = 404;
            throw error;
        }
        const deletedOrder = await OrderRepository.delete(oid);
        return deletedOrder;
    }
}