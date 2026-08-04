import { generateMockUsers } from "../mocks/user.mock.js";
import { generateMockStores } from "../mocks/store.mock.js";
import { generateMockProducts } from "../mocks/products.mock.js";
import { generateMockOrders } from "../mocks/orders.mock.js";
import { generateMockDeliveries } from "../mocks/deliveries.mock.js";
import { UserRepository } from "../repositories/users.repository.js";
import { createError } from "../utils/api.response.js";

const parseCount = (n) => {
    const count = parseInt(n, 10);
    if (!Number.isInteger(count) || count <= 0) {
        throw createError("INVALID_INPUT", "La cantidad debe ser un número entero positivo");
    }
    return count;
};

export const mockDataService = {
    async createUser(n) {
        const count = parseCount(n);
        const users = generateMockUsers(count);
        return users;
    },

    async createStores(n) {
        const count = parseCount(n);
        const stores = generateMockStores(count);
        return stores;
    },

    async createProducts(n) {
        const count = parseCount(n);
        const products = generateMockProducts(count);
        return products;
    },

    async createOrders(n) {
        const count = parseCount(n);
        const orders = generateMockOrders(count);
        return orders;
    },

    async createDeliveries(n) {
        const count = parseCount(n);
        const deliveries = generateMockDeliveries(count);
        return deliveries;
    },

    async saveUsers(n) {
        const count = parseCount(n);
        const users = generateMockUsers(count);
        const usersSaved = await UserRepository.create(users);
        return usersSaved;
    }
}