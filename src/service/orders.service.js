import { OrderRepository } from "../repository/orders.respository.js";
import { ORDER_STATUS, DELIVERY_PRIORITY } from "../constants/index.constants.js";


export const OrderService = {
    async getAll() {
        const orders = await OrderRepository.getAll();
        if (!orders) {
            throw new Error("No se encontraron pedidos");
        }
        return orders;
    },

    async getById(oid) {
        const order = await OrderRepository.getById(oid);
        if (!order) {
            throw new Error("Pedido no encontrado");
        }
        return order;
    },

    async create(orderData) {
        const { customer, store, items, deliveryAddress, priority } = orderData;
        if (!customer || !store || !items || !deliveryAddress) {
            throw new Error("Datos obligatorios no proporcionados");
        }
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error("El pedido debe tener al menos un producto");
        }
        const customerFound = await OrderRepository.getCustomerById(customer);
        if (!customerFound) {
            throw new Error("Usuario no encontrado");
        }
        const storeFound = await OrderRepository.getStoreById(store);
        if (!storeFound) {
            throw new Error("Comercio no encontrado");
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
            throw new Error("Pedido no encontrado");
        }
        const validStatuses = [ORDER_STATUS.PENDING, ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED];
        if (!validStatuses.includes(status)) {
            throw new Error("Estado inválido");
        }
        const updatedOrder = await OrderRepository.updateStatusOrder(id, status);
        return updatedOrder;
    },

    async delete(oid) {
        const order = await OrderRepository.getById(oid);
        if (!order) {
            throw new Error("Pedido no encontrado");
        }
        const deletedOrder = await OrderRepository.delete(oid);
        return deletedOrder;
    }
}