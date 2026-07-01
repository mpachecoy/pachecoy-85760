import { faker } from "@faker-js/faker";
import { ORDER_STATUS, DELIVERY_PRIORITY } from "../constants/index.constants.js";

export const generateMockDelivery = () => {
    return {
        order: faker.database.mongodbObjectId(),
        driver: faker.database.mongodbObjectId(),
        status: faker.helpers.arrayElement([ORDER_STATUS.CREATED, ORDER_STATUS.ASSIGNED, ORDER_STATUS.PICKED_UP, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED]),
        priority: faker.helpers.arrayElement([DELIVERY_PRIORITY.LOW, DELIVERY_PRIORITY.NORMAL, DELIVERY_PRIORITY.HIGH])
    };
}

export const generateMockDeliveries = (n) => faker.helpers.multiple(generateMockDelivery, { count: parseInt(n) });