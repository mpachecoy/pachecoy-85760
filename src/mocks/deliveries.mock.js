import { faker } from "@faker-js/faker";
import { USER_ROLES } from "../constants/index.constants.js";

export const generateMockDelivery = () => {
    return {
        userId: faker.string.uuid(),
        storeId: faker.string.uuid(),
        orderId: faker.string.uuid(),
        deliveryId: faker.string.uuid(),
        status: faker.helpers.arrayElement(["pending", "completed", "cancelled"])
    };
}

export const generateMockDeliveries = (n) => faker.helpers.multiple(generateMockDelivery, { count: parseInt(n) });