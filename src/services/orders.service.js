import { OrderRepository } from "../repositories/orders.repository.js";
import { ProductRepository } from "../repositories/products.repository.js";
import { ORDER_STATUS, DELIVERY_PRIORITY, USER_ROLES, DOCUMENT_TYPES } from "../constants/index.constants.js";
import { createError } from "../utils/api.response.js";

export const OrderService = {
    async getAll() {
        const orders = await OrderRepository.getAll();
        if (!orders) {
            throw createError("ORDER_NOT_FOUND");
        }
        return orders;
    },

    async getById(oid, requestingUser) {
        const order = await OrderRepository.getById(oid);
        if (!order) {
            throw createError("ORDER_NOT_FOUND");
        }
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        const isCustomerOwner = order.customer._id.toString() === requestingUser._id.toString();
        const isStoreOwner = order.store.owner.toString() === requestingUser._id.toString();

        if (!isAdmin && !isCustomerOwner && !isStoreOwner) {
            throw createError("FORBIDDEN");
        }
        return order;
    },


    async create(orderData, requestingUser) {
        const { customer, store, items, deliveryAddress, priority } = orderData;
        if (!customer || !store || !items || !deliveryAddress) {
            throw createError("MISSING_REQUIRED_DATA");
        }
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        if (!isAdmin && customer !== requestingUser._id.toString()) {
            throw createError("FORBIDDEN", "No podés crear un pedido a nombre de otro usuario");
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

    async updateStatusOrder(oid, status, requestingUser) {
        const order = await OrderRepository.getById(oid);
        if (!order) {
            throw createError("ORDER_NOT_FOUND");
        }
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        const isStoreOwner = order.store.owner.toString() === requestingUser._id.toString();
        if (!isAdmin && !isStoreOwner) {
            throw createError("FORBIDDEN");
        }
        const validStatuses = Object.values(ORDER_STATUS);
        if (!validStatuses.includes(status)) {
            throw createError("INVALID_STATUS");
        }
        const updatedOrder = await OrderRepository.updateStatusOrder(oid, status);
        return updatedOrder;
    },

    async uploadProof(oid, file, requestingUser) {
        if (!file) {
            throw createError("FILE_REQUIRED");
        }
        const order = await OrderRepository.getById(oid);
        if (!order) {
            throw createError("ORDER_NOT_FOUND");
        }
        const isAdmin = requestingUser.role === USER_ROLES.ADMIN;
        const isStoreOwner = order.store.owner.toString() === requestingUser._id.toString();
        if (!isAdmin && !isStoreOwner) {
            throw createError("FORBIDDEN");
        }
        const proofDocument = {
            originalName: file.originalname,
            fileName: file.filename,
            path: file.path,
            mimeType: file.mimetype,
            size: file.size,
            type: DOCUMENT_TYPES.DELIVERY_PROOF
        }
        const proof = [...order.proof, proofDocument]
        const updatedOrder = await OrderRepository.update(oid, { proof });
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