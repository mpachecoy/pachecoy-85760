import { faker } from "@faker-js/faker";
import { USER_ROLES } from "../constants/index.constants.js";

export const mockProduct = () => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 0, max: 100 }),
        storeId: faker.string.uuid()
    };
}

export const generateMockProducts = (n) => faker.helpers.multiple(mockProduct, { count: parseInt(n) });