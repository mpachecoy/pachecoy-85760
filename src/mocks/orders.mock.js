import { faker } from "@faker-js/faker";
import { USER_ROLES } from "../constants/index.constants.js";

export const generateMockOrder = () => {
    return {
        userId: faker.string.uuid(),
        storeId: faker.string.uuid(),
        productId: faker.string.uuid(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        total: faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }),
        status: faker.helpers.arrayElement(["pending", "completed", "cancelled"])
    };
}

export const generateMockOrders = (n) => faker.helpers.multiple(generateMockOrder, { count: parseInt(n) });