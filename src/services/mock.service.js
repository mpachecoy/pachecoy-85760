import { generateMockUsers } from "../mocks/user.mock.js";
import { generateMockStores } from "../mocks/store.mock.js";
import { generateMockProducts } from "../mocks/products.mock.js";
import { generateMockOrders } from "../mocks/orders.mock.js";
import { generateMockDeliveries } from "../mocks/deliveries.mock.js";
import { UserRepository } from "../repositories/users.repository.js";




export const mockDataService = {
    async createUser(n) {
        const user = generateMockUsers(n);
        return user;
    },


    async createStores(n) {
        const stores = generateMockStores(n);
        return stores;
    },

    async createProducts(n) {
        const products = generateMockProducts(n);
        return products;
    },

    async createOrders(n) {
        const orders = generateMockOrders(n);
        return orders;
    },

    async createDeliveries(n) {
        const deliveries = generateMockDeliveries(n);
        return deliveries;
    },

    async saveUsers(n) {
        const users = generateMockUsers(n);
        const usersSaved = await UserRepository.create(users);
        return usersSaved;
    },

}