import { OrderRepository } from "../repositories/orders.respository.js";
import { ORDER_STATUS, DELIVERY_PRIORITY } from "../constants/index.js";


export const OrderService = {
    async getAll() {
        return await OrderRepository.getAll();
    },

    async getById(oid) {
        const order = await OrderRepository.getById(oid);
        if (!order) {
            return res.status(404).json({ status: "error", message: "Pedido no encontrado" });
        }
        return order;
    },

    async create(orderData) {
        const { customer, store, items, deliveryAddress, priority } = orderData;
        if (!customer || !store || !items || !deliveryAddress) {
            return res.status(400).json({ status: "error", message: "Datos obligatorios no proporcionados" });
        }
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ status: "error", message: "El pedido debe tener al menos un producto" });
        }
        const customerFound = await OrderRepository.getCustomerById(customer);
        if (!customerFound) {
            return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
        }
        const storeFound = await OrderRepository.getStoreById(store);
        if (!storeFound) {
            return res.status(404).json({ status: "error", message: "Comercio no encontrado" });
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
            return res.status(404).json({ status: "error", message: "Pedido no encontrado" });
        }
        const validStatuses = [ORDER_STATUS.PENDING, ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ status: "error", message: "Estado inválido" });
        }
        const updatedOrder = await OrderRepository.updateStatusOrder(id, status);
        return updatedOrder;
    },

    async delete(oid) {
        const order = await OrderRepository.getById(oid);
        if (!order) {
            return res.status(404).json({ status: "error", message: "Pedido no encontrado" });
        }
        const deletedOrder = await OrderRepository.delete(oid);
        return deletedOrder;
    }
}