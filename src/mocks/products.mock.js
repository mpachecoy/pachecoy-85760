import { faker } from "@faker-js/faker";

export const mockProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 0, max: 100 }),
        category: faker.commerce.department(),
        store: faker.database.mongodbObjectId(),
        order: faker.database.mongodbObjectId()
    };
}

export const generateMockProducts = (n) => faker.helpers.multiple(mockProduct, { count: parseInt(n) });