import { UserRepository } from "../repositories/users.repository.js";
import { USER_ROLES } from "../constants/index.constants.js";
import { ProductRepository } from "../repositories/products.repository.js";
import { OrderRepository } from "../repositories/orders.repository.js";
import { DeliveryRepository } from "../repositories/deliveries.repository.js";
import { StoreRepository } from "../repositories/stores.repository.js";


export const mockDataService = {
    async createMockUsers(n) {
        const users = [];
        for (let i = 0; i < n; i++) {
            const user = {
                firstName: `User ${i}`,
                lastName: `Last ${i}`,
                email: `user${i}@example.com`,
                password: "password123",
                role: USER_ROLES.CUSTOMER
            };
            users.push(user);
        }
        return users;
    },

    async createMockStores(n) {
        const stores = [];
        for (let i = 0; i < n; i++) {
            const store = {
                name: `Store ${i}`,
                address: `Address ${i}`,
                phone: `Phone ${i}`,
                email: `store${i}@example.com`,
                role: USER_ROLES.STORE,
                storeId: `storeId${i}`
            };
            stores.push(store);
        }
        return stores;
    },

    async createMockProducts(n) {
        const products = [];
        for (let i = 0; i < n; i++) {
            const product = {
                name: `Product ${i}`,
                price: i * 10,
                stock: i,
                storeId: `storeId${i % 10}`
            };
            products.push(product);
        }
        return products;
    },

    async createMockOrders(n) {
        const orders = [];
        for (let i = 0; i < n; i++) {
            const order = {
                userId: `userId${i % 10}`,
                storeId: `storeId${i % 10}`,
                productId: `productId${i % 10}`,
                quantity: i + 1,
                total: (i + 1) * 10,
                status: "pending"
            };
            orders.push(order);
        }
        return orders;
    },

    async createMockDeliveries(n) {
        const deliveries = [];
        for (let i = 0; i < n; i++) {
            const delivery = {
                userId: `userId${i % 10}`,
                storeId: `storeId${i % 10}`,
                orderId: `orderId${i % 10}`,
                deliveryId: `deliveryId${i % 10}`,
                status: "pending"
            };
            deliveries.push(delivery);
        }
        return deliveries;
    },

    async saveMockUsers(users) {
        for (const user of users) {
            await UserRepository.create(user);
        }
    },
    async saveMockStores(stores) {
        for (const store of stores) {
            await StoreRepository.create(store);
        }
    },
    async saveMockProducts(products) {
        for (const product of products) {
            await ProductRepository.create(product);
        }
    },
    async saveMockOrders(orders) {
        for (const order of orders) {
            await OrderRepository.create(order);
        }
    },
    async saveMockDeliveries(deliveries) {
        for (const delivery of deliveries) {
            await DeliveryRepository.create(delivery);
        }
    }
}